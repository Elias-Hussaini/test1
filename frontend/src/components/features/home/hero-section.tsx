import Reveal from "@/components/ui/reveal";
import { HeroActions } from "./auth-cta";
import HeroScene from "./hero-scene";

const avatars = [
  { letter: "م", bg: "linear-gradient(135deg,#8d6bff,#6f6bf8)" },
  { letter: "س", bg: "linear-gradient(135deg,#28c7e8,#5c86f5)" },
  { letter: "ن", bg: "linear-gradient(135deg,#f08fc0,#a78bfa)" },
  { letter: "ر", bg: "linear-gradient(135deg,#5c86f5,#8d6bff)" },
];

export default function HeroSection() {
  return (
    <section className="relative isolate">
      {/* پس‌زمینه‌ی سینمایی: کلیسای جامع کلن و رود راین، شبانگاه */}
      <div aria-hidden="true" className="lp-hero-bg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/koln-1024.webp"
          srcSet="/images/koln-640.webp 640w, /images/koln-1024.webp 1024w"
          sizes="100vw"
          alt=""
          width={1024}
          height={1536}
          fetchPriority="high"
        />
        <div className="lp-hero-veil" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-6 px-5 pb-20 pt-10 sm:px-8 sm:pb-28 lg:min-h-[44rem] lg:grid-cols-2 lg:gap-10 lg:pt-14">
        <div>
          <Reveal y={16}>
            <h1 className="max-w-xl text-4xl font-black leading-[1.55] tracking-tight sm:text-5xl lg:text-[3.4rem]">
              آلمانی را با LINGO،
              <span className="gradient-text mt-1 block">هوشمندانه یاد بگیر</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-9 text-foreground/75 sm:text-lg">
              با درس‌های تعاملی، دیکشنری هوشمند و مکالمه با هوش مصنوعی، هر روز
              یک قدم به تسلط بر زبان آلمانی نزدیک‌تر شو.
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <HeroActions />

            <div className="mt-9 flex items-center gap-4">
              <div aria-hidden="true" className="lp-avatars">
                {avatars.map((a) => (
                  <span key={a.letter} style={{ background: a.bg }}>
                    {a.letter}
                  </span>
                ))}
              </div>
              <p className="text-sm font-semibold text-foreground/70">
                مسیر یادگیری خودت را شروع کن
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.18} y={30}>
          <HeroScene />
        </Reveal>
      </div>
    </section>
  );
}
