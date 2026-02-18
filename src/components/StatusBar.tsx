import React from 'react';
import { Box, Text } from 'ink';
import { Task } from '../lib/firebase.js';

interface StatusBarProps {
  status: 'idle' | 'active' | 'thinking';
  currentFocus?: string;
  tasks: Task[];
  sessionCount?: number;
}

function getStatusEmoji(status: string): string {
  switch (status) {
    case 'active': return '🟢';
    case 'thinking': return '🟡';
    default: return '⚪';
  }
}

function getProgressBar(current: number, max: number, width: number = 10): string {
  const filled = Math.round((current / max) * width);
  const empty = width - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

export default function StatusBar({ status, currentFocus, tasks, sessionCount = 1 }: StatusBarProps) {
  const todoCount = tasks.filter(t => t.status === 'todo').length;
  const inProgressCount = tasks.filter(t => t.status === 'inProgress').length;
  const doneCount = tasks.filter(t => t.status === 'done').length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((doneCount / totalTasks) * 100) : 0;

  return (
    <Box flexDirection="column" borderStyle="round" borderColor="cyan" paddingX={1}>
      <Box justifyContent="space-between">
        <Box>
          <Text color="cyan" bold>🦊 Loki</Text>
          <Text> </Text>
          <Text>{getStatusEmoji(status)}</Text>
          <Text color="gray"> {status.toUpperCase()}</Text>
        </Box>
        <Box>
          <Text color="gray">Sessions: </Text>
          <Text color="yellow">{sessionCount}</Text>
        </Box>
      </Box>
      
      {currentFocus && (
        <Box marginTop={1}>
          <Text color="magenta">🎯 Focus: </Text>
          <Text>{currentFocus}</Text>
        </Box>
      )}
      
      <Box marginTop={1} justifyContent="space-between">
        <Box>
          <Text color="red">📋 {todoCount}</Text>
          <Text> </Text>
          <Text color="yellow">🔄 {inProgressCount}</Text>
          <Text> </Text>
          <Text color="green">✅ {doneCount}</Text>
        </Box>
        <Box>
          <Text color="gray">{getProgressBar(doneCount, totalTasks || 1)} </Text>
          <Text color={completionRate >= 50 ? 'green' : 'yellow'}>{completionRate}%</Text>
        </Box>
      </Box>
    </Box>
  );
}
