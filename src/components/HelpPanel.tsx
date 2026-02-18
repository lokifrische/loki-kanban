import React from 'react';
import { Box, Text } from 'ink';

interface Command {
  name: string;
  description: string;
  aliases?: string[];
}

const commands: Command[] = [
  { name: '/web', description: 'Open Kanban board in browser', aliases: ['board', 'kanban'] },
  { name: '/tasks', description: 'Show tasks (filter: todo|doing|done|all)' },
  { name: '/add', description: 'Add a new task: /add <title>' },
  { name: '/start', description: 'Start a task: /start <number>', aliases: ['progress'] },
  { name: '/done', description: 'Complete a task: /done <number>', aliases: ['complete'] },
  { name: '/delete', description: 'Delete a task: /delete <number>', aliases: ['rm'] },
  { name: '/focus', description: 'Set focus: /focus <number> (no arg = clear)' },
  { name: '/home', description: 'Return to dashboard', aliases: ['status'] },
  { name: '/clear', description: 'Clear messages', aliases: ['cls'] },
  { name: '/help', description: 'Show this help', aliases: ['?'] },
  { name: '/exit', description: 'Exit Loki', aliases: ['quit', 'q'] },
];

export default function HelpPanel() {
  return (
    <Box flexDirection="column" borderStyle="round" borderColor="magenta" paddingX={1}>
      <Box marginBottom={1}>
        <Text color="magenta" bold>📖 Commands</Text>
      </Box>
      {commands.map((cmd, index) => (
        <Box key={cmd.name} flexDirection="column" marginBottom={index < commands.length - 1 ? 0 : 0}>
          <Box>
            <Box width={12}>
              <Text color="cyan">{cmd.name}</Text>
            </Box>
            <Text color="gray">- {cmd.description}</Text>
          </Box>
          {cmd.aliases && (
            <Box marginLeft={12}>
              <Text color="gray" dimColor>aliases: {cmd.aliases.join(', ')}</Text>
            </Box>
          )}
        </Box>
      ))}
      <Box marginTop={1}>
        <Text color="gray" dimColor>Use Up/Down arrows for command history | Ctrl+C to exit</Text>
      </Box>
    </Box>
  );
}
