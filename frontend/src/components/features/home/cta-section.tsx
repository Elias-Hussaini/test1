import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Reveal from "@/components/ui/reveal";

/** بخش «درباره ما» و دعوت نهایی به شروع یادگیری (هدف لینک #about). */
export default function CtaSection() {
  return (
    <section id="about" className="relative z-10 px-5 pb-20 sm:px-8 sm:pb-28">
      <Reveal>
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-primary/30 bg-linear-to-l from-primary/25 via-primary/10 to-secondary/20 p-8 sm:p-12 lg:p-16">
          <div
            aria-hidden="true"
            className="aurora pointer-events-none absolute inset-0 opacity-70"
          />

          <div className="relative max-w-3xl">
            <p className="text-sm font-bold text-primary">یادگیری با برنامه</p>
            <h2 className="mt-3 text-3xl font-black leading-relaxed sm:text-4xl">
              زبان جدید، فرصت‌های جدید.
            </h2>
            <p className="mt-4 leading-8 text-muted">
              LINGO برای ساختن یک تجربهٔ یادگیری یکپارچه طراحی می‌شود؛ جایی
              برای مدیریت واژگان، تمرین مهارت‌ها و استفاده از ابزارهای هوشمند
              در مسیر یادگیری آلمانی.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register/"
                className="group glow-soft inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-white hover:-translate-y-0.5 hover:bg-primary-hover"
              >
                مسیرت را شروع کن
                <ArrowLeft
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform group-hover:-translate-x-1"
                />
              </Link>

              <Link
                href="/login/"
                className="glass inline-flex min-h-12 items-center justify-center rounded-xl px-6 py-3 font-bold hover:border-primary/50 hover:text-primary"
              >
                قبلاً ثبت‌نام کرده‌ام
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
