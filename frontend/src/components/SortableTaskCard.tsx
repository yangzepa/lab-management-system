import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '@/types';
import TaskCard from './TaskCard';

interface Props {
  task: Task;
  onClick: () => void;
  onDelete?: (id: number) => void;
  onComplete?: (id: number) => void;
}

export default function SortableTaskCard({ task, onClick, onDelete, onComplete }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard
        task={task}
        onClick={onClick}
        onDelete={onDelete}
        onComplete={onComplete}
      />
    </div>
  );
}
