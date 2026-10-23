"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Bell, LogOut, Settings, UserRound } from "lucide-react";
import { usePlan } from "@/hooks/use-plan";
import { useAuthStore } from "@/stores/auth-store";

export function displayName(user: { username: string; email: string } | null) {
  return user?.username ?? "کاربر";
}

export default function UserMenu() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { plan } = usePlan();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onPointer = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const initial = (user?.username ?? "؟").trim().charAt(0).toUpperCase();
  const itemCls = "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-foreground/5";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="منوی کاربر"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-primary to-secondary text-sm font-black text-white shadow-md shadow-primary/30 active:scale-95"
      >
        <span aria-hidden="true" dir="ltr">{initial}</span>
      </button>

      {open ? (
        <div role="menu" className="glass-strong absolute end-0 top-12 z-50 w-64 p-2 [border-radius:1.25rem]">
          <div className="px-3 pb-2 pt-2">
            <p className="truncate text-sm font-extrabold" dir="ltr">{displayName(user)}</p>
            <p className="truncate text-xs text-muted" dir="ltr">{user?.email}</p>
            <span className="badge mt-2 bg-primary/10 text-primary">پلن {plan.name}</span>
          </div>
          <div className="my-1 h-px bg-border" />
          <Link role="menuitem" href="/profile/" className={itemCls} onClick={() => setOpen(false)}>
            <UserRound aria-hidden="true" className="h-4 w-4 text-muted" /> پروفایل
          </Link>
          <Link role="menuitem" href="/profile/#settings" className={itemCls} onClick={() => setOpen(false)}>
            <Settings aria-hidden="true" className="h-4 w-4 text-muted" /> تنظیمات
          </Link>
          <Link role="menuitem" href="/notifications/" className={itemCls} onClick={() => setOpen(false)}>
            <Bell aria-hidden="true" className="h-4 w-4 text-muted" /> اعلان‌ها
          </Link>
          <div className="my-1 h-px bg-border" />
          <button
            role="menuitem"
            type="button"
            className={`${itemCls} text-danger`}
            onClick={async () => {
              setOpen(false);
              await logout();
              router.replace("/login/");
            }}
          >
            <LogOut aria-hidden="true" className="h-4 w-4" /> خروج از حساب
          </button>
        </div>
      ) : null}
    </div>
  );
}
