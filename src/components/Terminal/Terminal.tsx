"use client";

/**
 * Terminal Component
 * 
 * A fully-featured terminal emulator using xterm.js.
 * Handles command input, output display, and history navigation.
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { Terminal as XTerm } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";
import type { Task } from "@/types/task";
import { executeCommand } from "@/lib/commands";
import "@xterm/xterm/css/xterm.css";

interface TerminalProps {
  tasks: Task[];
  onNavigate?: (path: string) => void;
}

/**
 * ANSI color codes for terminal styling
 */
const COLORS = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  magenta: "\x1b[35m",
};

/**
 * Terminal prompt string
 */
const PROMPT = `${COLORS.cyan}loki${COLORS.reset}${COLORS.dim}@${COLORS.reset}${COLORS.magenta}kanban${COLORS.reset}${COLORS.dim}:${COLORS.reset}${COLORS.yellow}~${COLORS.reset}$ `;

export function Terminal({ tasks, onNavigate }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  
  const [history, setHistory] = useState<string[]>([]);
  const tasksRef = useRef(tasks);
  
  // Keep tasks ref updated
  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);
  
  /**
   * Write prompt to terminal
   */
  const writePrompt = useCallback(() => {
    xtermRef.current?.write("\r\n" + PROMPT);
  }, []);
  
  /**
   * Write lines of output to terminal
   */
  const writeOutput = useCallback((lines: string[]) => {
    const term = xtermRef.current;
    if (!term) return;
    
    for (const line of lines) {
      term.write("\r\n" + line);
    }
  }, []);
  
  /**
   * Handle command execution
   */
  const handleCommand = useCallback(async (command: string) => {
    const term = xtermRef.current;
    if (!term) return;
    
    // Add to history if non-empty
    if (command.trim()) {
      setHistory((prev) => [...prev.filter((h) => h !== command), command]);
    }
    
    if (!command.trim()) {
      writePrompt();
      return;
    }
    
    // Execute the command
    const output = await executeCommand(command, tasksRef.current, {
      onNavigate,
      onClear: () => {
        term.clear();
        term.write(PROMPT);
      },
      onRefresh: () => {
        // Tasks are already reactive via props
      },
    });
    
    writeOutput(output);
    writePrompt();
  }, [writePrompt, writeOutput, onNavigate]);
  
  /**
   * Initialize terminal
   */
  useEffect(() => {
    if (!terminalRef.current || xtermRef.current) return;
    
    // Create terminal instance
    const term = new XTerm({
      cursorBlink: true,
      cursorStyle: "block",
      fontSize: 14,
      fontFamily: '"JetBrains Mono", "Fira Code", "SF Mono", Menlo, Monaco, "Courier New", monospace',
      theme: {
        background: "#0d1117",
        foreground: "#c9d1d9",
        cursor: "#58a6ff",
        cursorAccent: "#0d1117",
        selectionBackground: "#264f78",
        black: "#484f58",
        red: "#ff7b72",
        green: "#3fb950",
        yellow: "#d29922",
        blue: "#58a6ff",
        magenta: "#bc8cff",
        cyan: "#39c5cf",
        white: "#b1bac4",
        brightBlack: "#6e7681",
        brightRed: "#ffa198",
        brightGreen: "#56d364",
        brightYellow: "#e3b341",
        brightBlue: "#79c0ff",
        brightMagenta: "#d2a8ff",
        brightCyan: "#56d4dd",
        brightWhite: "#f0f6fc",
      },
      allowTransparency: true,
      scrollback: 1000,
    });
    
    // Create and load addons
    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();
    
    term.loadAddon(fitAddon);
    term.loadAddon(webLinksAddon);
    
    // Open terminal in container
    term.open(terminalRef.current);
    
    // Fit to container
    fitAddon.fit();
    
    // Store refs
    xtermRef.current = term;
    fitAddonRef.current = fitAddon;
    
    // Write welcome message
    term.writeln(`${COLORS.bold}${COLORS.cyan}╔════════════════════════════════════════════╗${COLORS.reset}`);
    term.writeln(`${COLORS.bold}${COLORS.cyan}║${COLORS.reset}     ${COLORS.bold}🦊 Loki Kanban Terminal${COLORS.reset}              ${COLORS.cyan}║${COLORS.reset}`);
    term.writeln(`${COLORS.bold}${COLORS.cyan}╚════════════════════════════════════════════╝${COLORS.reset}`);
    term.writeln("");
    term.writeln(`${COLORS.dim}Type ${COLORS.green}/help${COLORS.dim} for available commands${COLORS.reset}`);
    term.writeln(`${COLORS.dim}Type ${COLORS.green}/board${COLORS.dim} to open Kanban board${COLORS.reset}`);
    term.write("\r\n" + PROMPT);
    
    // Handle resize
    const handleResize = () => {
      fitAddon.fit();
    };
    window.addEventListener("resize", handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      term.dispose();
      xtermRef.current = null;
      fitAddonRef.current = null;
    };
  }, []);
  
  /**
   * Handle keyboard input
   */
  useEffect(() => {
    const term = xtermRef.current;
    if (!term) return;
    
    let line = "";
    let histIdx = -1;
    
    const disposable = term.onKey(({ key, domEvent }) => {
      const char = key;
      const ev = domEvent;
      
      // Enter - execute command
      if (ev.key === "Enter") {
        const command = line;
        line = "";
        histIdx = -1;
        handleCommand(command);
        return;
      }
      
      // Backspace
      if (ev.key === "Backspace") {
        if (line.length > 0) {
          line = line.slice(0, -1);
          term.write("\b \b");
        }
        return;
      }
      
      // Arrow Up - history navigation
      if (ev.key === "ArrowUp") {
        if (history.length > 0 && histIdx < history.length - 1) {
          histIdx++;
          const historyCmd = history[history.length - 1 - histIdx];
          
          // Clear current line
          term.write("\r" + PROMPT + " ".repeat(line.length) + "\r" + PROMPT);
          line = historyCmd;
          term.write(line);
        }
        return;
      }
      
      // Arrow Down - history navigation
      if (ev.key === "ArrowDown") {
        if (histIdx > 0) {
          histIdx--;
          const historyCmd = history[history.length - 1 - histIdx];
          
          term.write("\r" + PROMPT + " ".repeat(line.length) + "\r" + PROMPT);
          line = historyCmd;
          term.write(line);
        } else if (histIdx === 0) {
          histIdx = -1;
          term.write("\r" + PROMPT + " ".repeat(line.length) + "\r" + PROMPT);
          line = "";
        }
        return;
      }
      
      // Ctrl+C - clear line
      if (ev.ctrlKey && ev.key === "c") {
        term.write("^C");
        line = "";
        writePrompt();
        return;
      }
      
      // Ctrl+L - clear screen
      if (ev.ctrlKey && ev.key === "l") {
        term.clear();
        term.write(PROMPT + line);
        return;
      }
      
      // Tab - autocomplete (basic)
      if (ev.key === "Tab") {
        ev.preventDefault();
        if (line.startsWith("/")) {
          const commands = [
            "/add", "/list", "/done", "/start", "/delete", "/move",
            "/edit", "/search", "/clear", "/help", "/board", "/status"
          ];
          const matches = commands.filter((c) => c.startsWith(line));
          if (matches.length === 1) {
            const completion = matches[0].slice(line.length) + " ";
            line += completion;
            term.write(completion);
          }
        }
        return;
      }
      
      // Ignore other control characters
      if (ev.ctrlKey || ev.altKey || ev.metaKey) {
        return;
      }
      
      // Ignore non-printable characters
      if (char.length !== 1 || char.charCodeAt(0) < 32) {
        return;
      }
      
      // Regular character input
      line += char;
      term.write(char);
    });
    
    return () => {
      disposable.dispose();
    };
  }, [history, handleCommand, writePrompt]);
  
  return (
    <div
      ref={terminalRef}
      className="w-full h-full min-h-[400px] bg-[#0d1117] rounded-lg overflow-hidden"
      style={{ padding: "12px" }}
    />
  );
}
