"use client";

import { useCallback, useState } from "react";
import { Ban, BadgeCheck, CircleCheck, Crown, CirclePause, ShieldCheck, UserRound, type LucideIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { adminUsersApi, errorMessage, type AdminUser, type UserRole, type UserStatus } from "@/lib/api";
import { useSession } from "@/lib/session-store";

type UserPatch = { role?: UserRole; status?: UserStatus; isEmailVerified?: boolean };
type Subject = Pick<AdminUser, "id" | "username" | "role" | "status" | "isEmailVerified">;

export type UserAction = {
  key: string;
  label: string;
  icon: LucideIcon;
  patch: UserPatch;
  tone?: "danger";
  /** اگر تعریف شده باشد قبل از اجرا تأیید گرفته می‌شود. */
  confirm?: { title: string; description: string; confirmLabel: string };
};

/** عملیات مجاز روی یک کاربر؛ حساب خود ادمین هیچ عملیاتی ندارد (بک‌اند هم رد می‌کند). */
export function actionsFor(user: Subject, selfId: string | undefined): UserAction[] {
  if (user.id === selfId) return [];
  const name = user.username;
  const actions: UserAction[] = [];

  if (user.status !== "active") {
    actions.push({ key: "activate", label: "فعال‌سازی حساب", icon: CircleCheck, patch: { status: "active" } });
  }
  if (user.status !== "suspended") {
    actions.push({
      key: "suspend",
      label: "تعلیق حساب",
      icon: CirclePause,
      patch: { status: "suspended" },
      confirm: { title: "تعلیق حساب", description: `حساب «${name}» معلق می‌شود و تا فعال‌سازی دوباره نمی‌تواند از LINGO استفاده کند.`, confirmLabel: "تعلیق کن" },
    });
  }
  if (user.status !== "blocked") {
    actions.push({
      key: "block",
      label: "مسدودسازی حساب",
      icon: Ban,
      tone: "danger",
      patch: { status: "blocked" },
      confirm: { title: "مسدودسازی حساب", description: `حساب «${name}» مسدود می‌شود و ورودش رد خواهد شد. هر وقت خواستی می‌توانی دوباره فعالش کنی.`, confirmLabel: "مسدود کن" },
    });
  }
  if (!user.isEmailVerified) {
    actions.push({ key: "verify", label: "تأیید دستی ایمیل", icon: BadgeCheck, patch: { isEmailVerified: true } });
  }
  if (user.role !== "premium" && user.role !== "admin") {
    actions.push({ key: "premium", label: "ارتقا به پرمیوم", icon: Crown, patch: { role: "premium" } });
  }
  if (user.role === "premium") {
    actions.push({ key: "demote-user", label: "تبدیل به کاربر عادی", icon: UserRound, patch: { role: "user" } });
  }
  if (user.role !== "admin") {
    actions.push({
      key: "make-admin",
      label: "ارتقا به مدیر",
      icon: ShieldCheck,
      patch: { role: "admin" },
      confirm: { title: "ارتقا به مدیر", description: `«${name}» به‌طور کامل به این پنل و همه‌ی بخش‌های مدیریتی دسترسی پیدا می‌کند. فقط برای افراد مورد اعتماد انجام بده.`, confirmLabel: "مدیرش کن" },
    });
  } else {
    actions.push({
      key: "revoke-admin",
      label: "گرفتن دسترسی مدیر",
      icon: UserRound,
      tone: "danger",
      patch: { role: "user" },
      confirm: { title: "گرفتن دسترسی مدیر", description: `«${name}» دیگر به پنل مدیریت دسترسی نخواهد داشت.`, confirmLabel: "دسترسی را بگیر" },
    });
  }
  return actions;
}

/**
 * اجرای یک عملیات روی کاربر (با تأیید در صورت نیاز) + اعلان نتیجه.
 * `onUpdated` بعد از موفقیت با فیلدهای تازه‌ی کاربر صدا زده می‌شود.
 */
export function useUserActions(onUpdated: (id: string, fields: UserPatch) => void) {
  const selfId = useSession((s) => s.user?.id);
  const [pending, setPending] = useState<{ user: Subject; action: UserAction } | null>(null);
  const [busy, setBusy] = useState(false);

  const execute = useCallback(
    async (user: Subject, action: UserAction) => {
      setBusy(true);
      try {
        const updated = await adminUsersApi.update(user.id, action.patch);
        onUpdated(user.id, { role: updated.role, status: updated.status, isEmailVerified: updated.isEmailVerified });
        toast({ title: "انجام شد", description: `${action.label} برای «${user.username}» اعمال شد.` });
        setPending(null);
      } catch (error) {
        toast({ title: "انجام نشد", description: errorMessage(error), variant: "destructive" });
      } finally {
        setBusy(false);
      }
    },
    [onUpdated],
  );

  const run = useCallback(
    (user: Subject, action: UserAction) => {
      if (action.confirm) setPending({ user, action });
      else void execute(user, action);
    },
    [execute],
  );

  return {
    selfId,
    busy,
    pending,
    run,
    confirmPending: () => (pending ? execute(pending.user, pending.action) : undefined),
    cancelPending: () => setPending(null),
  };
}
