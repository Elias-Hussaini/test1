/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

type LogoProps = {
  /** نمایش زیرنویس «یادگیری هوشمند زبان» */
  tagline?: boolean;
  size?: "md" | "sm";
};

/** لوگوی LINGO با نماد اصلی برند (دو برگ شیشه‌ای). */
export default function Logo({ tagline = true, size = "md" }: LogoProps) {
  const width = size === "md" ? 48 : 34;

  return (
    <Link href="/" aria-label="صفحه اصلی LINGO" className="group flex shrink-0 items-center gap-3">
      <img
        src="/images/logo-mark.webp"
        width={width}
        height={Math.round((width * 252) / 288)}
        alt=""
        aria-hidden="true"
        decoding="async"
        className="auth-logo transition-transform group-hover:scale-105"
      />

      <span>
        <span className={`block font-black tracking-tight ${size === "md" ? "text-xl" : "text-base"}`}>LINGO</span>
        {tagline ? <span className="block text-xs text-muted">یادگیری هوشمند زبان</span> : null}
      </span>
    </Link>
  );
}
