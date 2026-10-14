import Link from "next/link";
import Logo from "@/components/ui/logo";
import ThemeToggle from "@/components/ui/theme-toggle";
import { landingNavLinks } from "@/config/landing";
import SiteMobileNav from "./site-mobile-nav";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[4.5rem] max-w-7xl items-center justify-between gap-3 px-4 sm:px-8">
        <Logo />

        <nav
          aria-label="ناوبری اصلی"
          className="hidden items-center gap-8 text-sm font-medium text-muted md:flex"
        >
          {landingNavLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-primary">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <Link
            href="/login/"
            className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-foreground/5 sm:inline-flex"
          >
            ورود
          </Link>

          <Link
            href="/register/"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/25 hover:-translate-y-0.5 hover:bg-primary-hover"
          >
            <span className="sm:hidden">ثبت‌نام</span>
            <span className="hidden sm:inline">شروع یادگیری</span>
          </Link>

          <SiteMobileNav
            links={[...landingNavLinks, { href: "/login/", label: "ورود" }]}
          />
        </div>
      </div>
    </header>
  );
}
