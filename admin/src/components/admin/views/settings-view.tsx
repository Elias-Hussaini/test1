"use client";

import { useState } from "react";
import { CircleCheck, CircleX, LogOut, Moon, RotateCw, Sun } from "lucide-react";
import { useApi } from "@/hooks/use-api";
import { API_BASE_URL, authApi, healthApi, type UserRole } from "@/lib/api";
import { faDateTime } from "@/lib/format";
import { applyTheme, currentTheme, type ThemeName } from "@/lib/theme";
import { useSession } from "@/lib/session-store";
import { cn } from "@/lib/utils";
import { RoleBadge } from "../badges";
import { Button } from "../common/controls";
import { PageHeader, Panel } from "../common/page-header";
import { Skeleton } from "../common/states";

export function SettingsView() {
  const logout = useSession((s) => s.logout);
  const me = useApi((signal) => authApi.me(signal), []);
  const health = useApi((signal) => healthApi.get(signal), []);
  const [theme, setTheme] = useState<ThemeName>(() => currentTheme());

  const choose = (next: ThemeName) => {
    applyTheme(next);
    setTheme(next);
  };

  return (
    <>
      <PageHeader title="تنظیمات" description="حساب مدیر، ظاهر پنل و وضعیت اتصال به بک‌اند." />

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="حساب مدیر">
          {me.loading && !me.data ? (
            <div className="space-y-3 p-5">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-6 w-56" />
            </div>
          ) : (
            <dl className="divide-y divide-border text-sm">
              <Row label="نام کاربری">{me.data?.username ?? "—"}</Row>
              <Row label="ایمیل">
                <span dir="ltr">{me.data?.email ?? "—"}</span>
              </Row>
              <Row label="نقش">{me.data ? <RoleBadge role={me.data.role as UserRole} /> : "—"}</Row>
              <Row label="تأیید ایمیل">{me.data ? (me.data.isEmailVerified ? "تأییدشده" : "تأییدنشده") : "—"}</Row>
            </dl>
          )}
          <div className="border-t border-border p-4">
            <Button variant="danger" size="sm" onClick={() => void logout()}>
              <LogOut aria-hidden="true" className="h-4 w-4" />
              خروج از حساب
            </Button>
          </div>
        </Panel>

        <Panel title="ظاهر">
          <div className="p-5">
            <p className="mb-3 text-xs text-muted-foreground">انتخاب تو روی همین مرورگر ذخیره می‌شود.</p>
            <div role="radiogroup" aria-label="تم پنل" className="grid grid-cols-2 gap-3">
              {(
                [
                  ["dark", "تاریک", Moon],
                  ["light", "روشن", Sun],
                ] as const
              ).map(([value, label, Icon]) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={theme === value}
                  onClick={() => choose(value)}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-xl border px-4 py-4 text-sm font-bold",
                    theme === value ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/40",
                  )}
                >
                  <Icon aria-hidden="true" className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </Panel>

        <Panel
          title="اتصال به بک‌اند"
          className="lg:col-span-2"
          actions={
            <Button variant="ghost" size="sm" onClick={health.reload} loading={health.loading}>
              {health.loading ? null : <RotateCw aria-hidden="true" className="h-3.5 w-3.5" />}
              بررسی دوباره
            </Button>
          }
        >
          <dl className="divide-y divide-border text-sm">
            <Row label="آدرس API">
              <code dir="ltr" className="text-xs">{API_BASE_URL}</code>
            </Row>
            <Row label="وضعیت">
              {health.loading && !health.data ? (
                "در حال بررسی…"
              ) : health.data ? (
                <span className="inline-flex items-center gap-1.5 font-bold text-success">
                  <CircleCheck aria-hidden="true" className="h-4 w-4" />
                  آنلاین
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 font-bold text-danger">
                  <CircleX aria-hidden="true" className="h-4 w-4" />
                  {health.error ?? "در دسترس نیست"}
                </span>
              )}
            </Row>
            {health.data ? (
              <>
                <Row label="محیط اجرا">{String(health.data.environment ?? "—")}</Row>
                <Row label="زمان سرور">{typeof health.data.timestamp === "string" ? faDateTime(health.data.timestamp) : "—"}</Row>
              </>
            ) : null}
          </dl>
        </Panel>
      </div>
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3.5">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className="min-w-0 text-left font-medium">{children}</dd>
    </div>
  );
}
