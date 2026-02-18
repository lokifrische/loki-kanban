# 🦊 Loki Kanban

A terminal-style task management application with a Kanban board view. Built with Next.js, TypeScript, Firebase, and xterm.js.

## Features

- **Terminal Interface**: Manage tasks using intuitive slash commands
- **Kanban Board**: Visual drag-and-drop task management
- **Real-time Sync**: Firebase Firestore for instant updates across devices
- **Beautiful UI**: Dark theme with smooth animations

## Getting Started

### Prerequisites

- Node.js 20.9 or higher
- npm or yarn
- Firebase project (for backend)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/lokifrische/loki-kanban.git
cd loki-kanban
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Firestore Database
   - Copy your config to `src/lib/firebase/config.ts`

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Terminal Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/add <title>` | Create a new task | `/add Buy groceries -p high` |
| `/list` | List all tasks | `/list -s todo` |
| `/done <id>` | Mark task as done | `/done abc12345` |
| `/start <id>` | Start working on task | `/start abc12345` |
| `/delete <id>` | Delete a task | `/delete abc12345` |
| `/move <id> <status>` | Move task to status | `/move abc12345 done` |
| `/edit <id>` | Edit a task | `/edit abc12345 New title -p low` |
| `/search <query>` | Search tasks | `/search groceries` |
| `/board` | Open Kanban board | `/board` |
| `/status` | Show task summary | `/status` |
| `/clear` | Clear terminal | `/clear` |
| `/help` | Show help | `/help` |

### Flags

- `-p, --priority`: Set priority (low, medium, high)
- `-s, --status`: Set status (todo, in-progress, done)

## Project Structure

```
loki-kanban/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Terminal view (home)
│   │   ├── board/
│   │   │   └── page.tsx     # Kanban board view
│   │   └── globals.css      # Global styles
│   ├── components/          # React components
│   │   ├── Terminal/        # xterm.js terminal
│   │   └── Kanban/          # Kanban board components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities and services
│   │   ├── firebase/        # Firebase configuration and services
│   │   └── commands/        # Command parser and executor
│   └── types/               # TypeScript type definitions
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Terminal**: [xterm.js](https://xtermjs.org/)
- **Database**: [Firebase Firestore](https://firebase.google.com/docs/firestore)
- **Deployment**: [Vercel](https://vercel.com/)

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Deploy (no configuration needed)

### Static Export

```bash
npm run build
```

The static export will be in the `out/` directory.

## Firebase Setup

1. Create a new Firebase project
2. Enable Firestore Database
3. Set up security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      allow read, write: if true; // Update for production
    }
  }
}
```

4. Update `src/lib/firebase/config.ts` with your project config

## License

MIT

## Author

Nick Frische - [@nickfrische](https://github.com/nickfrische)
