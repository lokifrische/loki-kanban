import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

/**
 * JetBrains Mono font for terminal-style text
 */
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

/**
 * Page metadata
 */
export const metadata: Metadata = {
  title: "Loki Kanban",
  description: "Terminal-style task management with Kanban board",
  keywords: ["kanban", "task management", "terminal", "productivity"],
  authors: [{ name: "Nick Frische" }],
};

/**
 * Viewport configuration
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d1117",
};

/**
 * Root layout component
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body className="min-h-screen bg-[#0d1117] text-gray-100 antialiased font-mono">
        {children}
      </body>
    </html>
  );
}
