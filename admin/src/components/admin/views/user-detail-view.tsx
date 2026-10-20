"use client";

import { useCallback } from "react";
import Link from "next/link";
import { ArrowRight, BookMarked, BookOpenCheck, CalendarClock, Flame, GraduationCap, MailCheck, MailQuestion, Sparkles, UserX } from "lucide-react";
import { useApi } from "@/hooks/use-api";
import { adminUsersApi, type AdminUserDetail } from "@/lib/api";
import { faDateTime, faNumber, faRelative } from "@/lib/format";
import { RoleBadge, StatusBadge } from "../badges";
import { Button } from "../common/controls";
import { ConfirmDialog } from "../common/confirm-dialog";
import { Panel } from "../common/page-header";
import { EmptyState, ErrorState, Skeleton } from "../common/states";
import { StatCard } from "../common/stat-card";
import { actionsFor, useUserActions } from "../user-actions";

export function UserDetailView({ id }: { id: string }) {
  const { data: user, error, errorStatus, loading, reload, setData } = useApi((signal) => adminUsersApi.get(id, signal), [id]);

  const handleUpdated = useCallback(
    (_id: string, fields: Partial<AdminUserDetail>) => setData((current) => ({ ...current, ...fields })),
    [setData],
  );
  const actions = useUserActions(handleUpdated);

  const back = (
    <Link href="/users" className="mb-5 inline-flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-primary">
      <ArrowRight aria-hidden="true" className="h-4 w-4" />
      بازگشت به کاربران
    </Link>
  );

  if (error) {
    const notFound = errorStatus === 404;
    return (
      <>
        {back}
        {notFound ? <EmptyState icon={UserX} title="این کاربر پیدا نشد" description="ممکن است حذف شده باشد یا شناسه اشتباه باشد." /> : <ErrorState message={error} onRetry={reload} />}
      </>
    );
  }

  if (loading && !user) {
    return (
      <>
        {back}
        <Skeleton className="h-40 w-full" />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      </>
    );
  }

  if (!user) return null;

  const available = actionsFor(user, actions.selfId);
  const fullName = [user.profile?.firstName, user.profile?.lastName].filter(Boolean).join(" ");

  return (
    <>
      {back}

      <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-6">
        <div aria-hidden="true" className="pointer-events-none absolute -left-10 -top-16 h-52 w-52 rounded-full bg-primary/15 blur-3xl" />
        <div className="relative flex flex-wrap items-center gap-5">
          <span aria-hidden="true" className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary-c text-3xl font-black text-white shadow-lg shadow-primary/30">
            {user.username.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-black">{fullName || user.username}</h1>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
            <p dir="ltr" className="mt-1 flex items-center justify-end gap-1.5 truncate text-sm text-muted-foreground sm:justify-start">
              {user.email}
              {user.isEmailVerified ? <MailCheck aria-label="ایمیل تأییدشده" className="h-4 w-4 text-success" /> : <MailQuestion aria-label="ایمیل تأییدنشده" className="h-4 w-4 text-warning" />}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <RoleBadge role={user.role} />
              <StatusBadge status={user.status} />
            </div>
          </div>
        </div>

        {available.length > 0 ? (
          <div className="relative mt-5 flex flex-wrap gap-2 border-t border-border pt-5">
            {available.map((action) => (
              <Button key={action.key} variant={action.tone === "danger" ? "danger" : "secondary"} size="sm" onClick={() => actions.run(user, action)} disabled={actions.busy}>
                <action.icon aria-hidden="true" className="h-4 w-4" />
                {action.label}
              </Button>
            ))}
          </div>
        ) : (
          <p className="relative mt-5 border-t border-border pt-4 text-xs text-muted-foreground">این حساب خودت است؛ برای جلوگیری از قفل‌شدن، نقش و وضعیتش از اینجا تغییر نمی‌کند.</p>
        )}
      </section>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="کلمات ذخیره‌شده" value={faNumber(user.stats.savedWords)} icon={BookMarked} />
        <StatCard label="یادگرفته‌شده" value={faNumber(user.stats.learnedWords)} icon={GraduationCap} tone="success" />
        <StatCard label="در حال یادگیری" value={faNumber(user.stats.learningWords)} icon={BookOpenCheck} tone="cyan" />
        <StatCard label="نشست‌های فعال" value={faNumber(user.stats.sessions)} icon={CalendarClock} tone="warning" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title="پروفایل یادگیری">
          <dl className="divide-y divide-border text-sm">
            <Row label="سطح"><b className="text-primary">{user.profile?.level ?? "—"}</b></Row>
            <Row label="تجربه (XP)"><span className="inline-flex items-center gap-1.5"><Sparkles aria-hidden="true" className="h-4 w-4 text-accent" />{faNumber(user.profile?.xp)}</span></Row>
            <Row label="رکورد پیاپی"><span className="inline-flex items-center gap-1.5"><Flame aria-hidden="true" className="h-4 w-4 text-warning" />{faNumber(user.profile?.streak)} روز</span></Row>
            <Row label="درباره‌ی کاربر"><span className="text-muted-foreground">{user.profile?.bio || "—"}</span></Row>
          </dl>
        </Panel>

        <Panel title="اطلاعات حساب">
          <dl className="divide-y divide-border text-sm">
            <Row label="عضویت">{faDateTime(user.createdAt)} <span className="text-xs text-muted-foreground">({faRelative(user.createdAt)})</span></Row>
            <Row label="آخرین به‌روزرسانی">{faDateTime(user.updatedAt)}</Row>
            <Row label="شناسه"><code dir="ltr" className="break-all text-xs text-muted-foreground">{user.id}</code></Row>
          </dl>
        </Panel>
      </div>

      <ConfirmDialog
        open={actions.pending !== null}
        onOpenChange={(open) => (open ? undefined : actions.cancelPending())}
        title={actions.pending?.action.confirm?.title ?? ""}
        description={actions.pending?.action.confirm?.description ?? ""}
        confirmLabel={actions.pending?.action.confirm?.confirmLabel ?? "تأیید"}
        tone={actions.pending?.action.tone === "danger" ? "danger" : "primary"}
        loading={actions.busy}
        onConfirm={actions.confirmPending}
      />
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 py-3.5">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className="min-w-0 text-left font-medium">{children}</dd>
    </div>
  );
}
