/**
 * Command Parser
 * 
 * Parses terminal input into structured commands.
 * Supports slash commands with arguments and flags.
 */

import type { TaskStatus, TaskPriority } from "@/types/task";

/**
 * Parsed command structure
 */
export interface ParsedCommand {
  command: string;
  args: string[];
  flags: Record<string, string | boolean>;
  raw: string;
}

/**
 * Available commands
 */
export type CommandName =
  | "add"
  | "list"
  | "ls"
  | "done"
  | "start"
  | "delete"
  | "rm"
  | "move"
  | "edit"
  | "search"
  | "find"
  | "clear"
  | "help"
  | "board"
  | "status";

/**
 * Parse raw input into a structured command
 */
export function parseCommand(input: string): ParsedCommand | null {
  const trimmed = input.trim();
  
  // Must start with / to be a command
  if (!trimmed.startsWith("/")) {
    return null;
  }
  
  const raw = trimmed;
  const withoutSlash = trimmed.slice(1);
  
  // Split by spaces but preserve quoted strings
  const parts = splitPreservingQuotes(withoutSlash);
  
  if (parts.length === 0) {
    return null;
  }
  
  const command = parts[0].toLowerCase();
  const args: string[] = [];
  const flags: Record<string, string | boolean> = {};
  
  // Parse remaining parts into args and flags
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    
    if (part.startsWith("--")) {
      // Long flag: --flag=value or --flag
      const flagContent = part.slice(2);
      const equalIndex = flagContent.indexOf("=");
      
      if (equalIndex > 0) {
        const key = flagContent.slice(0, equalIndex);
        const value = flagContent.slice(equalIndex + 1);
        flags[key] = value;
      } else {
        flags[flagContent] = true;
      }
    } else if (part.startsWith("-") && part.length === 2) {
      // Short flag: -p high
      const flag = part.slice(1);
      if (i + 1 < parts.length && !parts[i + 1].startsWith("-")) {
        flags[flag] = parts[++i];
      } else {
        flags[flag] = true;
      }
    } else {
      // Regular argument
      args.push(part);
    }
  }
  
  return { command, args, flags, raw };
}

/**
 * Split string by spaces while preserving quoted content
 */
function splitPreservingQuotes(input: string): string[] {
  const parts: string[] = [];
  let current = "";
  let inQuotes = false;
  let quoteChar = "";
  
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    
    if ((char === '"' || char === "'") && !inQuotes) {
      inQuotes = true;
      quoteChar = char;
    } else if (char === quoteChar && inQuotes) {
      inQuotes = false;
      quoteChar = "";
    } else if (char === " " && !inQuotes) {
      if (current.length > 0) {
        parts.push(current);
        current = "";
      }
    } else {
      current += char;
    }
  }
  
  if (current.length > 0) {
    parts.push(current);
  }
  
  return parts;
}

/**
 * Validate and normalize status
 */
export function parseStatus(input: string): TaskStatus | null {
  const normalized = input.toLowerCase().replace(/[_\s]/g, "-");
  
  const statusMap: Record<string, TaskStatus> = {
    "todo": "todo",
    "to-do": "todo",
    "in-progress": "in-progress",
    "inprogress": "in-progress",
    "progress": "in-progress",
    "doing": "in-progress",
    "done": "done",
    "complete": "done",
    "completed": "done",
  };
  
  return statusMap[normalized] ?? null;
}

/**
 * Validate and normalize priority
 */
export function parsePriority(input: string): TaskPriority | null {
  const normalized = input.toLowerCase();
  
  const priorityMap: Record<string, TaskPriority> = {
    "low": "low",
    "l": "low",
    "1": "low",
    "medium": "medium",
    "med": "medium",
    "m": "medium",
    "2": "medium",
    "high": "high",
    "hi": "high",
    "h": "high",
    "3": "high",
  };
  
  return priorityMap[normalized] ?? null;
}

/**
 * Get command aliases
 */
export function getCommandAlias(command: string): CommandName | null {
  const aliases: Record<string, CommandName> = {
    "add": "add",
    "new": "add",
    "create": "add",
    "list": "list",
    "ls": "list",
    "all": "list",
    "done": "done",
    "complete": "done",
    "finish": "done",
    "start": "start",
    "begin": "start",
    "progress": "start",
    "delete": "delete",
    "rm": "delete",
    "remove": "delete",
    "del": "delete",
    "move": "move",
    "mv": "move",
    "edit": "edit",
    "update": "edit",
    "search": "search",
    "find": "search",
    "clear": "clear",
    "cls": "clear",
    "help": "help",
    "?": "help",
    "h": "help",
    "board": "board",
    "kanban": "board",
    "status": "status",
    "info": "status",
  };
  
  return aliases[command] ?? null;
}
