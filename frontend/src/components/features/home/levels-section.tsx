import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Reveal from "@/components/ui/reveal";
import TiltCard from "@/components/ui/tilt-card";
import { learningLevels } from "./data";

export default function LevelsSection() {
  return (
    <section
      id="levels"
      className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28"
    >
      <Reveal className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold text-primary">مسیر یادگیری</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">از A1 تا B2</h2>
          <p className="mt-4 leading-8 text-muted">
            از سطح فعلی خودت شروع کن و قدم‌به‌قدم پیش برو.
          </p>
        </div>

        <Link
          href="/register/"
          className="glass group inline-flex w-fit items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold hover:border-primary/50 hover:text-primary"
        >
          ساخت حساب کاربری
          <ArrowLeft
            aria-hidden="true"
            className="h-4 w-4 transition-transform group-hover:-translate-x-1"
          />
        </Link>
      </Reveal>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {learningLevels.map((item, index) => (
          <li key={item.level}>
            <Reveal delay={index * 0.08} className="h-full">
              <TiltCard className="glass group rounded-2xl p-5 hover:border-primary/40">
                <div className="relative flex items-center justify-between">
                  <span className="gradient-text text-4xl font-black">
                    {item.level}
                  </span>
                  <span className="text-xs text-muted">سطح {index + 1}</span>
                </div>

                {/* نوار پیشرفت تزئینی: هر سطح یک پله بالاتر */}
                <div aria-hidden="true" className="relative mt-4 flex gap-1.5">
                  {learningLevels.map((_, step) => (
                    <span
                      key={step}
                      className={`h-1.5 flex-1 rounded-full ${
                        step <= index
                          ? "bg-linear-to-l from-primary to-secondary"
                          : "bg-border"
                      }`}
                    />
                  ))}
                </div>

                <h3 className="relative mt-4 font-extrabold">{item.title}</h3>
                <p className="relative mt-2 text-sm leading-7 text-muted">
                  {item.description}
                </p>
              </TiltCard>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
