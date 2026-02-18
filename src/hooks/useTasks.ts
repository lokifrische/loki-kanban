"use client";

/**
 * useTasks Hook
 * 
 * Provides real-time task data from Firebase.
 * Handles loading states, errors, and automatic cleanup.
 */

import { useState, useEffect } from "react";
import type { Task } from "@/types/task";
import { subscribeToTasks } from "@/lib/firebase";

interface UseTasksResult {
  tasks: Task[];
  loading: boolean;
  error: Error | null;
}

/**
 * Subscribe to real-time task updates
 */
export function useTasks(): UseTasksResult {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = subscribeToTasks(
      (updatedTasks) => {
        setTasks(updatedTasks);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );
    
    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);
  
  return { tasks, loading, error };
}
