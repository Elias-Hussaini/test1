"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, X } from "lucide-react";
import { useSession } from "@/lib/session-store";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { isActive, navItems } from "./nav";

type SidebarProps = { open: boolean; onClose: () => void };

export function AdminSidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const user = useSession((s) => s.user);
  const logout = useSession((s) => s.logout);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/55 backdrop-blur-sm transition-opacity md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        aria-label="منوی اصلی"
        className={cn(
          "glass fixed inset-y-0 right-0 z-50 flex w-72 flex-col border-l border-sidebar-border transition-transform duration-200 md:sticky md:top-0 md:h-screen md:translate-x-0",
          open ? "translate-x-0" : "translate-x-full md:translate-x-0",
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-sidebar-border px-5">
          <Logo size="md" showTagline />
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-sidebar-accent md:hidden"
            aria-label="بستن منو"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <p className="mb-2 mt-2 px-3 text-[10px] font-bold tracking-wider text-muted-foreground">منوی اصلی</p>
          <ul className="space-y-1">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
                      active ? "bg-primary text-primary-foreground shadow-md shadow-primary/30" : "text-sidebar-foreground hover:bg-sidebar-accent",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                        active ? "bg-white/20" : "bg-sidebar-accent/60 text-muted-foreground group-hover:text-sidebar-foreground",
                      )}
                    >
                      <item.icon aria-hidden="true" className="h-4 w-4" />
                    </span>
                    <span className="flex flex-col items-start text-right">
                      <span className="leading-tight">{item.label}</span>
                      <span className={cn("text-[10px]", active ? "text-white/75" : "text-muted-foreground")}>{item.description}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="shrink-0 border-t border-sidebar-border p-3">
          <div className="flex items-center gap-3 rounded-xl bg-sidebar-accent/60 p-3">
            <span
              aria-hidden="true"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary-c text-sm font-bold text-white"
            >
              {user?.username.charAt(0).toUpperCase() ?? "؟"}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{user?.username}</p>
              <p dir="ltr" className="truncate text-right text-[10px] text-muted-foreground">
                {user?.email}
              </p>
            </div>
            <button
              type="button"
              onClick={() => void logout()}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-danger/10 hover:text-danger"
              aria-label="خروج از حساب"
              title="خروج از حساب"
            >
              <LogOut aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
