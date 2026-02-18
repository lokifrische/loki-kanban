"use client";

/**
 * TaskCard Component
 * 
 * Displays a single task in the Kanban board.
 * Supports drag and drop, quick actions, and visual priority indicators.
 */

import { useState } from "react";
import type { Task } from "@/types/task";
import { deleteTask, moveTask } from "@/lib/firebase";

interface TaskCardProps {
  task: Task;
}

/**
 * Priority badge colors
 */
const priorityColors = {
  high: "bg-red-500/20 text-red-400 border-red-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  low: "bg-green-500/20 text-green-400 border-green-500/30",
};

/**
 * Priority icons
 */
const priorityIcons = {
  high: "🔴",
  medium: "🟡",
  low: "🟢",
};

export function TaskCard({ task }: TaskCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showActions, setShowActions] = useState(false);
  
  /**
   * Handle task deletion
   */
  const handleDelete = async () => {
    if (isDeleting) return;
    
    setIsDeleting(true);
    try {
      await deleteTask(task.id);
    } catch (error) {
      console.error("Failed to delete task:", error);
      setIsDeleting(false);
    }
  };
  
  /**
   * Handle quick status change
   */
  const handleStatusChange = async (newStatus: Task["status"]) => {
    try {
      await moveTask(task.id, newStatus);
    } catch (error) {
      console.error("Failed to move task:", error);
    }
  };
  
  /**
   * Format relative time
   */
  const formatRelativeTime = (isoString: string): string => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };
  
  return (
    <div
      className={`
        group relative bg-gray-800/50 border border-gray-700/50 rounded-lg p-3
        hover:border-gray-600 hover:bg-gray-800/70 transition-all duration-200
        ${isDeleting ? "opacity-50 pointer-events-none" : ""}
      `}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("taskId", task.id);
        e.dataTransfer.effectAllowed = "move";
      }}
    >
      {/* Priority indicator */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-lg" title={`${task.priority} priority`}>
          {priorityIcons[task.priority]}
        </span>
        
        {/* Actions */}
        <div
          className={`
            flex items-center gap-1 transition-opacity duration-200
            ${showActions ? "opacity-100" : "opacity-0"}
          `}
        >
          {task.status !== "in-progress" && (
            <button
              onClick={() => handleStatusChange("in-progress")}
              className="p-1 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded"
              title="Start task"
            >
              ▶
            </button>
          )}
          {task.status !== "done" && (
            <button
              onClick={() => handleStatusChange("done")}
              className="p-1 text-green-400 hover:text-green-300 hover:bg-green-500/20 rounded"
              title="Mark done"
            >
              ✓
            </button>
          )}
          <button
            onClick={handleDelete}
            className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded"
            title="Delete task"
          >
            ✕
          </button>
        </div>
      </div>
      
      {/* Title */}
      <h3 className="text-sm font-medium text-gray-200 mb-2 leading-snug">
        {task.title}
      </h3>
      
      {/* Footer */}
      <div className="flex items-center justify-between text-xs">
        <span className={`px-2 py-0.5 rounded border ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        <span className="text-gray-500" title={new Date(task.createdAt).toLocaleString()}>
          {formatRelativeTime(task.createdAt)}
        </span>
      </div>
      
      {/* Task ID (subtle) */}
      <div className="mt-2 text-[10px] text-gray-600 font-mono">
        {task.id.slice(0, 8)}
      </div>
    </div>
  );
}
