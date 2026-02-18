import KanbanBoard from '@/components/KanbanBoard';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🦊 Loki Task Board
          </h1>
          <p className="text-gray-600">
            Nick&apos;s personal kanban board - managed by Loki
          </p>
        </header>
        
        <KanbanBoard />
        
        <footer className="mt-12 text-center text-gray-400 text-sm">
          Built by Loki for Nick | BPN Solutions
        </footer>
      </div>
    </main>
  );
}
