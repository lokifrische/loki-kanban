"use client";

/**
 * KanbanBoard Component
 * 
 * The main Kanban board view with three columns.
 * Includes quick add functionality and navigation back to terminal.
 */

import { useState } from "react";
import type { Task } from "@/types/task";
import { createTask, groupTasksByStatus } from "@/lib/firebase";
import { KanbanColumn } from "./KanbanColumn";

interface KanbanBoardProps {
  tasks: Task[];
  onNavigate?: (path: string) => void;
}

export function KanbanBoard({ tasks, onNavigate }: KanbanBoardProps) {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  
  const grouped = groupTasksByStatus(tasks);
  
  /**
   * Handle quick add task
   */
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTaskTitle.trim() || isAdding) return;
    
    setIsAdding(true);
    try {
      await createTask({ title: newTaskTitle.trim() });
      setNewTaskTitle("");
    } catch (error) {
      console.error("Failed to create task:", error);
    } finally {
      setIsAdding(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and title */}
            <div className="flex items-center gap-3">
              <span className="text-2xl">🦊</span>
              <h1 className="text-xl font-bold text-gray-100">Loki Kanban</h1>
            </div>
            
            {/* Quick add form */}
            <form onSubmit={handleAddTask} className="flex items-center gap-2">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Quick add task..."
                className="
                  px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg
                  text-sm text-gray-200 placeholder-gray-500
                  focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
                  w-64 transition-all
                "
                disabled={isAdding}
              />
              <button
                type="submit"
                disabled={!newTaskTitle.trim() || isAdding}
                className="
                  px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium
                  rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                {isAdding ? "Adding..." : "Add"}
              </button>
            </form>
            
            {/* Terminal link */}
            <button
              onClick={() => onNavigate?.("/")}
              className="
                flex items-center gap-2 px-4 py-2
                bg-gray-800 hover:bg-gray-700 border border-gray-700
                rounded-lg text-sm text-gray-300 transition-colors
              "
            >
              <span>⌨️</span>
              <span>Terminal</span>
            </button>
          </div>
        </div>
      </header>
      
      {/* Stats bar */}
      <div className="border-b border-gray-800 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-6 text-sm">
            <span className="text-gray-400">
              Total: <span className="text-gray-200 font-medium">{tasks.length}</span>
            </span>
            <span className="text-yellow-400">
              To Do: <span className="font-medium">{grouped.todo.length}</span>
            </span>
            <span className="text-blue-400">
              In Progress: <span className="font-medium">{grouped["in-progress"].length}</span>
            </span>
            <span className="text-green-400">
              Done: <span className="font-medium">{grouped.done.length}</span>
            </span>
          </div>
        </div>
      </div>
      
      {/* Kanban columns */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KanbanColumn status="todo" tasks={grouped.todo} />
          <KanbanColumn status="in-progress" tasks={grouped["in-progress"]} />
          <KanbanColumn status="done" tasks={grouped.done} />
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-gray-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <p className="text-center text-sm text-gray-600">
            Drag and drop tasks between columns • Type{" "}
            <code className="px-1 py-0.5 bg-gray-800 rounded text-gray-400">/help</code>{" "}
            in terminal for commands
          </p>
        </div>
      </footer>
    </div>
  );
}
