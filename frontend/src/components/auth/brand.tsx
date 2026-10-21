/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";

/** لوگوی کامل LINGO (نماد + نوشته). تصویر شفاف و سبک (≈۴۷KB). */
export function BrandLogo({ className, width = 168 }: { className?: string; width?: number }) {
  return (
    <img
      src="/images/logo-full.webp"
      width={width}
      height={Math.round((width * 469) / 560)}
      alt="LINGO"
      decoding="async"
      className={cn("auth-logo mx-auto select-none", className)}
    />
  );
}

/** فقط نماد (دو برگ). */
export function BrandMark({ className, width = 72 }: { className?: string; width?: number }) {
  return (
    <img
      src="/images/logo-mark.webp"
      width={width}
      height={Math.round((width * 252) / 288)}
      alt=""
      aria-hidden="true"
      decoding="async"
      className={cn("auth-logo select-none", className)}
    />
  );
}
