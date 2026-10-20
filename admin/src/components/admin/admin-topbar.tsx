"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, LogOut, Menu, Settings } from "lucide-react";
import { useSession } from "@/lib/session-store";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Logo } from "./logo";
import { titleFor } from "./nav";
import { ThemeToggle } from "./theme-toggle";

export function AdminTopBar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const pathname = usePathname();
  const user = useSession((s) => s.user);
  const logout = useSession((s) => s.logout);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/75 px-4 backdrop-blur-xl sm:px-6">
      <button
        type="button"
        onClick={onOpenMenu}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border hover:border-primary/40 md:hidden"
        aria-label="باز کردن منو"
      >
        <Menu aria-hidden="true" className="h-5 w-5" />
      </button>

      <p className="min-w-0 flex-1 truncate text-sm font-bold text-muted-foreground">
        <span className="hidden sm:inline">پنل مدیریت / </span>
        <span className="text-foreground">{titleFor(pathname)}</span>
      </p>

      <div className="md:hidden">
        <Logo size="sm" />
      </div>

      <ThemeToggle />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button type="button" className="hidden items-center gap-2 rounded-xl border border-border px-2 py-1.5 hover:border-primary/40 sm:inline-flex">
            <span
              aria-hidden="true"
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary-c text-xs font-bold text-white"
            >
              {user?.username.charAt(0).toUpperCase() ?? "؟"}
            </span>
            <span className="text-sm font-medium">{user?.username}</span>
            <ChevronDown aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>حساب من</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/settings">
              <Settings aria-hidden="true" />
              تنظیمات
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => void logout()}>
            <LogOut aria-hidden="true" />
            خروج از حساب
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
