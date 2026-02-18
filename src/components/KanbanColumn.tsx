'use client';

import { Task, TaskStatus, STATUS_LABELS } from '@/types/task';
import TaskCard from './TaskCard';

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

const COLUMN_COLORS: Record<TaskStatus, string> = {
  todo: 'bg-red-50 border-red-200',
  inProgress: 'bg-yellow-50 border-yellow-200',
  done: 'bg-green-50 border-green-200',
};

const HEADER_COLORS: Record<TaskStatus, string> = {
  todo: 'bg-red-500',
  inProgress: 'bg-yellow-500',
  done: 'bg-green-500',
};

export default function KanbanColumn({ status, tasks, onDelete, onStatusChange }: KanbanColumnProps) {
  const filteredTasks = tasks.filter((task) => task.status === status);

  return (
    <div className={`flex-1 min-w-[300px] rounded-lg border-2 ${COLUMN_COLORS[status]}`}>
      <div className={`${HEADER_COLORS[status]} text-white p-3 rounded-t-md`}>
        <h2 className="font-bold text-lg">
          {STATUS_LABELS[status]} ({filteredTasks.length})
        </h2>
      </div>
      
      <div className="p-3 min-h-[400px]">
        {filteredTasks.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No tasks</p>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          ))
        )}
      </div>
    </div>
  );
}
