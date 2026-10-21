"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { landingNavLinks } from "@/config/landing";
import { getSessionHint } from "@/lib/token-store";
import { useAuthStore } from "@/stores/auth-store";
import SiteMobileNav from "@/components/layout/site-mobile-nav";
import ThemeToggle from "@/components/ui/theme-toggle";

export type HomeAuth = "pending" | "guest" | "member";

/**
 * وضعیت ورود برای صفحه‌ی اصلی (که استاتیک است).
 * - «pending»: سرور و اولین رندر کلاینت؛ دکمه‌ها نامرئی ولی جایشان رزرو است (بدون پرش و hydration mismatch)
 * - «member»: وارد شده (یا اگر نشست هنوز در حال بازیابی است و نشانه‌ی نشست قبلی داریم)
 * - «guest»: بقیه
 */
export function useHomeAuth(): HomeAuth {
  const status = useAuthStore((s) => s.status);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return "pending";
  if (status === "authed") return "member";
  if (status === "anon") return "guest";
  return getSessionHint() ? "member" : "guest";
}

function Pending({ state, children }: { state: HomeAuth; children: ReactNode }) {
  return (
    <div className={state === "pending" ? "invisible" : undefined} aria-hidden={state === "pending" || undefined}>
      {children}
    </div>
  );
}

const arrow = "transition-transform group-hover:-translate-x-1";

/** دکمه‌های بخش اصلی (Hero). */
export function HeroActions() {
  const state = useHomeAuth();
  const member = state === "member";

  return (
    <Pending state={state}>
      <div className="mt-9 flex flex-col gap-3 sm:flex-row">
        <Link
          href={member ? "/dashboard/" : "/register/"}
          className="group glow-soft inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-linear-to-l from-primary to-primary-glow px-7 py-3 font-bold text-white hover:-translate-y-0.5"
        >
          {member ? "ورود به برنامه" : "ساخت حساب رایگان"}
          <ArrowLeft aria-hidden="true" className={`h-5 w-5 ${arrow}`} />
        </Link>

        <Link
          href={member ? "/dictionary/" : "/login/"}
          className="glass inline-flex min-h-14 items-center justify-center rounded-2xl px-7 py-3 font-bold hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary"
        >
          {member ? "واژه‌نامه" : "ورود به حساب"}
        </Link>
      </div>
    </Pending>
  );
}

/** دکمه‌های دعوت پایانی صفحه. */
export function FinalActions() {
  const state = useHomeAuth();
  const member = state === "member";

  return (
    <Pending state={state}>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href={member ? "/dashboard/" : "/register/"}
          className="group glow-soft inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-white hover:-translate-y-0.5 hover:bg-primary-hover"
        >
          {member ? "ورود به برنامه" : "مسیرت را شروع کن"}
          <ArrowLeft aria-hidden="true" className={`h-4 w-4 ${arrow}`} />
        </Link>

        {member ? null : (
          <Link
            href="/login/"
            className="glass inline-flex min-h-12 items-center justify-center rounded-xl px-6 py-3 font-bold hover:border-primary/50 hover:text-primary"
          >
            قبلاً ثبت‌نام کرده‌ام
          </Link>
        )}
      </div>
    </Pending>
  );
}

/** سمت چپ هدر: تم، ورود/ثبت‌نام یا «ورود به برنامه»، و منوی موبایل. */
export function HeaderActions() {
  const state = useHomeAuth();
  const member = state === "member";

  return (
    <div className="flex items-center gap-2">
      <ThemeToggle />

      <div className={`flex items-center gap-2 ${state === "pending" ? "invisible" : ""}`} aria-hidden={state === "pending" || undefined}>
        {member ? (
          <Link
            href="/dashboard/"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/25 hover:-translate-y-0.5 hover:bg-primary-hover"
          >
            ورود به برنامه
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          </Link>
        ) : (
          <>
            <Link href="/login/" className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-foreground/5 sm:inline-flex">
              ورود
            </Link>
            <Link
              href="/register/"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/25 hover:-translate-y-0.5 hover:bg-primary-hover"
            >
              <span className="sm:hidden">ثبت‌نام</span>
              <span className="hidden sm:inline">شروع یادگیری</span>
            </Link>
          </>
        )}
      </div>

      <SiteMobileNav
        links={[
          ...landingNavLinks,
          member ? { href: "/dashboard/", label: "ورود به برنامه" } : { href: "/login/", label: "ورود" },
        ]}
      />
    </div>
  );
}
