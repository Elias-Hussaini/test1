import { BookOpen, LayoutDashboard, Settings, Users, type LucideIcon } from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
  /** عنوان بالای صفحه */
  title: string;
};

export const navItems: NavItem[] = [
  { href: "/", label: "داشبورد", description: "نمای کلی پلتفرم", icon: LayoutDashboard, title: "داشبورد" },
  { href: "/users", label: "کاربران", description: "مدیریت حساب‌ها", icon: Users, title: "مدیریت کاربران" },
  { href: "/dictionary", label: "واژه‌نامه", description: "مدیریت لغات", icon: BookOpen, title: "واژه‌نامه" },
  { href: "/settings", label: "تنظیمات", description: "حساب و وضعیت سیستم", icon: Settings, title: "تنظیمات" },
];

export function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function titleFor(pathname: string): string {
  return navItems.find((item) => isActive(pathname, item.href))?.title ?? "پنل مدیریت";
}
