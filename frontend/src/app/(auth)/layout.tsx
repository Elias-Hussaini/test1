"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Sparkles, BookOpen, Brain, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const features = [
  {
    title: "واژه‌نامه هوشمند",
    description: "واژگان آلمانی را با ترجمه، تلفظ و مثال واقعی یاد بگیر",
    Icon: BookOpen,
  },
  {
    title: "معلم هوش مصنوعی",
    description: "هر زمان سؤالی داشتی، با هوش مصنوعی مکالمه کن",
    Icon: Brain,
  },
  {
    title: "یادگیری با دوستان",
    description: "با دوستانت واژه‌ها و پیشرفتت را به اشتراک بگذار",
    Icon: Users,
  },
];

const stats = [
  { value: "۴ سطح", label: "از A1 تا B2" },
  { value: "۳ آرتیکل", label: "der, die, das" },
  { value: "۴ حالت", label: "دستوری آلمانی" },
];

/**
 * Auth Layout — Lumora-inspired dark glassmorphism
 */
export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  const isLogin = pathname?.includes("/login");
  const isRegister = pathname?.includes("/register");
  const isForgot = pathname?.includes("/forgot-password");
  const isVerify = pathname?.includes("/verify-email");

  let title = "به LINGO خوش آمدید";
  let subtitle = "مسیر یادگیری هوشمند زبان آلمانی را آغاز کن";
  if (isRegister) {
    title = "همراه LINGO یاد بگیر";
    subtitle = "حساب کاربری بساز و اولین واژه را همین امروز یاد بگیر";
  } else if (isVerify) {
    title = "تأیید ایمیل";
    subtitle = "برای امنیت حساب، ایمیل خود را تأیید کن";
  } else if (isForgot) {
    title = "بازیابی رمز عبور";
    subtitle = "کد تأیید برایت ارسال می‌کنیم";
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      {/* پس‌زمینه‌ی زینتی — orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="aurora fade-bottom absolute inset-0 opacity-60 dark:opacity-100" />
        <span className="orb orb-a" />
        <span className="orb orb-b" />
        <span className="orb orb-c" />
        <span className="orb orb-d" />

        {/* Grid pattern — subtle */}
        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Header — لوگو */}
      <header className="relative z-10 px-5 py-5 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            href="/"
            aria-label="صفحه اصلی LINGO"
            className="group flex items-center gap-3"
          >
            <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary-glow to-secondary text-xl font-black text-white shadow-lg shadow-primary/30 transition-transform group-hover:scale-105">
              L
              <span
                aria-hidden="true"
                className="absolute -bottom-1 -left-1 h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-background"
              />
            </span>
            <span>
              <span className="block text-xl font-black tracking-tight">
                LINGO
              </span>
              <span className="block text-[10px] text-muted">
                یادگیری هوشمند زبان
              </span>
            </span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-primary"
          >
            <ArrowRight className="h-4 w-4" />
            بازگشت به خانه
          </Link>
        </div>
      </header>

      {/* Main — دو ستونه در دسکتاپ */}
      <main className="relative z-10 flex flex-1 items-stretch justify-center px-4 pb-8 sm:px-6 lg:px-8">
        <div className="grid w-full max-w-6xl grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Left side — برندینگ (فقط دسکتاپ) */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex lg:flex-col"
          >
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {title}
            </div>

            <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight xl:text-5xl">
              {subtitle}
            </h1>

            <p className="mt-5 max-w-md text-base leading-9 text-muted">
              یادگیری زبان آلمانی نباید سخت باشد. LINGO با واژگان هوشمند، تمرین‌های
              تعاملی و معلم هوش مصنوعی، مسیر یادگیری را برایت هموار می‌کند.
            </p>

            <ul className="mt-10 grid gap-4">
              {features.map((f) => (
                <li key={f.title} className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl glass text-primary">
                    <f.Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-bold">{f.title}</p>
                    <p className="text-sm text-muted">{f.description}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex items-center gap-8">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-3xl font-black gradient-text-purple">
                    {s.value}
                  </p>
                  <p className="text-xs text-muted">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Right side — فرم */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center lg:justify-start"
          >
            <div className="w-full max-w-md">{children}</div>
          </motion.section>
        </div>
      </main>
    </div>
  );
}
