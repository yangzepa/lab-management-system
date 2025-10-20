import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Loader2 } from 'lucide-react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  useDroppable,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { tasksApi, userApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import type { Task } from '@/types';
import TaskModal from './TaskModal';
import TaskCard from './TaskCard';
import SortableTaskCard from './SortableTaskCard';

interface Props {
  projectId: number;
}

const columns = [
  {
    id: 'TODO',
    title: 'To Do',
    color: 'from-gray-50 to-gray-100',
    borderColor: 'border-gray-200',
    icon: '📋'
  },
  {
    id: 'IN_PROGRESS',
    title: 'In Progress',
    color: 'from-blue-50 to-blue-100',
    borderColor: 'border-blue-200',
    icon: '🚀'
  },
  {
    id: 'DONE',
    title: 'Done',
    color: 'from-green-50 to-green-100',
    borderColor: 'border-green-200',
    icon: '✅'
  },
  {
    id: 'BLOCKED',
    title: 'Blocked',
    color: 'from-red-50 to-red-100',
    borderColor: 'border-red-200',
    icon: '🚫'
  },
];

// Droppable Column Component
function DroppableColumn({
  id,
  children,
  column,
  taskCount,
}: {
  id: string;
  children: React.ReactNode;
  column: typeof columns[0];
  taskCount: number;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <motion.div
      ref={setNodeRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-full"
    >
      {/* Column Header */}
      <div className={`bg-gradient-to-r ${column.color} rounded-t-xl border ${column.borderColor} px-4 py-3 shadow-sm`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{column.icon}</span>
            <h3 className="font-bold text-gray-800 text-sm">{column.title}</h3>
          </div>
          <motion.span
            key={taskCount}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-white px-2.5 py-1 rounded-full text-sm font-bold text-gray-700 shadow-sm"
          >
            {taskCount}
          </motion.span>
        </div>
      </div>

      {/* Droppable Area */}
      <div
        className={`flex-1 bg-gray-50/50 rounded-b-xl p-3 transition-all duration-200 min-h-[500px] border-x border-b ${column.borderColor} ${
          isOver ? 'ring-2 ring-blue-400 ring-offset-2' : ''
        }`}
      >
        {children}
      </div>
    </motion.div>
  );
}

export default function KanbanBoard({ projectId }: Props) {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'ADMIN';
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('');
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    loadTasks();
  }, [projectId]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = isAdmin
        ? await tasksApi.getAll({ projectId })
        : await userApi.getProjectTasks(projectId);
      setTasks(data);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === Number(active.id));
    setActiveTask(task || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = Number(active.id);
    const newStatus = over.id as Task['status'];
    const task = tasks.find((t) => t.id === taskId);

    if (!task || task.status === newStatus) return;

    // Optimistic update
    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      await userApi.updateTask(projectId, taskId, { status: newStatus });
    } catch (error) {
      console.error('Failed to update task:', error);
      alert('태스크 상태 변경에 실패했습니다.');
      loadTasks(); // Revert on error
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleTaskSave = async () => {
    await loadTasks();
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm('이 태스크를 삭제하시겠습니까?')) return;

    try {
      // Admin uses admin API, users use user API
      if (isAdmin) {
        await tasksApi.delete(taskId);
      } else {
        await userApi.deleteTask(projectId, taskId);
      }
      setTasks(tasks.filter((t) => t.id !== taskId));
    } catch (error) {
      console.error('Failed to delete task:', error);
      alert('태스크 삭제에 실패했습니다.');
    }
  };

  const handleCompleteTask = async (taskId: number) => {
    try {
      await tasksApi.update(taskId, { status: 'DONE' });
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? { ...task, status: 'DONE' } : task))
      );
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesPriority = filterPriority ? task.priority === filterPriority : true;
    return matchesSearch && matchesPriority;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-gray-500 text-sm">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-4 mb-6"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white cursor-pointer transition"
            >
              <option value="">All Priorities</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          <button
            onClick={() => {
              setSelectedTask(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-medium shadow-sm hover:shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">New Task</span>
          </button>
        </div>
      </motion.div>

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((column) => {
            const columnTasks = filteredTasks.filter((task) => task.status === column.id);
            const taskIds = columnTasks.map((task) => task.id);

            return (
              <DroppableColumn key={column.id} id={column.id} column={column} taskCount={columnTasks.length}>
                <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
                  <AnimatePresence mode="popLayout">
                    {columnTasks.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center h-full text-gray-400 py-8"
                      >
                        <div className="text-4xl mb-2">{column.icon}</div>
                        <p className="text-sm text-center">No tasks yet</p>
                        <p className="text-xs text-center mt-1">Drag tasks here or click + to add</p>
                      </motion.div>
                    ) : (
                      <div className="space-y-2">
                        {columnTasks.map((task) => (
                          <SortableTaskCard
                            key={task.id}
                            task={task}
                            onClick={() => handleTaskClick(task)}
                            onDelete={handleDeleteTask}
                            onComplete={handleCompleteTask}
                          />
                        ))}
                      </div>
                    )}
                  </AnimatePresence>
                </SortableContext>
              </DroppableColumn>
            );
          })}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="rotate-3 scale-105 opacity-80">
              <TaskCard
                task={activeTask}
                onClick={() => {}}
                onDelete={handleDeleteTask}
                onComplete={handleCompleteTask}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Task Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <TaskModal
            task={selectedTask}
            projectId={projectId}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedTask(null);
            }}
            onSave={handleTaskSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
