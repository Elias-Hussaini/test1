"use client";

import {
  LayoutDashboard,
  Users,
  BookOpen,
  Settings,
  X,
  LogOut,
} from "lucide-react";
import { useAdminStore, type AdminView } from "@/lib/admin-store";
import { Logo } from "./logo";
import { cn } from "@/lib/utils";

type NavItem = {
  id: AdminView;
  label: string;
  icon: typeof LayoutDashboard;
  description: string;
};

const navItems: NavItem[] = [
  { id: "dashboard", label: "داشبورد", icon: LayoutDashboard, description: "نمای کلی" },
  { id: "users", label: "کاربران", icon: Users, description: "مدیریت کاربران" },
  { id: "dictionary", label: "واژه‌نامه", icon: BookOpen, description: "مدیریت لغات" },
  { id: "settings", label: "تنظیمات", icon: Settings, description: "تنظیمات سایت" },
];

export function AdminSidebar() {
  const { currentView, setView, sidebarOpen, setSidebarOpen, logout, user } = useAdminStore();

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity md:hidden",
          sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      <aside
        className={cn(
          "glass fixed inset-y-0 right-0 z-50 flex w-72 flex-col border-l border-sidebar-border transition-transform md:static md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0",
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-5">
          <Logo size="md" showTagline />
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-sidebar-accent md:hidden"
            aria-label="بستن منو"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3">
          <p className="mb-2 mt-2 px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            منوی اصلی
          </p>
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = currentView === item.id || (currentView === "user-detail" && item.id === "users");
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setView(item.id);
                      setSidebarOpen(false);
                    }}
                    className={cn(
                      "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                        : "text-sidebar-foreground hover:bg-sidebar-accent",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors",
                        isActive
                          ? "bg-white/20"
                          : "bg-sidebar-accent/50 text-muted-foreground group-hover:text-sidebar-foreground",
                      )}
                    >
                      <item.icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="flex flex-col items-start text-right">
                      <span className="leading-tight">{item.label}</span>
                      <span className={cn(
                        "text-[10px]",
                        isActive ? "text-white/70" : "text-muted-foreground",
                      )}>
                        {item.description}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-3 rounded-xl bg-sidebar-accent/50 p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary-c text-sm font-bold text-white">
              {user?.username?.charAt(0).toUpperCase() ?? "م"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {user?.username ?? "مدیر"}
              </p>
              <p className="truncate text-[10px] text-muted-foreground">
                {user?.email ?? "admin@lingo.app"}
              </p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-danger/10 hover:text-danger"
              aria-label="خروج"
              title="خروج از حساب"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
