# 🦊 Loki

Nick's personal AI command center. Terminal-first task management with a web Kanban board.

## Quick Start

```bash
# Install dependencies
npm run install:all

# Launch the CLI dashboard
npm run dev

# Or open the web board directly
npm run web
```

## Structure

```
loki/
├── src/              # CLI source (Ink + React 18)
│   ├── cli.tsx       # Entry point
│   ├── components/   # UI components
│   └── lib/          # Firebase & utilities
├── web/              # Kanban web app (Next.js + React 19)
│   ├── src/
│   └── package.json
└── package.json      # Root = CLI
```

## CLI Commands

Once the dashboard is running:

| Command | Description |
|---------|-------------|
| `/web` | Open Kanban board in browser |
| `/tasks [filter]` | Show tasks (todo, doing, done, all) |
| `/add <title>` | Add a new task |
| `/start <number>` | Start working on a task |
| `/done <number>` | Mark task as completed |
| `/delete <number>` | Delete a task |
| `/focus <number>` | Set current focus |
| `/help` | Show all commands |
| `/exit` | Exit dashboard |

## NPM Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Run CLI in dev mode (hot reload) |
| `npm run build` | Build CLI for production |
| `npm run start` | Run built CLI |
| `npm run web` | Run web app dev server |
| `npm run web:build` | Build web app |
| `npm run install:all` | Install all dependencies |

## Global Install

To use `loki` as a global command:

```bash
npm run build
npm link
```

Then run from anywhere:
```bash
loki          # Launch dashboard
loki web      # Open Kanban board
```

## Live URLs

- **Web Board**: https://loki-kanban.vercel.app
- **Repository**: https://github.com/lokifrische/loki-kanban

## Tech Stack

- **CLI**: Ink (React for terminals) + TypeScript
- **Web**: Next.js 16 + React 19 + Tailwind CSS
- **Backend**: Firebase Firestore (real-time sync)
- **Hosting**: Vercel

---

*Built by Loki for Nick* 🦊
