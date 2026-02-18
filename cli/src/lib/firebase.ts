import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

// Same Firebase project as the web app
const firebaseConfig = {
  apiKey: "AIzaSyAwZD3UiBIScv92Qo4hihPqEROO0stDm9s",
  authDomain: "loki-kanban.firebaseapp.com",
  projectId: "loki-kanban",
  storageBucket: "loki-kanban.firebasestorage.app",
  messagingSenderId: "187584760436",
  appId: "1:187584760436:web:a0d151418b7a8f0d50df21"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'inProgress' | 'done';
  dueDate?: string;
  createdAt: string;
}

export const TASKS_COLLECTION = 'tasks';

export function subscribeToTasks(callback: (tasks: Task[]) => void): () => void {
  const q = query(collection(db, TASKS_COLLECTION), orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const tasks: Task[] = [];
    snapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() } as Task);
    });
    callback(tasks);
  }, (error) => {
    console.error('Error fetching tasks:', error);
  });
}

export async function addTask(task: Omit<Task, 'id' | 'createdAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, TASKS_COLLECTION), {
    ...task,
    description: task.description || '',
    dueDate: task.dueDate || '',
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}

export async function updateTaskStatus(id: string, status: Task['status']): Promise<void> {
  await updateDoc(doc(db, TASKS_COLLECTION, id), { status });
}

export async function deleteTask(id: string): Promise<void> {
  await deleteDoc(doc(db, TASKS_COLLECTION, id));
}
