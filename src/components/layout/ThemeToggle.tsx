"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  isOverHero?: boolean;
}

export function ThemeToggle({ isOverHero = false }: ThemeToggleProps) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const sync = () => {
      setDark(document.documentElement.classList.contains("dark"));
    };
    sync();
  }, []);

  const toggle = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // Ignore storage restrictions
    }
    setDark(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={`inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full transition-colors ${
        isOverHero
          ? "text-ivory/85 hover:bg-ivory/10 hover:text-ivory"
          : "text-ink/80 hover:bg-surface-muted/60 hover:text-ink"
      }`}
    >
      {dark ? (
        <Sun className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Moon className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  );
}
