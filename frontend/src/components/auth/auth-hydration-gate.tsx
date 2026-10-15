"use client";

import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "@/stores/auth-store";

/**
 * AuthHydrationGate — جلوی خطای hydration mismatch رو می‌گیره.
 *
 * zustand persist با skipHydration=true اول render server رو نشون می‌ده
 * و بعد از mount شدن، state از localStorage خوانده می‌شه.
 *
 * این component فقط در client اجرا می‌شه و rehydrate رو صدا می‌زنه.
 */
export function AuthHydrationGate({ children }: { children: ReactNode }) {
  useEffect(() => {
    // فقط در کلاینت
    useAuthStore.persist.rehydrate();
  }, []);

  return <>{children}</>;
}
