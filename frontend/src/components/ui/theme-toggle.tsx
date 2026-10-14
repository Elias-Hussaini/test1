"use client";

import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { THEME_STORAGE_KEY as STORAGE_KEY } from "@/lib/theme";

function readStoredTheme(): "dark" | "light" | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "dark" || value === "light" ? value : null;
  } catch {
    return null;
  }
}

function applyTheme(isDark: boolean) {
  document.documentElement.classList.toggle("dark", isDark);
}

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  useEffect(() => {
    // اگر کاربر انتخابی نکرده باشد، تغییر تم سیستم‌عامل را دنبال می‌کنیم.
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = (event: MediaQueryListEvent) => {
      if (readStoredTheme() === null) applyTheme(event.matches);
    };

    // همگام‌سازی بین تب‌ها.
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      if (event.newValue === "dark") applyTheme(true);
      else if (event.newValue === "light") applyTheme(false);
      else applyTheme(media.matches);
    };

    media.addEventListener("change", onSystemChange);
    window.addEventListener("storage", onStorage);
    return () => {
      media.removeEventListener("change", onSystemChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const toggle = () => {
    const nextIsDark = !document.documentElement.classList.contains("dark");
    applyTheme(nextIsDark);
    try {
      localStorage.setItem(STORAGE_KEY, nextIsDark ? "dark" : "light");
    } catch {
      // حالت خصوصی/بلاک‌شدن storage: تم فقط برای همین نشست اعمال می‌شود.
    }
  };

  // آیکن‌ها فقط با CSS (`dark:`) عوض می‌شوند، پس state اولیه‌ی کلاینت با سرور یکی است
  // و خطای Hydration ایجاد نمی‌شود.
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="تغییر تم روشن و تاریک"
      title="تغییر تم"
      className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-foreground hover:border-primary/40 hover:text-primary active:scale-95 ${className}`}
    >
      <Sun aria-hidden="true" className="hidden h-[18px] w-[18px] dark:block" />
      <Moon aria-hidden="true" className="block h-[18px] w-[18px] dark:hidden" />
    </button>
  );
}

export default ThemeToggle;
