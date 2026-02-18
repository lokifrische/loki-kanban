export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'inProgress' | 'done';
  createdAt: string;
  dueDate?: string;
}

export type TaskStatus = Task['status'];

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'To Do',
  inProgress: 'In Progress',
  done: 'Done',
};
