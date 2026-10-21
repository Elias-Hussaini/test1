"use client";

import { useAuthStore } from "@/stores/auth-store";
import { useEffect } from "react";

/**
 * AuthProvider: نشست را در اولین بار از refresh token بازیابی می‌کند.
 *
 * باید در root layout قرار بگیرد تا در همه‌ی صفحات اجرا شود.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const restore = useAuthStore((s) => s.restore);

  useEffect(() => {
    restore();
  }, [restore]);

  return <>{children}</>;
}
