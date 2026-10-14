"use client";

import { useEffect, useState } from "react";
import {
  Users,
  BookOpen,
  TrendingUp,
  Wallet,
  ArrowUpRight,
  Activity,
} from "lucide-react";
import { useAdminStore } from "@/lib/admin-store";
import { adminUsersApi, dictionaryApi, type AdminUser, type Word } from "@/lib/api";

type Stats = {
  totalUsers: number;
  activeUsers: number;
  blockedUsers: number;
  totalWords: number;
  recentUsers: AdminUser[];
  recentWords: Word[];
  loading: boolean;
  error: string | null;
};

export function DashboardView() {
  const { accessToken, openUserDetail } = useAdminStore();
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeUsers: 0,
    blockedUsers: 0,
    totalWords: 0,
    recentUsers: [],
    recentWords: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;

    const load = async () => {
      try {
        setStats((s) => ({ ...s, loading: true, error: null }));

        const [usersResp, wordsResp] = await Promise.all([
          adminUsersApi.list(accessToken, { page: 1, limit: 5 }),
          dictionaryApi.search(accessToken, { page: 1, limit: 5 }),
        ]);

        if (cancelled) return;

        setStats({
          totalUsers: usersResp.pagination.total,
          activeUsers: usersResp.users.filter((u) => u.status === "active").length,
          blockedUsers: usersResp.users.filter((u) => u.status === "blocked").length,
          totalWords: wordsResp.pagination.total,
          recentUsers: usersResp.users,
          recentWords: wordsResp.words,
          loading: false,
          error: null,
        });
      } catch (err) {
        const error = err as { message?: string };
        if (!cancelled) {
          setStats((s) => ({
            ...s,
            loading: false,
            error: error.message ?? "خطا در بارگذاری آمار",
          }));
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  if (stats.loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 rounded-2xl bg-muted animate-pulse" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="h-64 rounded-2xl bg-muted animate-pulse" />
          <div className="h-64 rounded-2xl bg-muted animate-pulse" />
        </div>
      </div>
    );
  }

  if (stats.error) {
    return (
      <div className="rounded-2xl border border-danger/30 bg-danger/5 p-8 text-center">
        <p className="text-sm font-semibold text-danger">{stats.error}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-3 rounded-lg border border-danger/30 px-3 py-1.5 text-sm hover:bg-danger/10"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  const cards = [
    {
      label: "کل کاربران",
      value: stats.totalUsers.toLocaleString("fa-IR"),
      Icon: Users,
      tint: "bg-primary/15 text-primary border-primary/30",
    },
    {
      label: "کاربران فعال",
      value: stats.activeUsers.toLocaleString("fa-IR"),
      Icon: TrendingUp,
      tint: "bg-success/15 text-success border-success/30",
    },
    {
      label: "کل واژه‌ها",
      value: stats.totalWords.toLocaleString("fa-IR"),
      Icon: BookOpen,
      tint: "bg-secondary-c/15 text-secondary-c border-secondary-c/30",
    },
    {
      label: "کاربران مسدود",
      value: stats.blockedUsers.toLocaleString("fa-IR"),
      Icon: Wallet,
      tint: "bg-warning/15 text-warning border-warning/30",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div
        className="relative overflow-hidden rounded-2xl border border-primary/15 p-6 sm:p-8"
        style={{
          background:
            "linear-gradient(135deg, rgba(117, 103, 248, 0.08), rgba(40, 199, 232, 0.04))",
        }}
      >
        <p className="text-xs font-bold text-primary">خوش آمدید 👋</p>
        <h2 className="mt-1 text-xl font-black sm:text-2xl">
          نمای کلی پلتفرم LINGO
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          وضعیت کاربران، واژه‌ها و فعالیت‌ها در یک نگاه
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">{c.label}</p>
                <p className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                  {c.value}
                </p>
              </div>
              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${c.tint}`}
              >
                <c.Icon className="h-6 w-6" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent users + words */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Recent users */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold">کاربران اخیر</h3>
              <p className="text-xs text-muted-foreground">جدیدترین کاربران ثبت‌نام‌شده</p>
            </div>
            <button
              type="button"
              onClick={() => useAdminStore.getState().setView("users")}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              مشاهده همه
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
          {stats.recentUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground">هنوز کاربری ثبت‌نام نکرده است.</p>
          ) : (
            <ul className="divide-y divide-border">
              {stats.recentUsers.map((u) => (
                <li
                  key={u.id}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{
                      backgroundImage: "linear-gradient(135deg, var(--primary), var(--secondary-c))",
                    }}
                  >
                    {(u.profile?.firstName ?? u.username).charAt(0)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {u.profile?.firstName ?? u.username}{" "}
                      {u.profile?.lastName ?? ""}
                    </p>
                    <p className="truncate text-xs text-muted-foreground" dir="ltr">
                      {u.email}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openUserDetail(u.id)}
                    className="rounded-lg border border-border px-2.5 py-1 text-xs hover:border-primary/40 hover:text-primary"
                  >
                    مشاهده
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent words */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold">واژه‌های اخیر</h3>
              <p className="text-xs text-muted-foreground">آخرین واژه‌های اضافه‌شده</p>
            </div>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          {stats.recentWords.length === 0 ? (
            <p className="text-sm text-muted-foreground">هنوز واژه‌ای اضافه نشده است.</p>
          ) : (
            <ul className="space-y-2">
              {stats.recentWords.map((w) => (
                <li
                  key={w.id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-border bg-background/40 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold" dir="ltr" lang="de">
                      {w.article ? <span className="text-accent">{w.article} </span> : null}
                      {w.german}
                    </p>
                    <p className="truncate text-[11px] text-muted-foreground">{w.persian}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold">
                    {w.level}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardView;
