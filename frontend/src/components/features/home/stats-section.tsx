import AnimatedCounter from "@/components/ui/animated-counter";
import Reveal from "@/components/ui/reveal";
import { stats } from "./data";

export default function StatsSection() {
  return (
    <section
      aria-label="LINGO در یک نگاه"
      className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8"
    >
      <Reveal>
        <dl className="glass grid grid-cols-2 gap-px overflow-hidden p-0 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-background/40 px-5 py-6 text-center sm:py-8"
            >
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="gradient-text block text-4xl font-black sm:text-5xl">
                  <AnimatedCounter to={stat.value} />
                </span>
                <span className="mt-2 block font-extrabold">{stat.label}</span>
                <span className="mt-1 block text-xs leading-6 text-muted">
                  {stat.hint}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
