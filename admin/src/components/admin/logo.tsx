"use client";

import Link from "next/link";

type LogoProps = {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  className?: string;
};

export function Logo({ size = "md", showTagline = false, className = "" }: LogoProps) {
  const mark =
    size === "lg"
      ? "h-12 w-12 rounded-2xl text-2xl"
      : size === "sm"
        ? "h-8 w-8 rounded-lg text-sm"
        : "h-10 w-10 rounded-xl text-lg";

  return (
    <Link
      href="/"
      aria-label="صفحه اصلی LINGO Admin"
      className={`group flex shrink-0 items-center gap-3 ${className}`}
    >
      <span
        className={`relative flex items-center justify-center font-black text-white shadow-lg shadow-primary/30 transition-transform group-hover:scale-105 ${mark}`}
        style={{
          backgroundImage: "linear-gradient(135deg, var(--primary), var(--secondary-c))",
        }}
      >
        L
      </span>
      {showTagline && (
        <span className="leading-tight">
          <span className={`block font-black tracking-tight ${size === "lg" ? "text-2xl" : "text-lg"}`}>
            LINGO
          </span>
          <span className="block text-[10px] text-muted-foreground">پنل مدیریت</span>
        </span>
      )}
    </Link>
  );
}

export default Logo;
