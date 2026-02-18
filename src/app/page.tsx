"use client";

/**
 * Home Page - Terminal View
 * 
 * The main entry point showing the terminal interface.
 * Users can manage tasks via commands and navigate to the Kanban board.
 */

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useTasks } from "@/hooks";

// Dynamic import to avoid SSR issues with xterm.js
const Terminal = dynamic(
  () => import("@/components/Terminal/Terminal").then((mod) => mod.Terminal),
  { ssr: false, loading: () => <div className="flex-1 bg-[#0d1117] animate-pulse" /> }
);

export default function HomePage() {
  const router = useRouter();
  const { tasks, loading, error } = useTasks();
  
  /**
   * Handle navigation from terminal commands
   */
  const handleNavigate = (path: string) => {
    router.push(path);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-[#0d1117]">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🦊</span>
            <h1 className="text-lg font-bold text-gray-100">Loki Kanban</h1>
            <span className="px-2 py-0.5 text-xs bg-cyan-500/20 text-cyan-400 rounded">
              Terminal
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Task count */}
            <span className="text-sm text-gray-400">
              {loading ? (
                "Loading..."
              ) : (
                <>
                  <span className="text-gray-200 font-medium">{tasks.length}</span> tasks
                </>
              )}
            </span>
            
            {/* Board link */}
            <button
              onClick={() => router.push("/board")}
              className="
                flex items-center gap-2 px-3 py-1.5
                bg-gray-800 hover:bg-gray-700 border border-gray-700
                rounded-lg text-sm text-gray-300 transition-colors
              "
            >
              <span>📋</span>
              <span>Kanban Board</span>
            </button>
          </div>
        </div>
      </header>
      
      {/* Terminal */}
      <main className="flex-1 flex flex-col max-w-6xl mx-auto w-full p-4">
        {error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-red-400 mb-2">Failed to connect to Firebase</p>
              <p className="text-gray-500 text-sm">{error.message}</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
            <Terminal tasks={tasks} onNavigate={handleNavigate} />
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <p className="text-center text-xs text-gray-600">
            Type <code className="px-1 py-0.5 bg-gray-800 rounded">/help</code> for commands
            {" • "}
            <code className="px-1 py-0.5 bg-gray-800 rounded">/board</code> for Kanban view
          </p>
        </div>
      </footer>
    </div>
  );
}
