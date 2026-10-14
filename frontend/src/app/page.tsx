import CtaSection from "@/components/features/home/cta-section";
import FeaturesSection from "@/components/features/home/features-section";
import HeroSection from "@/components/features/home/hero-section";
import LevelsSection from "@/components/features/home/levels-section";
import StatsSection from "@/components/features/home/stats-section";
import SiteFooter from "@/components/layout/site-footer";
import SiteHeader from "@/components/layout/site-header";

export default function HomePage() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:right-4 focus:top-4 focus:z-[60] focus:rounded-xl focus:bg-primary focus:px-4 focus:py-2 focus:font-bold focus:text-white"
      >
        پرش به محتوای اصلی
      </a>

      <SiteHeader />

      {/* overflow-x-clip برخلاف overflow-hidden، هدر چسبان را خراب نمی‌کند */}
      <main id="main" className="relative overflow-x-clip text-foreground">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <LevelsSection />
        <CtaSection />
      </main>

      <SiteFooter />
    </>
  );
}
