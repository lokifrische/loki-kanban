/**
 * Task status represents the Kanban column a task belongs to
 */
export type TaskStatus = "todo" | "in-progress" | "done";

/**
 * Task priority levels
 */
export type TaskPriority = "low" | "medium" | "high";

/**
 * Core task interface - represents a single task in the system
 */
export interface Task {
  /** Unique identifier (Firestore document ID) */
  id: string;
  
  /** Task title/description */
  title: string;
  
  /** Current status/column */
  status: TaskStatus;
  
  /** Priority level */
  priority: TaskPriority;
  
  /** ISO timestamp when task was created */
  createdAt: string;
  
  /** ISO timestamp when task was last updated */
  updatedAt: string;
  
  /** Optional due date (ISO timestamp) */
  dueDate?: string;
  
  /** Optional tags for categorization */
  tags?: string[];
}

/**
 * Data required to create a new task
 */
export interface CreateTaskInput {
  title: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  tags?: string[];
}

/**
 * Data for updating an existing task (all fields optional)
 */
export interface UpdateTaskInput {
  title?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | null;
  tags?: string[];
}

/**
 * Grouped tasks by status for Kanban display
 */
export interface TasksByStatus {
  todo: Task[];
  "in-progress": Task[];
  done: Task[];
}

/**
 * Terminal command result
 */
export interface CommandResult {
  success: boolean;
  message: string;
  data?: unknown;
}
