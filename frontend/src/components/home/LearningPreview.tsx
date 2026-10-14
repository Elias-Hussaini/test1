import { BookOpen, Sparkles, Target, Volume2 } from "lucide-react";
import ArticleQuiz from "./ArticleQuiz";
import TiltCard from "./TiltCard";

/** پیش‌نمایش یادگیری: کارت شیشه‌ای با عمق سه‌بعدی و Tilt. */
export default function LearningPreview() {
  return (
    <div className="relative mx-auto w-full max-w-lg">
      <TiltCard className="rounded-[2rem]" max={8} scale={1.015}>
        {/* هاله‌ی پشت کارت (عمق منفی) */}
        <div
          aria-hidden="true"
          className="absolute inset-5 rounded-[2rem] bg-linear-to-br from-primary/35 to-secondary/30 blur-2xl [transform:translateZ(-60px)]"
        />

        <div className="glass relative rounded-[2rem] p-5 sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-muted">پیشنهاد امروز</p>
              <h2 className="mt-1 text-lg font-extrabold">یک قدم به جلو</h2>
            </div>

            <span
              lang="de"
              className="rounded-xl bg-primary/10 px-3 py-2 text-sm font-bold text-primary"
            >
              Deutsch
            </span>
          </div>

          {/* واژه‌ی آلمانی */}
          <div className="mt-6 rounded-2xl border border-border/70 bg-background/70 p-6 text-center">
            <span className="text-sm text-muted">واژه آلمانی</span>

            <p
              lang="de"
              dir="ltr"
              className="mt-3 text-4xl font-black tracking-tight"
            >
              <span className="text-accent">die</span> Sprache
            </p>

            <p className="mt-3 text-lg font-semibold">زبان</p>

            <div
              dir="ltr"
              className="mt-2 flex items-center justify-center gap-2 text-sm text-muted"
            >
              <Volume2 aria-hidden="true" className="h-4 w-4 text-secondary" />
              <span>/ˈʃpʁaːxə/</span>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-semibold text-accent">
                اسم · مؤنث
              </span>
              <span className="rounded-full border border-border bg-background/60 px-3 py-1 font-semibold text-muted">
                A1
              </span>
            </div>
          </div>

          {/* کارت‌های کوچک */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/15 text-secondary">
                <BookOpen aria-hidden="true" className="h-5 w-5" />
              </span>
              <p className="mt-3 font-bold">واژگان</p>
              <p className="mt-1 text-xs leading-6 text-muted">
                یادگیری کلمات جدید
              </p>
              <p
                lang="de"
                dir="ltr"
                className="mt-2 text-start text-xs font-semibold"
              >
                das Buch <span className="text-muted">·</span>{" "}
                <span dir="rtl" lang="fa" className="text-muted">
                  کتاب
                </span>
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <Target aria-hidden="true" className="h-5 w-5" />
              </span>
              <p className="mt-3 font-bold">تمرین روزانه</p>
              <p className="mt-1 text-xs leading-6 text-muted">
                پیشرفت با تمرین
              </p>
            </div>
          </div>

          {/* تمرین تعاملی */}
          <div className="mt-4 rounded-2xl border border-border/70 bg-background/60 p-4">
            <ArticleQuiz />
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-2xl bg-primary/5 p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles aria-hidden="true" className="h-5 w-5" />
            </span>
            <div>
              <p className="font-bold">هر روز کمی بهتر</p>
              <p className="mt-1 text-xs leading-6 text-muted">
                پیوستگی، کلید یادگیری یک زبان جدید است.
              </p>
            </div>
          </div>
        </div>

        {/* نشان‌های شناور؛ با translateZ جلوتر از کارت قرار می‌گیرند (پارالاکس واقعی هنگام Tilt) */}
        <div
          aria-hidden="true"
          className="absolute -left-4 top-12 hidden [transform:translateZ(80px)] sm:block"
        >
          <div className="animate-float rounded-2xl border border-border bg-background/90 p-3 shadow-xl backdrop-blur-xl">
            <span lang="de" className="text-sm font-bold">
              Hallo!
            </span>
            <p className="mt-1 text-xs text-muted">سلام!</p>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="absolute -right-4 bottom-16 hidden [transform:translateZ(70px)] sm:block"
        >
          <div className="animate-float rounded-2xl border border-border bg-background/90 p-3 shadow-xl backdrop-blur-xl [animation-delay:-3s]">
            <span lang="de" className="text-sm font-bold">
              Weiter so!
            </span>
            <p className="mt-1 text-xs text-muted">همین‌طور ادامه بده!</p>
          </div>
        </div>
      </TiltCard>
    </div>
  );
}
