/**
 * Command Executor
 * 
 * Executes parsed commands and returns formatted output.
 * Integrates with Firebase for task operations.
 */

import type { Task } from "@/types/task";
import {
  createTask,
  updateTask,
  deleteTask,
  moveTask,
  searchTasks,
  groupTasksByStatus,
} from "@/lib/firebase";
import {
  parseCommand,
  parseStatus,
  parsePriority,
  getCommandAlias,
  type ParsedCommand,
} from "./parser";

/**
 * Terminal output colors using ANSI codes
 */
const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
};

/**
 * Format text with color
 */
function c(text: string, color: keyof typeof colors): string {
  return `${colors[color]}${text}${colors.reset}`;
}

/**
 * Execute a command string
 */
export async function executeCommand(
  input: string,
  tasks: Task[],
  callbacks: {
    onNavigate?: (path: string) => void;
    onClear?: () => void;
    onRefresh?: () => void;
  } = {}
): Promise<string[]> {
  const parsed = parseCommand(input);
  
  if (!parsed) {
    return [c("Invalid command. Type /help for available commands.", "red")];
  }
  
  const command = getCommandAlias(parsed.command);
  
  if (!command) {
    return [c(`Unknown command: /${parsed.command}. Type /help for available commands.`, "red")];
  }
  
  try {
    switch (command) {
      case "add":
        return await handleAdd(parsed);
      case "list":
        return handleList(tasks, parsed);
      case "done":
        return await handleDone(parsed, tasks);
      case "start":
        return await handleStart(parsed, tasks);
      case "delete":
        return await handleDelete(parsed, tasks);
      case "move":
        return await handleMove(parsed, tasks);
      case "edit":
        return await handleEdit(parsed, tasks);
      case "search":
        return handleSearch(tasks, parsed);
      case "clear":
        callbacks.onClear?.();
        return [];
      case "help":
        return handleHelp();
      case "board":
        callbacks.onNavigate?.("/board");
        return [c("Opening Kanban board...", "cyan")];
      case "status":
        return handleStatus(tasks);
      default:
        return [c(`Command not implemented: /${command}`, "yellow")];
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return [c(`Error: ${message}`, "red")];
  }
}

/**
 * Handle /add command
 */
async function handleAdd(parsed: ParsedCommand): Promise<string[]> {
  const title = parsed.args.join(" ");
  
  if (!title) {
    return [c("Usage: /add <task title> [-p priority] [-s status]", "yellow")];
  }
  
  const priority = parsed.flags.p || parsed.flags.priority;
  const status = parsed.flags.s || parsed.flags.status;
  
  const task = await createTask({
    title,
    priority: priority ? parsePriority(String(priority)) ?? "medium" : "medium",
    status: status ? parseStatus(String(status)) ?? "todo" : "todo",
  });
  
  return [
    c("✓ Task created:", "green"),
    `  ${c(task.title, "white")}`,
    `  ${c("ID:", "dim")} ${task.id.slice(0, 8)}  ${c("Status:", "dim")} ${task.status}  ${c("Priority:", "dim")} ${task.priority}`,
  ];
}

/**
 * Handle /list command
 */
function handleList(tasks: Task[], parsed: ParsedCommand): string[] {
  const statusFilter = parsed.flags.s || parsed.flags.status;
  const priorityFilter = parsed.flags.p || parsed.flags.priority;
  
  let filtered = tasks;
  
  if (statusFilter) {
    const status = parseStatus(String(statusFilter));
    if (status) {
      filtered = filtered.filter((t) => t.status === status);
    }
  }
  
  if (priorityFilter) {
    const priority = parsePriority(String(priorityFilter));
    if (priority) {
      filtered = filtered.filter((t) => t.priority === priority);
    }
  }
  
  if (filtered.length === 0) {
    return [c("No tasks found.", "dim")];
  }
  
  const output: string[] = [
    c(`Tasks (${filtered.length}):`, "bold"),
    "",
  ];
  
  const grouped = groupTasksByStatus(filtered);
  
  // Display by status
  const statusLabels: Record<string, string> = {
    "todo": "📋 To Do",
    "in-progress": "🔄 In Progress",
    "done": "✅ Done",
  };
  
  const statusColors: Record<string, keyof typeof colors> = {
    "todo": "yellow",
    "in-progress": "blue",
    "done": "green",
  };
  
  for (const [status, label] of Object.entries(statusLabels)) {
    const tasksInStatus = grouped[status as keyof typeof grouped];
    if (tasksInStatus.length > 0) {
      output.push(c(label, statusColors[status]));
      for (const task of tasksInStatus) {
        const priorityIcon = { high: "🔴", medium: "🟡", low: "🟢" }[task.priority];
        output.push(`  ${priorityIcon} ${c(task.id.slice(0, 8), "dim")} ${task.title}`);
      }
      output.push("");
    }
  }
  
  return output;
}

/**
 * Handle /done command
 */
async function handleDone(parsed: ParsedCommand, tasks: Task[]): Promise<string[]> {
  const identifier = parsed.args[0];
  
  if (!identifier) {
    return [c("Usage: /done <task-id or search>", "yellow")];
  }
  
  const task = findTask(tasks, identifier);
  
  if (!task) {
    return [c(`Task not found: ${identifier}`, "red")];
  }
  
  await moveTask(task.id, "done");
  
  return [
    c("✓ Task marked as done:", "green"),
    `  ${task.title}`,
  ];
}

/**
 * Handle /start command
 */
async function handleStart(parsed: ParsedCommand, tasks: Task[]): Promise<string[]> {
  const identifier = parsed.args[0];
  
  if (!identifier) {
    return [c("Usage: /start <task-id or search>", "yellow")];
  }
  
  const task = findTask(tasks, identifier);
  
  if (!task) {
    return [c(`Task not found: ${identifier}`, "red")];
  }
  
  await moveTask(task.id, "in-progress");
  
  return [
    c("✓ Task started:", "blue"),
    `  ${task.title}`,
  ];
}

/**
 * Handle /delete command
 */
async function handleDelete(parsed: ParsedCommand, tasks: Task[]): Promise<string[]> {
  const identifier = parsed.args[0];
  
  if (!identifier) {
    return [c("Usage: /delete <task-id or search>", "yellow")];
  }
  
  const task = findTask(tasks, identifier);
  
  if (!task) {
    return [c(`Task not found: ${identifier}`, "red")];
  }
  
  await deleteTask(task.id);
  
  return [
    c("✓ Task deleted:", "red"),
    `  ${task.title}`,
  ];
}

/**
 * Handle /move command
 */
async function handleMove(parsed: ParsedCommand, tasks: Task[]): Promise<string[]> {
  const [identifier, statusArg] = parsed.args;
  
  if (!identifier || !statusArg) {
    return [c("Usage: /move <task-id> <status>", "yellow")];
  }
  
  const task = findTask(tasks, identifier);
  
  if (!task) {
    return [c(`Task not found: ${identifier}`, "red")];
  }
  
  const status = parseStatus(statusArg);
  
  if (!status) {
    return [c(`Invalid status: ${statusArg}. Use: todo, in-progress, done`, "red")];
  }
  
  await moveTask(task.id, status);
  
  return [
    c(`✓ Task moved to ${status}:`, "cyan"),
    `  ${task.title}`,
  ];
}

/**
 * Handle /edit command
 */
async function handleEdit(parsed: ParsedCommand, tasks: Task[]): Promise<string[]> {
  const identifier = parsed.args[0];
  const newTitle = parsed.args.slice(1).join(" ");
  
  if (!identifier) {
    return [c("Usage: /edit <task-id> [new title] [-p priority] [-s status]", "yellow")];
  }
  
  const task = findTask(tasks, identifier);
  
  if (!task) {
    return [c(`Task not found: ${identifier}`, "red")];
  }
  
  const updates: Record<string, unknown> = {};
  
  if (newTitle) {
    updates.title = newTitle;
  }
  
  const priority = parsed.flags.p || parsed.flags.priority;
  if (priority) {
    const parsedPriority = parsePriority(String(priority));
    if (parsedPriority) {
      updates.priority = parsedPriority;
    }
  }
  
  const status = parsed.flags.s || parsed.flags.status;
  if (status) {
    const parsedStatus = parseStatus(String(status));
    if (parsedStatus) {
      updates.status = parsedStatus;
    }
  }
  
  if (Object.keys(updates).length === 0) {
    return [c("Nothing to update. Provide new title or use -p/-s flags.", "yellow")];
  }
  
  await updateTask(task.id, updates);
  
  return [
    c("✓ Task updated:", "green"),
    `  ${newTitle || task.title}`,
  ];
}

/**
 * Handle /search command
 */
function handleSearch(tasks: Task[], parsed: ParsedCommand): string[] {
  const query = parsed.args.join(" ");
  
  if (!query) {
    return [c("Usage: /search <query>", "yellow")];
  }
  
  const results = searchTasks(tasks, query);
  
  if (results.length === 0) {
    return [c(`No tasks found matching: ${query}`, "dim")];
  }
  
  const output: string[] = [
    c(`Found ${results.length} task(s):`, "bold"),
    "",
  ];
  
  for (const task of results) {
    const statusIcon = { "todo": "📋", "in-progress": "🔄", "done": "✅" }[task.status];
    output.push(`  ${statusIcon} ${c(task.id.slice(0, 8), "dim")} ${task.title}`);
  }
  
  return output;
}

/**
 * Handle /status command
 */
function handleStatus(tasks: Task[]): string[] {
  const grouped = groupTasksByStatus(tasks);
  
  return [
    c("📊 Task Summary", "bold"),
    "",
    `  ${c("To Do:", "yellow")}        ${grouped.todo.length}`,
    `  ${c("In Progress:", "blue")}  ${grouped["in-progress"].length}`,
    `  ${c("Done:", "green")}         ${grouped.done.length}`,
    "",
    `  ${c("Total:", "white")}        ${tasks.length}`,
  ];
}

/**
 * Handle /help command
 */
function handleHelp(): string[] {
  return [
    c("Loki Kanban - Terminal Commands", "bold"),
    "",
    c("Task Management:", "cyan"),
    `  ${c("/add", "green")} <title> [-p priority] [-s status]  Create a new task`,
    `  ${c("/list", "green")} [-s status] [-p priority]         List all tasks`,
    `  ${c("/done", "green")} <id>                              Mark task as done`,
    `  ${c("/start", "green")} <id>                             Start working on task`,
    `  ${c("/delete", "green")} <id>                            Delete a task`,
    `  ${c("/move", "green")} <id> <status>                     Move task to status`,
    `  ${c("/edit", "green")} <id> [title] [-p] [-s]            Edit a task`,
    `  ${c("/search", "green")} <query>                         Search tasks`,
    "",
    c("Navigation:", "cyan"),
    `  ${c("/board", "green")}                                  Open Kanban board`,
    `  ${c("/status", "green")}                                 Show task summary`,
    `  ${c("/clear", "green")}                                  Clear terminal`,
    `  ${c("/help", "green")}                                   Show this help`,
    "",
    c("Shortcuts:", "cyan"),
    `  ${c("/ls", "dim")} = /list    ${c("/rm", "dim")} = /delete    ${c("/find", "dim")} = /search`,
    "",
    c("Examples:", "cyan"),
    `  /add Buy groceries -p high`,
    `  /done abc12345`,
    `  /list -s todo`,
    `  /move abc12345 done`,
  ];
}

/**
 * Find task by ID prefix or title search
 */
function findTask(tasks: Task[], identifier: string): Task | undefined {
  // First try to match by ID prefix
  const byId = tasks.find((t) => t.id.toLowerCase().startsWith(identifier.toLowerCase()));
  if (byId) return byId;
  
  // Then try title search (first match)
  const byTitle = tasks.find((t) =>
    t.title.toLowerCase().includes(identifier.toLowerCase())
  );
  return byTitle;
}
