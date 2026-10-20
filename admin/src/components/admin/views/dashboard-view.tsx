"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, GraduationCap, UserPlus, Users } from "lucide-react";
import { useApi } from "@/hooks/use-api";
import { adminStatsApi, adminUsersApi, type AdminStats } from "@/lib/api";
import { faDayMonth, faNumber, faRelative } from "@/lib/format";
import { useSession } from "@/lib/session-store";
import { cn } from "@/lib/utils";
import { RoleBadge, StatusBadge } from "../badges";
import { PageHeader, Panel } from "../common/page-header";
import { StatCard } from "../common/stat-card";
import { EmptyState, ErrorState, Skeleton } from "../common/states";

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

export function DashboardView() {
  const username = useSession((s) => s.user?.username);
  const stats = useApi((signal) => adminStatsApi.get(signal), []);
  const recent = useApi((signal) => adminUsersApi.list({ page: 1, limit: 5 }, signal), []);

  const data = stats.data;

  return (
    <>
      <PageHeader title={username ? `سلام ${username} 👋` : "داشبورد"} description="نمای کلی پلتفرم LINGO؛ همه‌ی عددها مستقیم از دیتابیس خوانده می‌شوند." />

      {stats.error ? (
        <ErrorState message={stats.error} onRetry={stats.reload} />
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="کل کاربران" value={faNumber(data?.users.total)} hint={data ? `${faNumber(data.users.verified)} ایمیل تأییدشده` : undefined} icon={Users} loading={stats.loading && !data} />
            <StatCard label="ثبت‌نام ۷ روز اخیر" value={faNumber(data?.users.newLast7Days)} hint="کاربر جدید" icon={UserPlus} tone="cyan" loading={stats.loading && !data} />
            <StatCard label="کلمات واژه‌نامه" value={faNumber(data?.words.total)} hint="در دیتابیس سیستم" icon={BookOpen} tone="warning" loading={stats.loading && !data} />
            <StatCard
              label="کلمات یادگرفته‌شده"
              value={faNumber(data?.learning.learnedWords)}
              hint={data ? `از ${faNumber(data.learning.savedWords)} کلمه‌ی ذخیره‌شده` : undefined}
              icon={GraduationCap}
              tone="success"
              loading={stats.loading && !data}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Panel title="ثبت‌نام‌های ۱۴ روز اخیر" description="تعداد کاربران جدید در هر روز (UTC)" className="lg:col-span-2">
              <div className="p-5">{data ? <SignupChart signups={data.signups} /> : <Skeleton className="h-52 w-full" />}</div>
            </Panel>

            <Panel title="وضعیت حساب‌ها">
              <div className="space-y-4 p-5">
                {data ? <StatusBreakdown users={data.users} /> : <Skeleton className="h-40 w-full" />}
              </div>
            </Panel>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Panel title="کلمات به تفکیک سطح" className="lg:col-span-1">
              <div className="space-y-3 p-5">
                {data ? <LevelBars byLevel={data.words.byLevel} total={data.words.total} /> : <Skeleton className="h-44 w-full" />}
              </div>
            </Panel>

            <Panel
              title="جدیدترین کاربران"
              className="lg:col-span-2"
              actions={
                <Link href="/users" className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline">
                  همه‌ی کاربران
                  <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
                </Link>
              }
            >
              {recent.error ? (
                <div className="p-5">
                  <ErrorState message={recent.error} onRetry={recent.reload} />
                </div>
              ) : recent.loading && !recent.data ? (
                <div className="space-y-3 p-5">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : recent.data && recent.data.users.length > 0 ? (
                <ul className="divide-y divide-border">
                  {recent.data.users.map((user) => (
                    <li key={user.id}>
                      <Link href={`/users/${user.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/50">
                        <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary-c text-sm font-bold text-white">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-bold">{user.username}</span>
                          <span dir="ltr" className="block truncate text-right text-xs text-muted-foreground">
                            {user.email}
                          </span>
                        </span>
                        <span className="hidden items-center gap-2 sm:flex">
                          <RoleBadge role={user.role} />
                          <StatusBadge status={user.status} />
                        </span>
                        <span className="w-24 shrink-0 text-left text-xs text-muted-foreground">{faRelative(user.createdAt)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState icon={Users} title="هنوز کاربری ثبت‌نام نکرده" />
              )}
            </Panel>
          </div>
        </div>
      )}
    </>
  );
}

/* ─── نمودار ثبت‌نام (ستونی، بدون کتابخانه) ─── */

function SignupChart({ signups }: { signups: AdminStats["signups"] }) {
  const max = Math.max(1, ...signups.map((s) => s.count));
  const total = signups.reduce((sum, s) => sum + s.count, 0);

  return (
    <figure>
      <div
        role="img"
        aria-label={`ثبت‌نام ۱۴ روز اخیر: مجموعاً ${faNumber(total)} کاربر`}
        className="flex h-48 items-end gap-1.5 sm:gap-2"
      >
        {signups.map((point) => {
          const height = point.count === 0 ? 3 : Math.max(8, Math.round((point.count / max) * 100));
          return (
            <div key={point.date} className="group relative flex h-full flex-1 flex-col justify-end" title={`${faDayMonth(point.date)}: ${faNumber(point.count)} ثبت‌نام`}>
              <span className="mb-1 text-center text-[10px] font-bold text-muted-foreground opacity-0 group-hover:opacity-100">{faNumber(point.count)}</span>
              <div
                className={cn(
                  "w-full rounded-t-md",
                  point.count === 0 ? "bg-foreground/10" : "bg-gradient-to-t from-primary to-secondary-c group-hover:brightness-110",
                )}
                style={{ height: `${height}%` }}
              />
            </div>
          );
        })}
      </div>
      <figcaption className="mt-2 flex justify-between text-[10px] text-muted-foreground">
        <span>{faDayMonth(signups[0]?.date ?? "")}</span>
        <span>{faDayMonth(signups[signups.length - 1]?.date ?? "")}</span>
      </figcaption>
    </figure>
  );
}

/* ─── وضعیت و نقش‌ها ─── */

function StatusBreakdown({ users }: { users: AdminStats["users"] }) {
  const rows = [
    { label: "فعال", value: users.active, color: "bg-success" },
    { label: "معلق", value: users.suspended, color: "bg-warning" },
    { label: "مسدود", value: users.blocked, color: "bg-danger" },
  ];
  const roles: Array<[string, string]> = [
    ["user", "کاربر"],
    ["premium", "پرمیوم"],
    ["guest", "مهمان"],
    ["admin", "مدیر"],
  ];

  return (
    <>
      <ul className="space-y-3">
        {rows.map((row) => (
          <li key={row.label}>
            <div className="mb-1 flex justify-between text-xs">
              <span className="font-semibold">{row.label}</span>
              <span className="tabular-nums text-muted-foreground">{faNumber(row.value)}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-foreground/10">
              <div className={cn("h-full rounded-full", row.color)} style={{ width: `${users.total ? (row.value / users.total) * 100 : 0}%` }} />
            </div>
          </li>
        ))}
      </ul>
      <div className="border-t border-border pt-4">
        <p className="mb-2 text-xs font-bold text-muted-foreground">نقش‌ها</p>
        <div className="flex flex-wrap gap-2">
          {roles.map(([key, label]) => (
            <span key={key} className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1 text-xs">
              {label}
              <b className="tabular-nums">{faNumber(users.byRole[key] ?? 0)}</b>
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

function LevelBars({ byLevel, total }: { byLevel: Record<string, number>; total: number }) {
  const max = Math.max(1, ...LEVELS.map((level) => byLevel[level] ?? 0));
  if (total === 0) return <EmptyState icon={BookOpen} title="واژه‌نامه خالی است" description="از بخش واژه‌نامه اولین کلمه را اضافه کن." />;

  return (
    <ul className="space-y-3">
      {LEVELS.map((level) => {
        const count = byLevel[level] ?? 0;
        return (
          <li key={level} className="flex items-center gap-3">
            <span className="w-7 text-xs font-black text-primary">{level}</span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-foreground/10">
              <div className="h-full rounded-full bg-gradient-to-l from-primary to-secondary-c" style={{ width: `${(count / max) * 100}%` }} />
            </div>
            <span className="w-10 text-left text-xs tabular-nums text-muted-foreground">{faNumber(count)}</span>
          </li>
        );
      })}
    </ul>
  );
}
