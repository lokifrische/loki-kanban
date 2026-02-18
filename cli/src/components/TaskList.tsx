import React from 'react';
import { Box, Text } from 'ink';
import { Task } from '../lib/firebase.js';
import { formatDistanceToNow } from 'date-fns';

interface TaskListProps {
  tasks: Task[];
  filter?: 'all' | 'todo' | 'inProgress' | 'done';
  maxDisplay?: number;
}

function getStatusIcon(status: Task['status']): string {
  switch (status) {
    case 'todo': return '📋';
    case 'inProgress': return '🔄';
    case 'done': return '✅';
  }
}

function getStatusColor(status: Task['status']): string {
  switch (status) {
    case 'todo': return 'red';
    case 'inProgress': return 'yellow';
    case 'done': return 'green';
  }
}

export default function TaskList({ tasks, filter = 'all', maxDisplay = 10 }: TaskListProps) {
  const filteredTasks = filter === 'all' 
    ? tasks 
    : tasks.filter(t => t.status === filter);
  
  const displayTasks = filteredTasks.slice(0, maxDisplay);
  const remaining = filteredTasks.length - maxDisplay;

  if (displayTasks.length === 0) {
    return (
      <Box paddingX={1}>
        <Text color="gray" italic>No tasks {filter !== 'all' ? `in ${filter}` : ''}</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" paddingX={1}>
      {displayTasks.map((task, index) => (
        <Box key={task.id} marginBottom={index < displayTasks.length - 1 ? 1 : 0}>
          <Text color="gray">{index + 1}. </Text>
          <Text>{getStatusIcon(task.status)} </Text>
          <Text color={getStatusColor(task.status)}>{task.title}</Text>
          {task.dueDate && (
            <Text color="gray"> (due: {task.dueDate})</Text>
          )}
          <Text color="gray" dimColor> • {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}</Text>
        </Box>
      ))}
      {remaining > 0 && (
        <Box marginTop={1}>
          <Text color="gray" italic>...and {remaining} more</Text>
        </Box>
      )}
    </Box>
  );
}
