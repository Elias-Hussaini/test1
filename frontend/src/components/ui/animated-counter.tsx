"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { EASE_OUT, prefersReducedMotion } from "@/lib/motion";

type AnimatedCounterProps = {
  /** مقدار نهایی (باید عدد واقعی باشد، نه آمار ساختگی) */
  to: number;
  /** مدت انیمیشن به ثانیه */
  duration?: number;
  className?: string;
};

const formatter = new Intl.NumberFormat("fa-IR");

export default function AnimatedCounter({
  to,
  duration = 1.6,
  className = "",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });

  // مقدار اولیه = مقدار نهایی: بدون جاوااسکریپت یا با حرکت کم، عدد درست دیده می‌شود
  // و HTML سرور با کلاینت یکسان است.
  const [value, setValue] = useState(to);

  // آماده‌سازی انیمیشن: فقط وقتی حرکت مجاز است، از صفر شروع می‌کنیم.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    setValue(0);
  }, []);

  useEffect(() => {
    if (!inView || prefersReducedMotion()) return;
    const controls = animate(0, to, {
      duration,
      ease: EASE_OUT,
      onUpdate: (latest) => setValue(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, to, duration]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {formatter.format(value)}
    </span>
  );
}
