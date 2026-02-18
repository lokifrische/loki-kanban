'use client';

import { Task } from '@/types/task';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Task['status']) => void;
}

export default function TaskCard({ task, onDelete, onStatusChange }: TaskCardProps) {
  const statusOptions: Task['status'][] = ['todo', 'inProgress', 'done'];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-3">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-800">{task.title}</h3>
        <button
          onClick={() => onDelete(task.id)}
          className="text-red-500 hover:text-red-700 text-sm"
        >
          ✕
        </button>
      </div>
      
      {task.description && (
        <p className="text-gray-600 text-sm mb-3">{task.description}</p>
      )}
      
      {task.dueDate && (
        <p className="text-xs text-gray-500 mb-2">Due: {task.dueDate}</p>
      )}
      
      <div className="flex gap-1 mt-2">
        {statusOptions.map((status) => (
          <button
            key={status}
            onClick={() => onStatusChange(task.id, status)}
            className={`text-xs px-2 py-1 rounded ${
              task.status === status
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status === 'todo' ? '📋' : status === 'inProgress' ? '🔄' : '✅'}
          </button>
        ))}
      </div>
    </div>
  );
}
