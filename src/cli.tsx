#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import meow from 'meow';
import App from './components/App.js';

const cli = meow(`
  🦊 Loki - Nick's AI Command Center
  
  Usage
    $ loki [command]

  Commands
    (no command)     Launch the interactive dashboard
    web              Open Kanban board in browser

  Dashboard Commands (once running)
    /web             Open Kanban board in browser
    /tasks [filter]  Show tasks (todo, doing, done, all)
    /add <title>     Add a new task
    /start <number>  Start working on a task
    /done <number>   Mark task as completed
    /delete <number> Delete a task
    /focus <number>  Set current focus
    /help            Show all commands
    /exit            Exit dashboard

  Options
    --help, -h       Show this help
    --version, -v    Show version

  Examples
    $ loki           # Launch dashboard
    $ loki web       # Open Kanban board directly

`, {
  importMeta: import.meta,
  flags: {
    help: {
      type: 'boolean',
      shortFlag: 'h',
    },
    version: {
      type: 'boolean',
      shortFlag: 'v',
    },
  },
});

// Handle subcommands
const [subcommand] = cli.input;

if (subcommand === 'web' || subcommand === 'board') {
  // Open web board directly
  import('open').then((open) => {
    open.default('https://loki-kanban.vercel.app');
    console.log('🌐 Opening Kanban board in browser...');
    process.exit(0);
  }).catch(() => {
    console.log('🌐 Open in browser: https://loki-kanban.vercel.app');
    process.exit(0);
  });
} else {
  // Launch interactive dashboard
  console.clear();
  render(<App />);
}
