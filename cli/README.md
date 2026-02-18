# 🦊 Loki CLI

Terminal dashboard for the Loki Kanban board. Same Firebase backend, different interface.

## Setup

```bash
cd cli
npm install
```

## Usage

```bash
# Development mode (hot reload)
npm run dev

# Or run directly
npx tsx src/cli.tsx
```

## Commands

| Command | Description |
|---------|-------------|
| `/tasks [filter]` | Show tasks (todo, doing, done) |
| `/add <title>` | Add a new task |
| `/done <number>` | Mark task as done |
| `/focus <number>` | Set current focus |
| `/status` | Return to dashboard view |
| `/help` | Show help |
| `/exit` | Exit dashboard |

## Global Install

To use `loki` as a global command:

```bash
npm run build
npm link
```

Then run from anywhere:
```bash
loki
```
