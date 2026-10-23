"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { AlertTriangle, Lock, RotateCw, Sparkles, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { plans, type FeatureId } from "@/config/plans";
import { featureById } from "@/config/features";

/** سرتیتر صفحه؛ عنوان اصلی (h1) هر صفحه با همین ساخته می‌شود. */
export function PageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("mb-6 flex flex-wrap items-end justify-between gap-3", className)}>
      <div className="min-w-0">
        <h1 className="text-2xl font-black leading-tight sm:text-3xl">{title}</h1>
        {description ? <p className="mt-1.5 max-w-2xl text-sm leading-7 text-muted sm:text-base">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export function Card({
  children,
  className,
  as: Tag = "section",
}: {
  children: ReactNode;
  className?: string;
  as?: "section" | "div" | "article";
}) {
  return <Tag className={cn("app-card p-5 sm:p-6", className)}>{children}</Tag>;
}

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("skeleton", className)} />;
}

export function EmptyState({
  Icon,
  title,
  description,
  action,
  className,
}: {
  Icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center px-4 py-10 text-center", className)}>
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon aria-hidden="true" className="h-7 w-7" />
      </span>
      <h2 className="mt-4 text-lg font-extrabold">{title}</h2>
      {description ? <p className="mt-2 max-w-md text-sm leading-7 text-muted">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center px-4 py-10 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-danger/10 text-danger">
        <AlertTriangle aria-hidden="true" className="h-7 w-7" />
      </span>
      <h2 className="mt-4 text-lg font-extrabold">مشکلی پیش آمد</h2>
      <p className="mt-2 max-w-md text-sm leading-7 text-muted">{message}</p>
      {onRetry ? (
        <button type="button" onClick={onRetry} className="btn-soft mt-5">
          <RotateCw aria-hidden="true" className="h-4 w-4" />
          تلاش دوباره
        </button>
      ) : null}
    </div>
  );
}

export function StatusBadge({ status }: { status: "live" | "soon" }) {
  return status === "live" ? (
    <span className="badge bg-success/15 text-success">فعال</span>
  ) : (
    <span className="badge bg-primary/10 text-primary">به‌زودی</span>
  );
}

/** نمایش قفل اشتراک برای ویژگی‌هایی که در پلن فعلی نیستند. */
export function LockedNotice({ feature }: { feature: FeatureId }) {
  const f = featureById(feature);
  return (
    <div className="app-card flex flex-col items-center gap-3 border-primary/30 bg-primary/5 p-8 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
        <Lock aria-hidden="true" className="h-7 w-7" />
      </span>
      <h2 className="text-lg font-extrabold">«{f.title}» در پلن {plans.free.name} فعال نیست</h2>
      <p className="max-w-md text-sm leading-7 text-muted">
        این خدمت با پلن {plans.premium.name} فعال می‌شود. وضعیت اشتراک و خدمات فعالت را در پروفایل می‌بینی.
      </p>
      <Link href="/profile/#plan" className="btn-primary">
        <Sparkles aria-hidden="true" className="h-4 w-4" />
        مشاهده اشتراک
      </Link>
    </div>
  );
}

/** بلوک «به‌زودی» با توضیح صادقانه‌ی وضعیت اتصال سرویس. */
export function ComingSoon({
  Icon,
  title,
  description,
  points,
}: {
  Icon: LucideIcon;
  title: string;
  description: string;
  points?: string[];
}) {
  return (
    <Card className="text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon aria-hidden="true" className="h-7 w-7" />
      </span>
      <p className="mt-4">
        <StatusBadge status="soon" />
      </p>
      <h2 className="mt-3 text-lg font-extrabold">{title}</h2>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-7 text-muted">{description}</p>
      {points?.length ? (
        <ul className="mx-auto mt-5 grid max-w-xl gap-2 text-start text-sm sm:grid-cols-2">
          {points.map((p) => (
            <li key={p} className="flex items-start gap-2 rounded-xl bg-foreground/[0.04] px-3 py-2.5">
              <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              {p}
            </li>
          ))}
        </ul>
      ) : null}
    </Card>
  );
}
