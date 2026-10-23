"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { Bell, MailWarning, Search } from "lucide-react";
import FloatingGlassNav from "@/components/navigation/floating-glass-nav";
import ThemeToggle from "@/components/ui/theme-toggle";
import UserMenu from "@/components/app/user-menu";
import { titleFor } from "@/config/app-nav";
import { useAuthStore } from "@/stores/auth-store";

function Splash() {
  return (
    <div className="flex min-h-dvh items-center justify-center" role="status" aria-live="polite">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/logo-mark.webp" alt="" width={72} height={63} className="auth-logo animate-pulse" />
      <span className="sr-only">در حال بارگذاری…</span>
    </div>
  );
}

/**
 * پوسته‌ی اپ پس از ورود: هدر بالا + محتوای مرکزی + کپسول شیشه‌ای شناور.
 * محافظت از مسیر در کلاینت است (خروجی استاتیک)؛ امنیت واقعی داده‌ها را بک‌اند تضمین می‌کند.
 */
export default function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const status = useAuthStore((s) => s.status);
  const needsVerification = useAuthStore((s) => s.needsEmailVerification);

  useEffect(() => {
    if (status === "anon") router.replace(`/login/?next=${encodeURIComponent(pathname)}`);
  }, [status, pathname, router]);

  if (status !== "authed") return <Splash />;

  return (
    <div className="app-bg min-h-dvh">
      <header className="app-header">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-3 px-4 sm:px-6">
          <Link href="/dashboard/" aria-label="خانه LINGO" className="flex shrink-0 items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo-mark.webp" alt="" width={36} height={31} className="auth-logo" />
            <span className="hidden text-lg font-black tracking-tight sm:block">LINGO</span>
          </Link>

          <p className="min-w-0 flex-1 truncate text-sm font-bold text-muted sm:ms-2">{titleFor(pathname)}</p>

          <Link
            href="/dictionary/"
            className="hidden h-10 w-56 items-center gap-2 rounded-full border border-border bg-surface-2/70 px-4 text-sm text-muted hover:border-primary/40 md:flex"
          >
            <Search aria-hidden="true" className="h-4 w-4" />
            جستجوی واژه…
          </Link>
          <Link
            href="/dictionary/"
            aria-label="جستجو در دیکشنری"
            className="icon-btn md:hidden"
          >
            <Search aria-hidden="true" className="h-[18px] w-[18px]" />
          </Link>
          <Link href="/notifications/" aria-label="اعلان‌ها" className="icon-btn">
            <Bell aria-hidden="true" className="h-[18px] w-[18px]" />
          </Link>
          <ThemeToggle />
          <UserMenu />
        </div>
      </header>

      {needsVerification ? (
        <div className="mx-auto mt-3 max-w-5xl px-4 sm:px-6">
          <Link
            href="/verify-email/"
            className="flex items-center gap-3 rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-semibold hover:bg-primary/15"
          >
            <MailWarning aria-hidden="true" className="h-5 w-5 shrink-0 text-primary" />
            ایمیلت هنوز تأیید نشده؛ برای تأیید با کد یک‌بارمصرف اینجا را بزن.
          </Link>
        </div>
      ) : null}

      <main id="main" className="mx-auto w-full max-w-5xl px-4 pb-[calc(8.5rem+env(safe-area-inset-bottom))] pt-5 sm:px-6 sm:pt-8">
        {children}
      </main>

      <FloatingGlassNav />
    </div>
  );
}
