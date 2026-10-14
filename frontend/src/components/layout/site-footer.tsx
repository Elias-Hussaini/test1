import Link from "next/link";
import Logo from "@/components/ui/logo";
import { landingNavLinks } from "@/config/landing";

export default function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-border/60 bg-background/50 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 text-sm text-muted sm:px-8 md:flex-row md:items-center md:justify-between">
        <Logo size="sm" tagline={false} />

        <nav aria-label="پیوندهای پایین صفحه" className="flex flex-wrap gap-x-6 gap-y-2">
          {landingNavLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-primary">
              {link.label}
            </Link>
          ))}
          <Link href="/login/" className="hover:text-primary">
            ورود
          </Link>
          <Link href="/register/" className="hover:text-primary">
            ثبت‌نام
          </Link>
        </nav>

        <div className="flex flex-col gap-1 md:items-end">
          <p>یادگیری زبان آلمانی، قدم‌به‌قدم.</p>
          <p dir="ltr">© {new Date().getFullYear()} LINGO</p>
        </div>
      </div>
    </footer>
  );
}
