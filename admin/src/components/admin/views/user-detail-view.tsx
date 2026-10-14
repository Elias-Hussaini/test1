"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  Mail,
  Calendar,
  Ban,
  Unlock,
  Shield,
} from "lucide-react";
import { useAdminStore } from "@/lib/admin-store";
import { adminUsersApi, dictionaryApi, type AdminUser, type Word } from "@/lib/api";
import { StatusBadge, RoleBadge } from "../badges";
import { useToast } from "@/hooks/use-toast";

export function UserDetailView() {
  const { accessToken, selectedUserId, setView } = useAdminStore();
  const { toast } = useToast();

  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // برای نمونه: واژه‌های لغت آلمانی (نه واژه‌های این کاربر، چون endpoint ندارد)
  const [recentWords, setRecentWords] = useState<Word[]>([]);

  useEffect(() => {
    if (!accessToken || !selectedUserId) return;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        // first fetch all users and find the one (simpler approach)
        const all = await adminUsersApi.list(accessToken, { page: 1, limit: 100 });
        const found = all.users.find((u) => u.id === selectedUserId);
        if (!found) {
          if (!cancelled) setError("کاربر یافت نشد.");
          return;
        }
        if (cancelled) return;
        setUser(found);

        // also fetch some words for display
        const wordsResp = await dictionaryApi.search(accessToken, { page: 1, limit: 5 });
        if (!cancelled) setRecentWords(wordsResp.words);
      } catch (err) {
        const error = err as { message?: string };
        if (!cancelled) setError(error.message ?? "خطا در بارگذاری");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [accessToken, selectedUserId]);

  const handleBlock = async () => {
    if (!accessToken || !user) return;
    try {
      const updated = await adminUsersApi.update(accessToken, user.id, { status: "blocked" });
      setUser(updated);
      toast({
        title: "کاربر مسدود شد",
        description: `${user.profile?.firstName ?? user.username} مسدود شد.`,
      });
    } catch (err) {
      const error = err as { message?: string };
      toast({ title: "خطا", description: error.message, variant: "destructive" });
    }
  };

  const handleUnblock = async () => {
    if (!accessToken || !user) return;
    try {
      const updated = await adminUsersApi.update(accessToken, user.id, { status: "active" });
      setUser(updated);
      toast({
        title: "رفع مسدودیت",
        description: `${user.profile?.firstName ?? user.username} آزاد شد.`,
      });
    } catch (err) {
      const error = err as { message?: string };
      toast({ title: "خطا", description: error.message, variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="h-6 w-40 animate-pulse rounded bg-muted" />
        <div className="h-32 animate-pulse rounded-2xl bg-muted" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <p className="text-sm font-semibold">{error ?? "کاربر یافت نشد"}</p>
        <button
          type="button"
          onClick={() => setView("users")}
          className="mt-3 text-sm text-primary hover:underline"
        >
          بازگشت به لیست کاربران
        </button>
      </div>
    );
  }

  const stats = [
    { label: "سطح زبانی", value: user.profile?.level ?? "A1" },
    { label: "امتیاز XP", value: (user.profile?.xp ?? 0).toLocaleString("fa-IR") },
    { label: "استریک", value: (user.profile?.streak ?? 0).toLocaleString("fa-IR") },
    { label: "وضعیت ایمیل", value: user.isEmailVerified ? "تأیید شده" : "تأیید نشده" },
  ];

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={() => setView("users")}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary"
      >
        <ArrowRight className="h-4 w-4" />
        بازگشت به لیست کاربران
      </button>

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl text-3xl font-black text-white shadow-lg"
              style={{
                backgroundImage: "linear-gradient(135deg, var(--primary), var(--secondary-c))",
              }}
            >
              {(user.profile?.firstName ?? user.username).charAt(0)}
            </span>
            <div className="min-w-0">
              <h2 className="text-xl font-black sm:text-2xl">
                {user.profile?.firstName ?? user.username}{" "}
                {user.profile?.lastName ?? ""}
              </h2>
              <p className="text-sm text-muted-foreground" dir="ltr">
                {user.email}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <StatusBadge status={user.status as "active" | "blocked" | "suspended"} />
                <RoleBadge role={user.role as "user" | "guest" | "premium" | "admin"} />
                <span className="status-pill border-border bg-muted text-muted-foreground">
                  سطح {user.profile?.level ?? "A1"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {user.status === "blocked" ? (
              <button
                type="button"
                onClick={handleUnblock}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-success/30 bg-success/10 px-4 text-sm font-bold text-success hover:bg-success/20"
              >
                <Unlock className="h-4 w-4" />
                رفع مسدودیت
              </button>
            ) : (
              <button
                type="button"
                onClick={handleBlock}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 px-4 text-sm font-bold text-danger hover:bg-danger/20"
              >
                <Ban className="h-4 w-4" />
                مسدود کردن
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <p className="text-2xl font-black">{s.value}</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-bold">اطلاعات حساب</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start justify-between gap-3">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                ایمیل
              </span>
              <span className="text-left font-medium" dir="ltr">{user.email}</span>
            </li>
            <li className="flex items-start justify-between gap-3">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                عضویت
              </span>
              <span className="font-medium">{new Date(user.createdAt).toLocaleDateString("fa-IR")}</span>
            </li>
            <li className="flex items-start justify-between gap-3">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Shield className="h-4 w-4" />
                شناسه
              </span>
              <span className="font-mono text-[11px]" dir="ltr">{user.id}</span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-bold">واژه‌های اخیر سیستم</h3>
          {recentWords.length === 0 ? (
            <p className="text-xs text-muted-foreground">واژه‌ای موجود نیست.</p>
          ) : (
            <ul className="space-y-2">
              {recentWords.map((w) => (
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

export default UserDetailView;
