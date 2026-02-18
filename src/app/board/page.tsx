"use client";

/**
 * Board Page - Kanban View
 * 
 * Visual Kanban board with drag-and-drop functionality.
 * Provides an alternative view to the terminal interface.
 */

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useTasks } from "@/hooks";

// Dynamic import to avoid SSR issues with Firebase
const KanbanBoard = dynamic(
  () => import("@/components/Kanban/KanbanBoard").then((mod) => mod.KanbanBoard),
  { ssr: false, loading: () => (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
      <div className="text-4xl animate-pulse">🦊</div>
    </div>
  )}
);

export default function BoardPage() {
  const router = useRouter();
  const { tasks, loading, error } = useTasks();
  
  /**
   * Handle navigation from board
   */
  const handleNavigate = (path: string) => {
    router.push(path);
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">🦊</div>
          <p className="text-gray-400">Loading tasks...</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-2">Failed to connect to Firebase</p>
          <p className="text-gray-500 text-sm mb-4">{error.message}</p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm"
          >
            Back to Terminal
          </button>
        </div>
      </div>
    );
  }
  
  return <KanbanBoard tasks={tasks} onNavigate={handleNavigate} />;
}
