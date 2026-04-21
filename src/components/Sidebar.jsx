"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, History, Hexagon } from "lucide-react";
import clsx from "clsx";
import { ThemeToggle } from "./ThemeToggle";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/", icon: <LayoutDashboard size={20} /> },
  { name: "Timeline", href: "/timeline", icon: <History size={20} /> },
];

export function Sidebar({ children }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-full bg-background text-text-primary overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-surface hidden md:flex flex-col flex-shrink-0 transition-colors duration-300">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <div className="flex items-center gap-2 font-bold text-xl tracking-wide w-full">
            <Hexagon size={24} className="text-secondary stroke-[2.5]" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">SmartUI</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  "relative flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group cursor-pointer overflow-hidden",
                  isActive
                    ? "text-primary dark:text-white bg-primary/10 border border-primary/20 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                    : "text-text-secondary hover:bg-white/5 hover:text-primary"
                )}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-50" />
                )}
                {isActive && (
                  <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-r-md shadow-[0_0_10px_#8B5CF6]" />
                )}
                <div
                  className={clsx(
                    "relative z-10 transition-transform duration-300 ease-out",
                    !isActive && "group-hover:scale-110 group-hover:-rotate-3 group-hover:text-primary",
                    isActive && "text-primary"
                  )}
                >
                  {item.icon}
                </div>
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
              AD
            </div>
            <div className="flex flex-col text-sm">
              <span className="font-medium">Admin User</span>
              <span className="text-xs text-text-secondary truncate w-24">admin@smartui.app</span>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden h-16 border-b border-border glass-panel flex items-center justify-between px-4 shrink-0 transition-colors duration-300 z-50">
          <div className="flex items-center gap-2 font-bold text-lg">
            <Hexagon size={20} className="text-secondary stroke-[2.5]" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">SmartUI</span>
          </div>
          <ThemeToggle />
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8 bg-background scroll-smooth">
          {children}
        </div>
      </main>
    </div>
  );
}
