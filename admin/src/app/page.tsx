"use client";

import { useEffect } from "react";
import { useAdminStore, type AdminView } from "@/lib/admin-store";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopBar } from "@/components/admin/admin-topbar";
import { AdminLogin } from "@/components/admin/admin-login";
import { DashboardView } from "@/components/admin/views/dashboard-view";
import { UsersView } from "@/components/admin/views/users-view";
import { UserDetailView } from "@/components/admin/views/user-detail-view";
import { DictionaryView } from "@/components/admin/views/dictionary-view";

const viewMeta: Record<AdminView, { title: string; subtitle: string }> = {
  dashboard: { title: "داشبورد", subtitle: "نمای کلی پلتفرم" },
  users: { title: "مدیریت کاربران", subtitle: "لیست کامل کاربران" },
  "user-detail": { title: "پروفایل کاربر", subtitle: "جزئیات حساب کاربر" },
  dictionary: { title: "واژه‌نامه", subtitle: "مدیریت لغات آلمانی" },
  settings: { title: "تنظیمات سایت", subtitle: "پیکربندی پلتفرم" },
};

export default function Home() {
  const {
    isAuthenticated,
    currentView,
    accessToken,
    loadUser,
  } = useAdminStore();

  // On first mount, if we have a stored token, validate it
  useEffect(() => {
    if (accessToken && !isAuthenticated) {
      loadUser();
    }
  }, [accessToken, isAuthenticated, loadUser]);

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  const meta = viewMeta[currentView];

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <AdminTopBar title={meta.title} subtitle={meta.subtitle} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mx-auto max-w-7xl">
            {currentView === "dashboard" ? <DashboardView /> : null}
            {currentView === "users" ? <UsersView /> : null}
            {currentView === "user-detail" ? <UserDetailView /> : null}
            {currentView === "dictionary" ? <DictionaryView /> : null}
            {currentView === "settings" ? (
              <div className="rounded-2xl border border-border bg-card p-12 text-center">
                <p className="text-sm font-semibold">بخش تنظیمات</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  این بخش به‌زودی فعال خواهد شد.
                </p>
              </div>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}
