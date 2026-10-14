import Link from "next/link";
import { ArrowLeft, Check, Sparkles } from "lucide-react";
import Orbs from "@/components/ui/orbs";
import Reveal from "@/components/ui/reveal";
import Typewriter from "@/components/ui/typewriter";
import { germanPhrases } from "./data";
import LearningPreview from "./learning-preview";

export default function HeroSection() {
  return (
    <section className="relative">
      <div
        aria-hidden="true"
        className="aurora fade-bottom pointer-events-none absolute inset-0 opacity-60 dark:opacity-100"
      />
      <Orbs className="fade-bottom" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-14 sm:px-8 sm:pb-28 sm:pt-20 lg:grid-cols-2 lg:gap-20">
        <div>
          <Reveal y={16}>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles aria-hidden="true" className="h-4 w-4" />
              مسیر تو برای یادگیری آلمانی
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="max-w-2xl text-4xl font-black leading-[1.5] tracking-tight sm:text-5xl lg:text-6xl">
              آلمانی را یاد بگیر،
              <span className="gradient-text mt-1 block">با روش خودت.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="text-sm text-muted">جمله‌ی امروز:</span>
              <div className="glass min-h-12 rounded-xl px-4 py-2.5 text-lg font-bold text-primary">
                <Typewriter phrases={germanPhrases} />
              </div>
            </div>

            <p className="mt-6 max-w-xl text-base leading-9 text-muted sm:text-lg">
              از اولین واژه تا مکالمه‌های پیشرفته؛ واژگان، تمرین‌های تعاملی و
              ابزارهای هوشمند را در یک فضای یادگیری منظم و زیبا تجربه کن.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register/"
                className="group glow-soft inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-linear-to-l from-primary to-primary-glow px-7 py-3 font-bold text-white hover:-translate-y-0.5"
              >
                شروع رایگان
                <ArrowLeft
                  aria-hidden="true"
                  className="h-5 w-5 transition-transform group-hover:-translate-x-1"
                />
              </Link>

              <Link
                href="/dictionary/"
                className="glass inline-flex min-h-14 items-center justify-center rounded-2xl px-7 py-3 font-bold hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary"
              >
                گشت‌وگذار در واژه‌نامه
              </Link>
            </div>

            <ul className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted">
              <li className="flex items-center gap-2">
                <Check aria-hidden="true" className="h-4 w-4 text-success" />
                مناسب سطوح A1 تا B2
              </li>
              <li className="flex items-center gap-2">
                <Check aria-hidden="true" className="h-4 w-4 text-success" />
                طراحی فارسی و راست‌چین
              </li>
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.2} y={40}>
          <LearningPreview />
        </Reveal>
      </div>
    </section>
  );
}
