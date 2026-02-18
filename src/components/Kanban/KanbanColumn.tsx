"use client";

/**
 * KanbanColumn Component
 * 
 * A single column in the Kanban board.
 * Handles drag-and-drop target functionality.
 */

import { useState } from "react";
import type { Task, TaskStatus } from "@/types/task";
import { moveTask } from "@/lib/firebase";
import { TaskCard } from "./TaskCard";

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
}

/**
 * Column configuration
 */
const columnConfig: Record<TaskStatus, { title: string; icon: string; color: string }> = {
  "todo": {
    title: "To Do",
    icon: "📋",
    color: "border-yellow-500/50",
  },
  "in-progress": {
    title: "In Progress",
    icon: "🔄",
    color: "border-blue-500/50",
  },
  "done": {
    title: "Done",
    icon: "✅",
    color: "border-green-500/50",
  },
};

export function KanbanColumn({ status, tasks }: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const config = columnConfig[status];
  
  /**
   * Handle drag over
   */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  };
  
  /**
   * Handle drag leave
   */
  const handleDragLeave = () => {
    setIsDragOver(false);
  };
  
  /**
   * Handle drop
   */
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const taskId = e.dataTransfer.getData("taskId");
    if (!taskId) return;
    
    try {
      await moveTask(taskId, status);
    } catch (error) {
      console.error("Failed to move task:", error);
    }
  };
  
  return (
    <div
      className={`
        flex flex-col bg-gray-900/50 rounded-xl border-t-4 min-h-[500px]
        ${config.color}
        ${isDragOver ? "ring-2 ring-blue-500/50 bg-blue-900/10" : ""}
        transition-all duration-200
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-xl">{config.icon}</span>
          <h2 className="font-semibold text-gray-200">{config.title}</h2>
        </div>
        <span className="px-2 py-1 text-xs font-medium bg-gray-800 text-gray-400 rounded-full">
          {tasks.length}
        </span>
      </div>
      
      {/* Task List */}
      <div className="flex-1 p-3 space-y-3 overflow-y-auto">
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-600 text-sm">
            {isDragOver ? "Drop here" : "No tasks"}
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))
        )}
      </div>
    </div>
  );
}
