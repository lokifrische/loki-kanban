import React, { useState, useEffect } from 'react';
import { Box, Text, useApp } from 'ink';
import StatusBar from './StatusBar.js';
import TaskList from './TaskList.js';
import CommandInput from './CommandInput.js';
import HelpPanel from './HelpPanel.js';
import { Task, subscribeToTasks, addTask, updateTaskStatus, deleteTask } from '../lib/firebase.js';

const WEB_URL = 'https://loki-kanban.vercel.app';

type View = 'dashboard' | 'tasks' | 'help';
type TaskFilter = 'all' | 'todo' | 'inProgress' | 'done';

export default function App() {
  const { exit } = useApp();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [status, setStatus] = useState<'idle' | 'active' | 'thinking'>('idle');
  const [currentFocus, setCurrentFocus] = useState<string | undefined>();
  const [view, setView] = useState<View>('dashboard');
  const [taskFilter, setTaskFilter] = useState<TaskFilter>('all');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToTasks((newTasks) => {
      setTasks(newTasks);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const openBrowser = async (url: string) => {
    try {
      const open = (await import('open')).default;
      await open(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleCommand = async (command: string, args: string[]) => {
    setMessage('');
    
    const cmd = command.startsWith('/') ? command.slice(1) : command;
    
    switch (cmd) {
      case 'web':
      case 'board':
      case 'kanban':
        setStatus('thinking');
        const opened = await openBrowser(WEB_URL);
        if (opened) {
          setMessage(`🌐 Opening Kanban board in browser...`);
        } else {
          setMessage(`🌐 Open in browser: ${WEB_URL}`);
        }
        setStatus('idle');
        break;

      case 'tasks':
        setView('tasks');
        if (args[0]) {
          const filter = args[0].toLowerCase();
          if (filter === 'todo' || filter === 'doing' || filter === 'inprogress') {
            setTaskFilter(filter === 'doing' ? 'inProgress' : filter as TaskFilter);
          } else if (filter === 'done') {
            setTaskFilter('done');
          } else {
            setTaskFilter('all');
          }
        } else {
          setTaskFilter('all');
        }
        break;
        
      case 'add':
        if (args.length > 0) {
          setStatus('thinking');
          try {
            await addTask({
              title: args.join(' '),
              status: 'todo',
            });
            setMessage(`✅ Added: "${args.join(' ')}"`);
          } catch (error) {
            setMessage(`❌ Error adding task`);
          }
          setStatus('idle');
        } else {
          setMessage('❌ Usage: /add <task title>');
        }
        break;

      case 'start':
      case 'progress':
        if (args[0]) {
          const index = parseInt(args[0]) - 1;
          const todoTasks = tasks.filter(t => t.status === 'todo');
          if (index >= 0 && index < todoTasks.length) {
            setStatus('thinking');
            try {
              await updateTaskStatus(todoTasks[index].id, 'inProgress');
              setMessage(`🔄 Started: "${todoTasks[index].title}"`);
            } catch (error) {
              setMessage(`❌ Error updating task`);
            }
            setStatus('idle');
          } else {
            setMessage('❌ Invalid task number');
          }
        } else {
          setMessage('❌ Usage: /start <task number>');
        }
        break;
        
      case 'done':
      case 'complete':
        if (args[0]) {
          const index = parseInt(args[0]) - 1;
          const activeTasks = tasks.filter(t => t.status === 'todo' || t.status === 'inProgress');
          if (index >= 0 && index < activeTasks.length) {
            setStatus('thinking');
            try {
              await updateTaskStatus(activeTasks[index].id, 'done');
              setMessage(`✅ Completed: "${activeTasks[index].title}"`);
            } catch (error) {
              setMessage(`❌ Error updating task`);
            }
            setStatus('idle');
          } else {
            setMessage('❌ Invalid task number');
          }
        } else {
          setMessage('❌ Usage: /done <task number>');
        }
        break;

      case 'delete':
      case 'rm':
        if (args[0]) {
          const index = parseInt(args[0]) - 1;
          const allTasks = tasks;
          if (index >= 0 && index < allTasks.length) {
            setStatus('thinking');
            try {
              await deleteTask(allTasks[index].id);
              setMessage(`🗑️ Deleted: "${allTasks[index].title}"`);
            } catch (error) {
              setMessage(`❌ Error deleting task`);
            }
            setStatus('idle');
          } else {
            setMessage('❌ Invalid task number');
          }
        } else {
          setMessage('❌ Usage: /delete <task number>');
        }
        break;
        
      case 'focus':
        if (args[0]) {
          const index = parseInt(args[0]) - 1;
          const todoTasks = tasks.filter(t => t.status === 'todo');
          if (index >= 0 && index < todoTasks.length) {
            setCurrentFocus(todoTasks[index].title);
            setMessage(`🎯 Focus set: "${todoTasks[index].title}"`);
          } else {
            setMessage('❌ Invalid task number');
          }
        } else {
          setCurrentFocus(undefined);
          setMessage('🎯 Focus cleared');
        }
        break;
        
      case 'status':
      case 'home':
        setView('dashboard');
        break;
        
      case 'help':
      case '?':
        setView('help');
        break;
        
      case 'clear':
      case 'cls':
        setMessage('');
        setView('dashboard');
        break;
        
      case 'exit':
      case 'quit':
      case 'q':
        exit();
        break;
        
      default:
        setMessage(`❓ Unknown command: ${command}. Type /help for commands.`);
    }
  };

  if (loading) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text color="cyan">🦊 Loading Loki...</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" padding={1}>
      {/* Header */}
      <Box marginBottom={1}>
        <Text color="cyan" bold>
          ╔═══════════════════════════════════════════════════════════════════════╗
        </Text>
      </Box>
      <Box marginBottom={1} justifyContent="center">
        <Text color="cyan" bold>🦊 LOKI - Nick's AI Command Center 🦊</Text>
      </Box>
      <Box marginBottom={1}>
        <Text color="cyan" bold>
          ╚═══════════════════════════════════════════════════════════════════════╝
        </Text>
      </Box>

      {/* Status Bar */}
      <StatusBar
        status={status}
        currentFocus={currentFocus}
        tasks={tasks}
        sessionCount={1}
      />

      {/* Main Content */}
      <Box marginY={1}>
        {view === 'dashboard' && (
          <Box flexDirection="column">
            <Box marginBottom={1}>
              <Text color="yellow" bold>📋 To Do ({tasks.filter(t => t.status === 'todo').length})</Text>
            </Box>
            <TaskList tasks={tasks} filter="todo" maxDisplay={5} />
            
            {tasks.filter(t => t.status === 'inProgress').length > 0 && (
              <>
                <Box marginTop={1} marginBottom={1}>
                  <Text color="blue" bold>🔄 In Progress ({tasks.filter(t => t.status === 'inProgress').length})</Text>
                </Box>
                <TaskList tasks={tasks} filter="inProgress" maxDisplay={3} />
              </>
            )}
          </Box>
        )}
        
        {view === 'tasks' && (
          <Box flexDirection="column">
            <Box marginBottom={1}>
              <Text color="yellow" bold>
                📋 Tasks {taskFilter !== 'all' ? `(${taskFilter})` : '(all)'} - {tasks.filter(t => taskFilter === 'all' || t.status === taskFilter).length} total
              </Text>
            </Box>
            <TaskList tasks={tasks} filter={taskFilter} maxDisplay={15} showNumbers />
          </Box>
        )}
        
        {view === 'help' && <HelpPanel />}
      </Box>

      {/* Message */}
      {message && (
        <Box marginBottom={1}>
          <Text>{message}</Text>
        </Box>
      )}

      {/* Command Input */}
      <CommandInput
        onCommand={handleCommand}
        placeholder="Type /help for commands..."
      />

      {/* Footer */}
      <Box marginTop={1}>
        <Text color="gray" dimColor>
          /web opens Kanban board | /help for commands | Ctrl+C to exit
        </Text>
      </Box>
    </Box>
  );
}
