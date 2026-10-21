import Link from "next/link";
import { cn } from "@/lib/utils";

/** تب ورود / ثبت‌نام (مثل طراحی). لینک واقعی است، پس رفرش و دکمه‌ی برگشت درست کار می‌کند. */
export function AuthTabs({ active }: { active: "login" | "register" }) {
  const tabs = [
    { key: "login", href: "/login/", label: "ورود" },
    { key: "register", href: "/register/", label: "ثبت‌نام" },
  ] as const;

  return (
    <nav aria-label="ورود یا ثبت‌نام" className="auth-tabs">
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          replace
          aria-current={active === tab.key ? "page" : undefined}
          className={cn("auth-tab", active === tab.key && "auth-tab-active")}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
