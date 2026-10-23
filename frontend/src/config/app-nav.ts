import { GraduationCap, Home, LayoutGrid, MessagesSquare, UserRound, type LucideIcon } from "lucide-react";
import { features, type Feature } from "./features";

export type NavItem = {
  id: string;
  label: string;
  href: string;
  Icon: LucideIcon;
  /** پیشوند مسیرهایی که این مقصد را فعال نشان می‌دهند */
  match: string[];
  /** مقصدهای ثانویه که در پنل شیشه‌ای شناور باز می‌شوند (نه سایدبار) */
  panel?: { title: string; links: Feature[] };
};

export const primaryNav: NavItem[] = [
  { id: "home", label: "خانه", href: "/dashboard/", Icon: Home, match: ["/dashboard"] },
  { id: "learn", label: "یادگیری", href: "/learn/", Icon: GraduationCap, match: ["/learn"] },
  {
    id: "services",
    label: "خدمات",
    href: "/services/",
    Icon: LayoutGrid,
    match: ["/services", "/dictionary", "/vocabulary", "/exercises", "/ai-tutor", "/classes"],
    panel: { title: "خدمات", links: features.filter((f) => f.group === "services") },
  },
  {
    id: "comms",
    label: "ارتباطات",
    href: "/communications/",
    Icon: MessagesSquare,
    match: ["/communications", "/friends", "/chat", "/notifications"],
    panel: { title: "ارتباطات", links: features.filter((f) => f.group === "comms" && f.href) },
  },
  { id: "profile", label: "پروفایل", href: "/profile/", Icon: UserRound, match: ["/profile"] },
];

/** عنوان صفحه برای هدر. */
export const routeTitles: Record<string, string> = {
  "/dashboard": "خانه",
  "/learn": "مسیر یادگیری",
  "/services": "خدمات",
  "/dictionary": "دیکشنری",
  "/vocabulary": "واژگان من",
  "/exercises": "تمرین‌ها",
  "/ai-tutor": "مربی هوشمند",
  "/classes": "کلاس‌های آنلاین",
  "/communications": "ارتباطات",
  "/friends": "دوستان",
  "/chat": "پیام‌ها",
  "/notifications": "اعلان‌ها",
  "/profile": "پروفایل و تنظیمات",
};

export function normalizePath(pathname: string): string {
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
}

export function isActive(item: NavItem, pathname: string): boolean {
  const p = normalizePath(pathname);
  return item.match.some((m) => p === m || p.startsWith(`${m}/`));
}

export function titleFor(pathname: string): string {
  const p = normalizePath(pathname);
  const key = Object.keys(routeTitles).find((k) => p === k || p.startsWith(`${k}/`));
  return key ? routeTitles[key] : "LINGO";
}
