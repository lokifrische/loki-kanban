/**
 * Task service - Firestore operations for tasks
 * 
 * This module provides all CRUD operations for tasks using Firestore.
 * It handles real-time subscriptions and batch operations.
 */

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./config";
import type {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  TasksByStatus,
} from "@/types/task";

/** Firestore collection name */
const TASKS_COLLECTION = "tasks";

/** Reference to tasks collection */
const tasksRef = collection(db, TASKS_COLLECTION);

/**
 * Convert Firestore document to Task object
 */
function docToTask(doc: { id: string; data: () => Record<string, unknown> }): Task {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title as string,
    status: data.status as Task["status"],
    priority: data.priority as Task["priority"],
    createdAt: data.createdAt as string,
    updatedAt: data.updatedAt as string,
    dueDate: data.dueDate as string | undefined,
    tags: data.tags as string[] | undefined,
  };
}

/**
 * Get all tasks (one-time fetch)
 */
export async function getTasks(): Promise<Task[]> {
  const q = query(tasksRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docToTask);
}

/**
 * Subscribe to real-time task updates
 * Returns unsubscribe function
 */
export function subscribeToTasks(
  onUpdate: (tasks: Task[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const q = query(tasksRef, orderBy("createdAt", "desc"));
  
  return onSnapshot(
    q,
    (snapshot) => {
      const tasks = snapshot.docs.map(docToTask);
      onUpdate(tasks);
    },
    (error) => {
      console.error("Firestore subscription error:", error);
      onError?.(error);
    }
  );
}

/**
 * Create a new task
 */
export async function createTask(input: CreateTaskInput): Promise<Task> {
  const now = new Date().toISOString();
  
  const taskData = {
    title: input.title.trim(),
    status: input.status ?? "todo",
    priority: input.priority ?? "medium",
    createdAt: now,
    updatedAt: now,
    dueDate: input.dueDate ?? null,
    tags: input.tags ?? [],
  };
  
  const docRef = await addDoc(tasksRef, taskData);
  
  return {
    id: docRef.id,
    ...taskData,
    dueDate: taskData.dueDate ?? undefined,
    tags: taskData.tags.length > 0 ? taskData.tags : undefined,
  };
}

/**
 * Update an existing task
 */
export async function updateTask(
  taskId: string,
  input: UpdateTaskInput
): Promise<void> {
  const docRef = doc(db, TASKS_COLLECTION, taskId);
  
  const updateData: Record<string, unknown> = {
    updatedAt: new Date().toISOString(),
  };
  
  if (input.title !== undefined) {
    updateData.title = input.title.trim();
  }
  if (input.status !== undefined) {
    updateData.status = input.status;
  }
  if (input.priority !== undefined) {
    updateData.priority = input.priority;
  }
  if (input.dueDate !== undefined) {
    updateData.dueDate = input.dueDate;
  }
  if (input.tags !== undefined) {
    updateData.tags = input.tags;
  }
  
  await updateDoc(docRef, updateData);
}

/**
 * Delete a task
 */
export async function deleteTask(taskId: string): Promise<void> {
  const docRef = doc(db, TASKS_COLLECTION, taskId);
  await deleteDoc(docRef);
}

/**
 * Move task to a different status/column
 */
export async function moveTask(
  taskId: string,
  newStatus: Task["status"]
): Promise<void> {
  await updateTask(taskId, { status: newStatus });
}

/**
 * Group tasks by status for Kanban display
 */
export function groupTasksByStatus(tasks: Task[]): TasksByStatus {
  return {
    todo: tasks.filter((t) => t.status === "todo"),
    "in-progress": tasks.filter((t) => t.status === "in-progress"),
    done: tasks.filter((t) => t.status === "done"),
  };
}

/**
 * Get task by ID from a list of tasks
 */
export function findTaskById(tasks: Task[], taskId: string): Task | undefined {
  return tasks.find((t) => t.id === taskId);
}

/**
 * Search tasks by title
 */
export function searchTasks(tasks: Task[], query: string): Task[] {
  const lowerQuery = query.toLowerCase();
  return tasks.filter((t) => t.title.toLowerCase().includes(lowerQuery));
}
