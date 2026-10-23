"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, KeyRound, LogOut, MailCheck, ShieldAlert } from "lucide-react";
import { Card, ErrorState, Skeleton } from "@/components/app/ui";
import EditProfile from "@/components/profile/edit-profile";
import PlanCard from "@/components/profile/plan-card";
import ThemeSetting from "@/components/profile/theme-setting";
import { useApi } from "@/hooks/use-api";
import { authApi, vocabularyApi } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";

const fa = (n: number) => n.toLocaleString("fa-IR");

export default function ProfilePage() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const me = useApi((s) => authApi.me(s));
  const stats = useApi((s) => vocabularyApi.stats(s));

  if (me.error && !me.data) return <ErrorState message={me.error} onRetry={me.reload} />;
  if (!me.data) return <div className="space-y-4"><Skeleton className="h-36" /><Skeleton className="h-64" /></div>;

  const u = me.data;
  const p = u.profile;
  const fullName = [p?.firstName, p?.lastName].filter(Boolean).join(" ") || u.username;

  return (
    <div className="space-y-5">
      <section className="app-card flex flex-wrap items-center gap-4 p-5 sm:p-6">
        <span aria-hidden="true" dir="ltr" className="flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-primary to-secondary text-2xl font-black text-white shadow-lg shadow-primary/30">
          {u.username.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-black">{fullName}</h1>
          <p dir="ltr" className="truncate text-start text-sm text-muted">{u.email}</p>
          <p className="mt-1.5 flex flex-wrap gap-2">
            <span dir="ltr" className="badge bg-primary/10 text-primary">سطح {p?.level ?? "A1"}</span>
            {u.isEmailVerified ? (
              <span className="badge bg-success/15 text-success"><MailCheck aria-hidden="true" className="h-3 w-3" /> ایمیل تأیید شده</span>
            ) : (
              <Link href="/verify-email/" className="badge bg-danger/10 text-danger"><ShieldAlert aria-hidden="true" className="h-3 w-3" /> ایمیل تأیید نشده</Link>
            )}
          </p>
        </div>
        <dl className="grid w-full grid-cols-4 gap-2 text-center sm:w-auto">
          {[["XP", p?.xp ?? 0], ["روز پیاپی", p?.streak ?? 0], ["واژه", stats.data?.total ?? 0], ["یادگرفته", stats.data?.learned ?? 0]].map(([l, n]) => (
            <div key={l as string} className="rounded-2xl bg-foreground/[0.04] px-3 py-2">
              <dd className="font-black">{fa(n as number)}</dd>
              <dt className="text-[11px] text-muted">{l}</dt>
            </div>
          ))}
        </dl>
      </section>

      <div id="plan" className="scroll-mt-24"><PlanCard /></div>

      <EditProfile initial={{ firstName: p?.firstName ?? null, lastName: p?.lastName ?? null, bio: p?.bio ?? null, level: p?.level ?? "A1" }} onSaved={me.reload} />

      <div id="settings" className="scroll-mt-24 space-y-5">
        <Card>
          <h2 className="font-extrabold">ظاهر برنامه</h2>
          <p className="mb-3 mt-1 text-sm text-muted">تم روشن، تیره یا هماهنگ با سیستم.</p>
          <ThemeSetting />
          <p className="mt-3 text-xs leading-6 text-muted">اگر در سیستم‌عامل «کاهش حرکت» فعال باشد، انیمیشن‌های برنامه خودکار کم می‌شوند.</p>
        </Card>

        <Card>
          <h2 className="font-extrabold">اعلان‌ها</h2>
          <p className="mt-2 flex items-center gap-2 rounded-2xl bg-foreground/[0.04] p-4 text-sm text-muted">
            <Bell aria-hidden="true" className="h-4 w-4 shrink-0" /> تنظیمات اعلان بعد از اتصال سرویس اعلان‌ها فعال می‌شود.
          </p>
        </Card>

        <Card>
          <h2 className="font-extrabold">حساب و امنیت</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/forgot-password/" className="btn-soft"><KeyRound aria-hidden="true" className="h-4 w-4" /> تغییر رمز عبور</Link>
            <button
              type="button"
              className="btn-soft !bg-danger/10 !text-danger"
              onClick={async () => {
                await logout();
                router.replace("/login/");
              }}
            >
              <LogOut aria-hidden="true" className="h-4 w-4" /> خروج از حساب
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
