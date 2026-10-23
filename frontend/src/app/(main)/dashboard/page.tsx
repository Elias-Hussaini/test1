"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Bot, Flame, GraduationCap, Layers, Medal, Target, Trophy } from "lucide-react";
import { Card, ErrorState, Skeleton } from "@/components/app/ui";
import FeatureCard from "@/components/app/feature-card";
import { useApi } from "@/hooks/use-api";
import { authApi, vocabularyApi } from "@/lib/api";
import { featureById } from "@/config/features";
import { levels } from "@/config/levels";
import { cn } from "@/lib/utils";

const GOAL_KEY = "lingo-daily-goal";
const goalOptions = [5, 10, 20, 30];
const fa = (n: number) => n.toLocaleString("fa-IR");

function greeting(): string {
  const h = new Date().getHours();
  if (h < 5) return "شب بخیر";
  if (h < 12) return "صبح بخیر";
  if (h < 17) return "ظهر بخیر";
  if (h < 20) return "عصر بخیر";
  return "شب بخیر";
}

function Stat({ Icon, label, value, tone }: { Icon: typeof Flame; label: string; value: string; tone: string }) {
  return (
    <div className="app-card flex items-center gap-3 p-4">
      <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl", tone)}>
        <Icon aria-hidden="true" className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-xl font-black leading-tight">{value}</p>
        <p className="truncate text-xs text-muted">{label}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const me = useApi((s) => authApi.me(s));
  const stats = useApi((s) => vocabularyApi.stats(s));

  // هدف روزانه فقط ترجیح کاربر است و در همین مرورگر ذخیره می‌شود (پیگیری پیشرفت روزانه بعداً از بک‌اند می‌آید)
  const [goal, setGoal] = useState(10);
  const [hello, setHello] = useState("سلام");
  useEffect(() => {
    setHello(greeting());
    try {
      const saved = Number(localStorage.getItem(GOAL_KEY));
      if (goalOptions.includes(saved)) setGoal(saved);
    } catch {}
  }, []);
  const pickGoal = (n: number) => {
    setGoal(n);
    try {
      localStorage.setItem(GOAL_KEY, String(n));
    } catch {}
  };

  if (me.error && !me.data) return <ErrorState message={me.error} onRetry={() => { me.reload(); stats.reload(); }} />;

  const profile = me.data?.profile;
  const name = profile?.firstName || me.data?.username;
  const level = profile?.level ?? "A1";
  const levelIndex = Math.max(0, levels.findIndex((l) => l.id === level));
  const s = stats.data;
  const toReview = s ? s.learning + s.unknown : 0;

  return (
    <div className="space-y-6">
      {/* خوش‌آمد + ادامه‌ی یادگیری */}
      <section className="relative overflow-hidden rounded-[22px] bg-linear-to-br from-[#8d6bff] via-[#6f6bf8] to-[#5c86f5] p-6 text-white shadow-xl shadow-primary/25 sm:p-8">
        <div aria-hidden="true" className="pointer-events-none absolute -start-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          {me.loading ? (
            <Skeleton className="h-8 w-48 bg-white/20" />
          ) : (
            <p className="text-sm font-semibold text-white/80">
              {hello}، {name}
            </p>
          )}
          <h1 className="mt-1 text-2xl font-black leading-snug sm:text-3xl">
            {toReview > 0 ? `${fa(toReview)} واژه منتظر مرور توست` : "امروز چه چیزی یاد می‌گیری؟"}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-7 text-white/85">
            {toReview > 0
              ? "چند دقیقه مرور با فلش‌کارت، یادگیری را ماندگار می‌کند."
              : "اولین واژه‌ات را در دیکشنری پیدا کن و ذخیره کن؛ مرور از همان‌جا شروع می‌شود."}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href={toReview > 0 ? "/vocabulary/" : "/dictionary/"}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-extrabold text-[#5b4fe0] shadow-lg active:scale-95"
            >
              {toReview > 0 ? "شروع مرور" : "رفتن به دیکشنری"}
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            </Link>
            <Link href="/learn/" className="inline-flex min-h-11 items-center rounded-full bg-white/15 px-5 text-sm font-bold backdrop-blur hover:bg-white/25">
              مسیر یادگیری
            </Link>
          </div>
        </div>
      </section>

      {/* آمار واقعی */}
      <section aria-label="پیشرفت" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {me.loading || stats.loading ? (
          Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-[76px]" />)
        ) : (
          <>
            <Stat Icon={Flame} label="روز پیاپی" value={fa(profile?.streak ?? 0)} tone="bg-danger/15 text-danger" />
            <Stat Icon={Trophy} label="امتیاز تجربه (XP)" value={fa(profile?.xp ?? 0)} tone="bg-accent/20 text-accent" />
            <Stat Icon={Layers} label="واژه‌ی ذخیره‌شده" value={fa(s?.total ?? 0)} tone="bg-secondary/15 text-secondary" />
            <Stat Icon={Medal} label="واژه‌ی یادگرفته‌شده" value={fa(s?.learned ?? 0)} tone="bg-success/15 text-success" />
          </>
        )}
      </section>
      {stats.error && !stats.loading ? (
        <p role="alert" className="text-sm text-danger">
          آمار واژگان بارگذاری نشد. <button className="font-bold underline" onClick={stats.reload}>تلاش دوباره</button>
        </p>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        {/* سطح */}
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold">سطح و مسیر</h2>
            <Link href="/learn/" className="text-sm font-bold text-primary">همه‌ی سطح‌ها</Link>
          </div>
          <ol className="mt-4 flex items-center gap-2" aria-label="سطح‌های زبان">
            {levels.map((l, i) => (
              <li key={l.id} className="flex flex-1 flex-col items-center gap-2">
                <span
                  dir="ltr"
                  aria-current={i === levelIndex ? "step" : undefined}
                  className={cn(
                    "flex h-11 w-full items-center justify-center rounded-xl text-sm font-black",
                    i === levelIndex ? "bg-linear-to-br from-primary to-secondary text-white shadow-md shadow-primary/30" : i < levelIndex ? "bg-success/15 text-success" : "bg-foreground/[0.06] text-muted",
                  )}
                >
                  {l.id}
                </span>
                <span className="text-[11px] text-muted">{i === levelIndex ? "سطح تو" : i < levelIndex ? "گذشته" : ""}</span>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-sm leading-7 text-muted">{levels[levelIndex].description}</p>
        </Card>

        {/* هدف روزانه */}
        <Card>
          <h2 className="flex items-center gap-2 font-extrabold">
            <Target aria-hidden="true" className="h-5 w-5 text-primary" /> هدف روزانه
          </h2>
          <p className="mt-2 text-sm leading-7 text-muted">هر روز چند واژه می‌خواهی یاد بگیری؟</p>
          <div role="radiogroup" aria-label="هدف روزانه" className="mt-3 flex flex-wrap gap-2">
            {goalOptions.map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={goal === n}
                onClick={() => pickGoal(n)}
                className={cn(
                  "min-h-11 min-w-16 rounded-full border px-4 text-sm font-bold transition-colors",
                  goal === n ? "border-primary bg-primary text-white" : "border-border hover:border-primary/50",
                )}
              >
                {fa(n)} واژه
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs leading-6 text-muted">
            هدف در همین دستگاه ذخیره می‌شود. نمایش پیشرفت روزانه بعد از اتصال ثبت فعالیت اضافه می‌شود.
          </p>
        </Card>
      </div>

      {/* دسترسی سریع */}
      <section aria-labelledby="quick">
        <h2 id="quick" className="mb-3 font-extrabold">دسترسی سریع</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {(["dictionary", "vocabulary", "ai-tutor", "exercises"] as const).map((id) => (
            <FeatureCard key={id} feature={featureById(id)} compact />
          ))}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="flex items-center gap-2 font-extrabold">
            <GraduationCap aria-hidden="true" className="h-5 w-5 text-primary" /> فعالیت اخیر
          </h2>
          <p className="mt-3 rounded-2xl bg-foreground/[0.04] p-4 text-sm leading-7 text-muted">
            هنوز فعالیتی ثبت نشده. با ذخیره‌ی واژه‌ها از دیکشنری و مرور آن‌ها، اینجا پر می‌شود.
          </p>
        </Card>
        <Card>
          <h2 className="flex items-center gap-2 font-extrabold">
            <Bot aria-hidden="true" className="h-5 w-5 text-primary" /> گفتگوها و کلاس‌ها
          </h2>
          <p className="mt-3 rounded-2xl bg-foreground/[0.04] p-4 text-sm leading-7 text-muted">
            گفتگو و کلاس آنلاین به‌زودی فعال می‌شوند.{" "}
            <Link href="/communications/" className="font-bold text-primary">دیدن ارتباطات</Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
