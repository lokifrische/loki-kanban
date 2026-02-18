import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';

interface CommandInputProps {
  onCommand: (command: string, args: string[]) => void;
  placeholder?: string;
}

export default function CommandInput({ onCommand, placeholder = 'Type a command...' }: CommandInputProps) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useInput((inputChar, key) => {
    if (key.return) {
      if (input.trim()) {
        const parts = input.trim().split(' ');
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);
        
        setHistory(prev => [...prev, input]);
        setHistoryIndex(-1);
        onCommand(command, args);
        setInput('');
      }
    } else if (key.backspace || key.delete) {
      setInput(prev => prev.slice(0, -1));
    } else if (key.upArrow && history.length > 0) {
      const newIndex = historyIndex < history.length - 1 ? historyIndex + 1 : historyIndex;
      setHistoryIndex(newIndex);
      setInput(history[history.length - 1 - newIndex] || '');
    } else if (key.downArrow) {
      const newIndex = historyIndex > 0 ? historyIndex - 1 : -1;
      setHistoryIndex(newIndex);
      setInput(newIndex >= 0 ? history[history.length - 1 - newIndex] : '');
    } else if (key.escape) {
      setInput('');
    } else if (!key.ctrl && !key.meta && inputChar) {
      setInput(prev => prev + inputChar);
    }
  });

  return (
    <Box borderStyle="single" borderColor="blue" paddingX={1}>
      <Text color="blue" bold>❯ </Text>
      <Text>{input || <Text color="gray">{placeholder}</Text>}</Text>
      <Text color="cyan">▋</Text>
    </Box>
  );
}
