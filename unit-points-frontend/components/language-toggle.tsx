"use client";

import * as React from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

import { Button } from "@/components/ui/button";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const handleLanguageChange = React.useCallback((newLanguage: "en" | "es") => {
    console.log(`Changing language to ${newLanguage}`);
    setLanguage(newLanguage);
    setIsDropdownOpen(false);
  }, [setLanguage]);

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

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="relative overflow-hidden bg-gradient-to-br from-secondary/10 via-accent/10 to-primary/10 border border-secondary/20 hover:border-secondary/40 hover:bg-secondary/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-secondary/30 cursor-pointer group"
      >
        <Globe className="h-[1.2rem] w-[1.2rem] text-secondary group-hover:text-accent transition-colors duration-300" />
        <span className="absolute top-1 right-1 text-[8px] font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
          {language.toUpperCase()}
        </span>
        <span className="sr-only">Toggle language</span>
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md" />
      </Button>

      {/* Custom Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-40 glass-surface border-secondary/20 shadow-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md z-50 animate-in fade-in-0 zoom-in-95 duration-200">
          <div className="py-1">
            <button
              onClick={() => handleLanguageChange("en")}
              className={`w-full flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-secondary/10 hover:text-secondary transition-all duration-200 ${
                language === "en"
                  ? "bg-secondary/10 text-secondary font-medium"
                  : ""
              }`}
            >
              <span className="mr-2 text-sm">🇺🇸</span>
              English
            </button>
            <button
              onClick={() => handleLanguageChange("es")}
              className={`w-full flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-secondary/10 hover:text-secondary transition-all duration-200 ${
                language === "es"
                  ? "bg-secondary/10 text-secondary font-medium"
                  : ""
              }`}
            >
              <span className="mr-2 text-sm">🇪🇸</span>
              Español
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
