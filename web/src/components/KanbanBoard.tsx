'use client';

import { useState, useEffect } from 'react';
import { Task, TaskStatus } from '@/types/task';
import KanbanColumn from './KanbanColumn';
import AddTaskForm from './AddTaskForm';
import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  doc, 
  onSnapshot,
  query,
  orderBy 
} from 'firebase/firestore';

const TASKS_COLLECTION = 'tasks';

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Subscribe to Firestore tasks collection
  useEffect(() => {
    const q = query(collection(db, TASKS_COLLECTION), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData: Task[] = [];
      snapshot.forEach((doc) => {
        tasksData.push({ id: doc.id, ...doc.data() } as Task);
      });
      setTasks(tasksData);
      setIsLoaded(true);
    }, (error) => {
      console.error('Error fetching tasks:', error);
      setIsLoaded(true);
    });

    return () => unsubscribe();
  }, []);

  const addTask = async (newTask: Omit<Task, 'id' | 'createdAt'>) => {
    try {
      await addDoc(collection(db, TASKS_COLLECTION), {
        ...newTask,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await deleteDoc(doc(db, TASKS_COLLECTION, id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const updateTaskStatus = async (id: string, status: TaskStatus) => {
    try {
      await updateDoc(doc(db, TASKS_COLLECTION, id), { status });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const statuses: TaskStatus[] = ['todo', 'inProgress', 'done'];

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading from Firebase...</div>
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
      
      <div className="mt-2 text-xs text-green-600">
        🔥 Connected to Firebase - Changes sync in real-time
      </div>
    </div>
  );
}
