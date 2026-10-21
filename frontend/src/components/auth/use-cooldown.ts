"use client";

import { useCallback, useEffect, useState } from "react";

/** شمارنده‌ی معکوس (ثانیه) برای «ارسال دوباره‌ی کد». */
export function useCooldown(initial = 0) {
  const [seconds, setSeconds] = useState(initial);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds]);

  const start = useCallback((value: number) => setSeconds(Math.max(0, Math.ceil(value))), []);
  return { seconds, start };
}

const faDigits = new Intl.NumberFormat("fa-IR", { minimumIntegerDigits: 2, useGrouping: false });

/** ۴۵ → «۰۰:۴۵» */
export function formatCountdown(total: number): string {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${faDigits.format(m)}:${faDigits.format(s)}`;
}
