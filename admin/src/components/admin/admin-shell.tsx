"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { UNAUTHORIZED_EVENT } from "@/lib/api";
import { useSession } from "@/lib/session-store";
import { AdminSidebar } from "./admin-sidebar";
import { AdminTopBar } from "./admin-topbar";
import { Logo } from "./logo";

/**
 * گارد سمت کلاینت + قاب پنل.
 * (اپ با `next build` ساخته می‌شود و middleware سرور نداریم؛ امنیت واقعی همیشه با بک‌اند است
 *  و هر endpoint ادمین نقش را سرور-ساید چک می‌کند. این گارد فقط تجربه‌ی کاربری است.)
 */
export function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const status = useSession((s) => s.status);
  const restore = useSession((s) => s.restore);
  const expire = useSession((s) => s.expire);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    void restore();
  }, [restore]);

  useEffect(() => {
    window.addEventListener(UNAUTHORIZED_EVENT, expire);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, expire);
  }, [expire]);

  useEffect(() => {
    if (status === "anon") {
      const next = pathname && pathname !== "/" ? `?next=${encodeURIComponent(pathname)}` : "";
      router.replace(`/login${next}`);
    }
  }, [status, pathname, router]);

  useEffect(() => setMenuOpen(false), [pathname]);

  if (status !== "authed") {
    return (
      <div className="flex min-h-screen items-center justify-center" role="status" aria-live="polite">
        <div className="flex flex-col items-center gap-4">
          <Logo size="lg" />
          <p className="text-sm text-muted-foreground">در حال بررسی نشست…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopBar onOpenMenu={() => setMenuOpen(true)} />
        <main className="flex-1 p-4 sm:p-6">
          <div className="mx-auto max-w-7xl animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
}
