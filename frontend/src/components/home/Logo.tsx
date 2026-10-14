import Link from "next/link";

type LogoProps = {
  /** نمایش زیرنویس «یادگیری هوشمند زبان» */
  tagline?: boolean;
  size?: "md" | "sm";
};

export default function Logo({ tagline = true, size = "md" }: LogoProps) {
  const mark =
    size === "md"
      ? "h-11 w-11 rounded-2xl text-xl"
      : "h-8 w-8 rounded-xl text-sm";

  return (
    <Link
      href="/"
      aria-label="صفحه اصلی LINGO"
      className="group flex shrink-0 items-center gap-3"
    >
      <span
        className={`relative flex items-center justify-center bg-linear-to-br from-primary via-primary-glow to-secondary font-black text-white shadow-lg shadow-primary/30 transition-transform group-hover:scale-105 ${mark}`}
      >
        L
        <span
          aria-hidden="true"
          className="absolute -bottom-1 -left-1 h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-background"
        />
      </span>

      <span>
        <span
          className={`block font-black tracking-tight ${size === "md" ? "text-xl" : "text-base"}`}
        >
          LINGO
        </span>
        {tagline ? (
          <span className="block text-xs text-muted">یادگیری هوشمند زبان</span>
        ) : null}
      </span>
    </Link>
  );
}
