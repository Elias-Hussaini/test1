"use client";

import { Moon, Sun } from "lucide-react";
import { toggleTheme } from "@/lib/theme";

/** آیکن‌ها فقط با کلاس `dark` عوض می‌شوند؛ پس نیازی به state یا هیدریشن نیست. */
export function ThemeToggle() {
  return (
    <button
      type="button"
      onClick={() => toggleTheme()}
      aria-label="تغییر تم روشن و تاریک"
      title="تغییر تم"
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-foreground hover:border-primary/40 hover:text-primary active:scale-95"
    >
      <Sun aria-hidden="true" className="hidden h-[18px] w-[18px] dark:block" />
      <Moon aria-hidden="true" className="block h-[18px] w-[18px] dark:hidden" />
    </button>
  );
}
