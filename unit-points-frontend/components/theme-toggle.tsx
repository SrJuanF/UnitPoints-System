"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!mounted) {
    return null;
  }

  const handleThemeChange = (newTheme: string) => {
    console.log(`Setting theme to ${newTheme}`);
    setTheme(newTheme);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border border-primary/20 hover:border-primary/40 hover:bg-primary/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30 cursor-pointer group"
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0 text-primary group-hover:text-secondary" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100 text-primary group-hover:text-secondary" />
        <span className="sr-only">Toggle theme</span>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md" />
      </Button>

      {/* Custom Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 glass-surface border-primary/20 shadow-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md z-50 animate-in fade-in-0 zoom-in-95 duration-200">
          <div className="py-1">
            <button
              onClick={() => handleThemeChange("light")}
              className={`w-full flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-primary/10 hover:text-primary transition-all duration-200 ${
                theme === "light" ? "bg-primary/10 text-primary font-medium" : ""
              }`}
            >
              <Sun className="mr-2 h-4 w-4" />
              Light
            </button>
            <button
              onClick={() => handleThemeChange("dark")}
              className={`w-full flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-primary/10 hover:text-primary transition-all duration-200 ${
                theme === "dark" ? "bg-primary/10 text-primary font-medium" : ""
              }`}
            >
              <Moon className="mr-2 h-4 w-4" />
              Dark
            </button>
            <button
              onClick={() => handleThemeChange("system")}
              className={`w-full flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-primary/10 hover:text-primary transition-all duration-200 ${
                theme === "system" ? "bg-primary/10 text-primary font-medium" : ""
              }`}
            >
              <Monitor className="mr-2 h-4 w-4" />
              System
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
