"use client";

import { Menu, Bell, ChevronDown } from "lucide-react";
import { useAdminStore } from "@/lib/admin-store";
import { ThemeToggle } from "./theme-toggle";
import { Logo } from "./logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type TopBarProps = {
  title: string;
  subtitle?: string;
};

export function AdminTopBar({ title, subtitle }: TopBarProps) {
  const { setSidebarOpen, user, logout } = useAdminStore();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/70 px-4 backdrop-blur-xl sm:px-6">
      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border hover:border-primary/40 md:hidden"
        aria-label="باز کردن منو"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-base font-bold sm:text-lg">{title}</h1>
        {subtitle ? (
          <p className="truncate text-[11px] text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>

      <button
        type="button"
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border hover:border-primary/40"
        aria-label="اعلان‌ها"
      >
        <Bell className="h-5 w-5" />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger ring-2 ring-background" />
      </button>

      <ThemeToggle />

      <div className="md:hidden">
        <Logo size="sm" />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="hidden items-center gap-2 rounded-xl border border-border px-2 py-1.5 hover:border-primary/40 sm:inline-flex"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary-c text-xs font-bold text-white">
              {user?.username?.charAt(0).toUpperCase() ?? "م"}
            </span>
            <span className="text-sm font-medium">{user?.username ?? "admin"}</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>حساب من</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>تنظیمات پروفایل</DropdownMenuItem>
          <DropdownMenuItem>فعالیت‌های من</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
            خروج از حساب
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

export default AdminTopBar;
