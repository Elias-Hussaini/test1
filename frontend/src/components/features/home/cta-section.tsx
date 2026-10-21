import Reveal from "@/components/ui/reveal";
import { FinalActions } from "./auth-cta";

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

            <FinalActions />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
