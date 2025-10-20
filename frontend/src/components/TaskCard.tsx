import { motion } from 'framer-motion';
import { Clock, MoreVertical, Edit, Trash2, CheckCircle } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import type { Task } from '@/types';

interface Props {
  task: Task;
  onClick: () => void;
  onDelete?: (id: number) => void;
  onComplete?: (id: number) => void;
}

const priorityConfig = {
  HIGH: {
    color: 'bg-red-500',
    badge: 'bg-red-50 text-red-700 border-red-200',
    label: 'High',
  },
  MEDIUM: {
    color: 'bg-yellow-500',
    badge: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    label: 'Medium',
  },
  LOW: {
    color: 'bg-green-500',
    badge: 'bg-green-50 text-green-700 border-green-200',
    label: 'Low',
  },
};

export default function TaskCard({ task, onClick, onDelete, onComplete }: Props) {
  const priority = priorityConfig[task.priority];
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.02 }}
      className="group relative"
    >
      <div
        onClick={onClick}
        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100 hover:border-blue-200 overflow-hidden"
      >
        {/* Priority Indicator */}
        <div className={`h-1 ${priority.color}`} />

        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
                {task.name}
              </h4>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${priority.badge}`}>
                {priority.label}
              </span>
            </div>

            {/* Actions Menu */}
            <Menu as="div" className="relative ml-2">
              <Menu.Button
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-1 w-40 origin-top-right bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onClick();
                          }}
                          className={`${
                            active ? 'bg-gray-50' : ''
                          } flex items-center w-full px-3 py-2 text-sm text-gray-700`}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </button>
                      )}
                    </Menu.Item>
                    {task.status !== 'DONE' && onComplete && (
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onComplete(task.id);
                            }}
                            className={`${
                              active ? 'bg-gray-50' : ''
                            } flex items-center w-full px-3 py-2 text-sm text-green-700`}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark Complete
                          </button>
                        )}
                      </Menu.Item>
                    )}
                    {onDelete && (
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(task.id);
                            }}
                            className={`${
                              active ? 'bg-red-50' : ''
                            } flex items-center w-full px-3 py-2 text-sm text-red-700`}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </button>
                        )}
                      </Menu.Item>
                    )}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            {/* Due Date */}
            {task.dueDate && (
              <div className={`flex items-center text-xs ${
                isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'
              }`}>
                <Clock className={`w-3.5 h-3.5 mr-1 ${isOverdue ? 'text-red-600' : ''}`} />
                {new Date(task.dueDate).toLocaleDateString('ko-KR', {
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
            )}

            {/* Assignees */}
            {task.assignees && task.assignees.length > 0 && (
              <div className="flex items-center -space-x-2">
                {task.assignees.slice(0, 3).map((assignee) => (
                  <div
                    key={assignee.id}
                    className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-medium ring-2 ring-white"
                    title={assignee.name}
                  >
                    {assignee.name.charAt(0)}
                  </div>
                ))}
                {task.assignees.length > 3 && (
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-medium ring-2 ring-white">
                    +{task.assignees.length - 3}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Estimated Hours Badge */}
          {task.estimatedHours && (
            <div className="mt-2 inline-flex items-center text-xs text-gray-500">
              <Clock className="w-3 h-3 mr-1" />
              {task.estimatedHours}h
            </div>
          )}
        </div>

        {/* Hover Overlay */}
        <motion.div
          className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"
          initial={false}
        />
      </div>
    </motion.div>
  );
}
