import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Reveal from "@/components/ui/reveal";
import TiltCard from "@/components/ui/tilt-card";
import { features } from "./data";

export default function FeaturesSection() {
  return (
    <section id="features" className="relative z-10 mt-20 sm:mt-28">
      <div className="mx-auto max-w-7xl px-5 py-4 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold text-primary">امکانات LINGO</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">
            همه‌چیز برای یادگیری بهتر
          </h2>
          <p className="mt-4 leading-8 text-muted">
            ابزارهایی که کنار هم قرار گرفته‌اند تا یادگیری زبان آلمانی
            ساده‌تر، منظم‌تر و مؤثرتر شود.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Reveal key={feature.number} delay={index * 0.08} className="h-full">
              <TiltCard
                className={`glass group rounded-3xl bg-linear-to-br ${feature.washClass} to-transparent p-6 focus-within:border-primary/60 ${feature.hoverClass}`}
              >
                <article className="flex h-full flex-col">
                  <div className="relative flex items-center justify-between">
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${feature.iconClass} transition-transform group-hover:scale-110`}
                    >
                      <feature.Icon aria-hidden="true" className="h-6 w-6" />
                    </span>
                    <span className="text-xs font-bold text-muted">
                      {feature.number}
                    </span>
                  </div>

                  <h3 className="relative mt-6 text-lg font-extrabold">
                    {feature.title}
                  </h3>

                  <p className="relative mt-3 flex-1 text-sm leading-7 text-muted">
                    {feature.description}
                  </p>

                  {/* after: کل کارت را قابل‌کلیک می‌کند (نزدیک‌ترین عنصر position دار = خود کارت)، در حالی که یک لینک واحد برای دسترس‌پذیری داریم */}
                  <Link
                    href={feature.href}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary after:absolute after:inset-0 after:rounded-3xl after:content-['']"
                  >
                    مشاهده بخش
                    <ArrowLeft
                      aria-hidden="true"
                      className="h-4 w-4 transition-transform group-hover:-translate-x-1"
                    />
                  </Link>
                </article>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
