import React from 'react';
import { Box, Text } from 'ink';

interface Command {
  name: string;
  description: string;
  usage?: string;
}

const commands: Command[] = [
  { name: '/tasks', description: 'Show all tasks', usage: '/tasks [todo|doing|done]' },
  { name: '/add', description: 'Add a new task', usage: '/add <task title>' },
  { name: '/done', description: 'Mark task as done', usage: '/done <task number>' },
  { name: '/focus', description: 'Set current focus', usage: '/focus <task number>' },
  { name: '/status', description: 'Show Loki status' },
  { name: '/clear', description: 'Clear and return to dashboard' },
  { name: '/help', description: 'Show this help' },
  { name: '/exit', description: 'Exit the dashboard' },
];

export default function HelpPanel() {
  return (
    <Box flexDirection="column" borderStyle="round" borderColor="magenta" paddingX={1}>
      <Box marginBottom={1}>
        <Text color="magenta" bold>📖 Commands</Text>
      </Box>
      {commands.map((cmd, index) => (
        <Box key={cmd.name} marginBottom={index < commands.length - 1 ? 0 : 0}>
          <Box width={12}>
            <Text color="cyan">{cmd.name}</Text>
          </Box>
          <Text color="gray">- {cmd.description}</Text>
        </Box>
      ))}
      <Box marginTop={1}>
        <Text color="gray" dimColor>Press Ctrl+C to exit | Up/Down for command history</Text>
      </Box>
    </Box>
  );
}
