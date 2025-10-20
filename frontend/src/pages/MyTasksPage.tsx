import { useState, useEffect } from 'react';
import { userApi } from '@/services/api';
import { ClipboardList, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import type { Task } from '@/types';
import TaskModal from '@/components/TaskModal';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverEvent,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const statusColors = {
  TODO: 'bg-gray-100 text-gray-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  DONE: 'bg-green-100 text-green-800',
  BLOCKED: 'bg-red-100 text-red-800',
};

const statusLabels = {
  TODO: '대기',
  IN_PROGRESS: '진행중',
  DONE: '완료',
  BLOCKED: '차단됨',
};

const priorityColors = {
  HIGH: 'text-red-600',
  MEDIUM: 'text-yellow-600',
  LOW: 'text-green-600',
};

const priorityLabels = {
  HIGH: '높음',
  MEDIUM: '보통',
  LOW: '낮음',
};

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
  onComplete?: (taskId: number) => void;
  onClick?: () => void;
}

function TaskCard({ task, isDragging = false, onComplete, onClick }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleCompleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onComplete && task.status !== 'DONE') {
      onComplete(task.id);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger onClick if clicking on buttons or dragging
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onClick?.();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleCardClick}
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition cursor-pointer"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
          {task.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium ${priorityColors[task.priority]}`}>
            {priorityLabels[task.priority]}
          </span>
          {task.status !== 'DONE' && onComplete && (
            <button
              onClick={handleCompleteClick}
              className="p-1 hover:bg-green-100 dark:hover:bg-green-900 rounded transition"
              title="완료 처리"
            >
              <CheckCircle className="w-4 h-4 text-green-600" />
            </button>
          )}
        </div>
      </div>

      {task.description && (
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{task.projectName}</span>
        {task.dueDate && (
          <span>{new Date(task.dueDate).toLocaleDateString('ko-KR')}</span>
        )}
      </div>
    </div>
  );
}

interface DroppableColumnProps {
  status: keyof typeof statusLabels;
  tasks: Task[];
  isOver?: boolean;
  onComplete?: (taskId: number) => void;
  onTaskClick?: (task: Task) => void;
}

function DroppableColumn({ status, tasks, isOver = false, onComplete, onTaskClick }: DroppableColumnProps) {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-gray-900 dark:text-gray-100">
          {statusLabels[status]}
        </h2>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
          {tasks.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={`space-y-3 min-h-[200px] p-2 rounded-lg border-2 border-dashed transition-colors ${
          isOver
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-transparent'
        }`}
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={onComplete}
              onClick={() => onTaskClick?.(task)}
            />
          ))}

          {tasks.length === 0 && (
            <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
              태스크 없음
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
}

export default function MyTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await userApi.getMyTasks();
      setTasks(data);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    setOverId(over?.id as string || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    setOverId(null);

    if (!over) return;

    const activeTaskObj = tasks.find(t => t.id === active.id);
    if (!activeTaskObj) return;

    let newStatus: string | null = null;

    // Check if dropped on a column
    if (over.id === 'TODO' || over.id === 'IN_PROGRESS' || over.id === 'DONE' || over.id === 'BLOCKED') {
      newStatus = over.id as string;
    } else {
      // Dropped on another task - get that task's status
      const overTask = tasks.find(t => t.id === over.id);
      if (overTask) {
        newStatus = overTask.status;
      }
    }

    // Update if status changed
    if (newStatus && newStatus !== activeTaskObj.status) {
      try {
        await userApi.updateMyTask(activeTaskObj.id, { status: newStatus });
        await loadTasks();
      } catch (error) {
        console.error('Failed to update task status:', error);
        alert('태스크 상태 변경에 실패했습니다.');
      }
    }
  };

  const handleComplete = async (taskId: number) => {
    try {
      await userApi.updateMyTask(taskId, { status: 'DONE' });
      await loadTasks();
    } catch (error) {
      console.error('Failed to complete task:', error);
      alert('태스크 완료 처리에 실패했습니다.');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const groupedTasks = {
    TODO: tasks.filter(t => t.status === 'TODO'),
    IN_PROGRESS: tasks.filter(t => t.status === 'IN_PROGRESS'),
    DONE: tasks.filter(t => t.status === 'DONE'),
    BLOCKED: tasks.filter(t => t.status === 'BLOCKED'),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">내 태스크</h1>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <ClipboardList className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">할당된 태스크가 없습니다.</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(groupedTasks).map(([status, taskList]) => (
              <DroppableColumn
                key={status}
                status={status as keyof typeof statusLabels}
                tasks={taskList}
                isOver={overId === status}
                onComplete={handleComplete}
                onTaskClick={handleTaskClick}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* Task Modal */}
      <AnimatePresence>
        {isModalOpen && selectedTask && (
          <TaskModal
            task={selectedTask}
            projectId={selectedTask.projectId}
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
