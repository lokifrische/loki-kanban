'use client';

import { useState, useEffect } from 'react';
import { Task, TaskStatus } from '@/types/task';
import KanbanColumn from './KanbanColumn';
import AddTaskForm from './AddTaskForm';

const STORAGE_KEY = 'loki-kanban-tasks';

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setTasks(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse stored tasks:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, isLoaded]);

  const addTask = (newTask: Omit<Task, 'id' | 'createdAt'>) => {
    const task: Task = {
      ...newTask,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, task]);
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, status } : task))
    );
  };

  const statuses: TaskStatus[] = ['todo', 'inProgress', 'done'];

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <AddTaskForm onAdd={addTask} />
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-4">
        {statuses.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasks}
            onDelete={deleteTask}
            onStatusChange={updateTaskStatus}
          />
        ))}
      </div>

      <div className="mt-6 text-sm text-gray-500">
        Total tasks: {tasks.length} | 
        To Do: {tasks.filter(t => t.status === 'todo').length} | 
        In Progress: {tasks.filter(t => t.status === 'inProgress').length} | 
        Done: {tasks.filter(t => t.status === 'done').length}
      </div>
    </div>
  );
}
