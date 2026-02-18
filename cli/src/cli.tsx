#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import meow from 'meow';
import App from './components/App.js';

const cli = meow(`
  🦊 Loki CLI Dashboard
  Nick's personal AI command center

  Usage
    $ loki [options]

  Options
    --help, -h     Show this help
    --version, -v  Show version

  Commands (inside the dashboard)
    /tasks [filter]  Show tasks (todo, doing, done)
    /add <title>     Add a new task
    /done <number>   Mark task as done
    /focus <number>  Set current focus
    /status          Show status
    /help            Show help
    /exit            Exit dashboard

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

console.clear();
render(<App />);
