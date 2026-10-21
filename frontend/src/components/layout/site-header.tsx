import Link from "next/link";
import Logo from "@/components/ui/logo";
import { landingNavLinks } from "@/config/landing";
import { HeaderActions } from "@/components/features/home/auth-cta";

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

        <HeaderActions />
      </div>
    </header>
  );
}
