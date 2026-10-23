"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { THEME_STORAGE_KEY } from "@/lib/theme";
import { cn } from "@/lib/utils";

type Mode = "light" | "dark" | "system";

const options: { id: Mode; label: string; Icon: typeof Sun }[] = [
  { id: "light", label: "روشن", Icon: Sun },
  { id: "dark", label: "تیره", Icon: Moon },
  { id: "system", label: "سیستم", Icon: Monitor },
];

function apply(mode: Mode) {
  const dark = mode === "dark" || (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
}

export default function ThemeSetting() {
  const [mode, setMode] = useState<Mode>("system");

  useEffect(() => {
    try {
      const v = localStorage.getItem(THEME_STORAGE_KEY);
      setMode(v === "dark" || v === "light" ? v : "system");
    } catch {}
  }, []);

  const choose = (next: Mode) => {
    setMode(next);
    apply(next);
    try {
      if (next === "system") localStorage.removeItem(THEME_STORAGE_KEY);
      else localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {}
  };

  return (
    <div role="radiogroup" aria-label="تم" className="grid grid-cols-3 gap-2">
      {options.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          role="radio"
          aria-checked={mode === id}
          onClick={() => choose(id)}
          className={cn(
            "flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl border text-sm font-bold transition-colors",
            mode === id ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/40",
          )}
        >
          <Icon aria-hidden="true" className="h-5 w-5" />
          {label}
        </button>
      ))}
    </div>
  );
}
