"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { Lock } from "lucide-react";
import { isActive, normalizePath, primaryNav } from "@/config/app-nav";
import { usePlan } from "@/hooks/use-plan";
import { cn } from "@/lib/utils";

/**
 * ناوبری اصلی اپ: کپسول شیشه‌ای شناور (بدون سایدبار، در همه‌ی اندازه‌ها).
 * مقصدهای «خدمات» و «ارتباطات» یک پنل شیشه‌ای کوچک بالای کپسول باز می‌کنند.
 */
export default function FloatingGlassNav() {
  const pathname = usePathname();
  const { can } = usePlan();
  const [openId, setOpenId] = useState<string | null>(null);
  const dockRef = useRef<HTMLElement>(null);

  // با تغییر مسیر بسته شود
  useEffect(() => setOpenId(null), [pathname]);

  useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenId(null);
    const onPointer = (e: PointerEvent) => {
      if (dockRef.current && !dockRef.current.contains(e.target as Node)) setOpenId(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [openId]);

  const openItem = primaryNav.find((i) => i.id === openId);

  return (
    <MotionConfig reducedMotion="user">
      <nav ref={dockRef} aria-label="ناوبری اصلی" className="nav-dock">
        <AnimatePresence>
          {openItem?.panel ? (
            <motion.div
              key={openItem.id}
              id={`nav-panel-${openItem.id}`}
              role="group"
              aria-label={openItem.panel.title}
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="nav-panel"
            >
              <Link href={openItem.href} className="nav-chip nav-chip-strong">
                نمای کلی {openItem.panel.title}
              </Link>
              {openItem.panel.links.map((f) => {
                const locked = !can(f.id);
                const current = f.href ? normalizePath(pathname) === normalizePath(f.href) : false;
                return (
                  <Link
                    key={f.id}
                    href={f.href ?? openItem.href}
                    aria-current={current ? "page" : undefined}
                    className={cn("nav-chip", current && "nav-chip-current")}
                  >
                    <f.Icon aria-hidden="true" className="h-4 w-4" />
                    {f.title}
                    {locked ? <Lock aria-label="نیازمند اشتراک ویژه" className="h-3 w-3 opacity-60" /> : null}
                  </Link>
                );
              })}
            </motion.div>
          ) : null}
        </AnimatePresence>

        <ul className="nav-capsule">
          {primaryNav.map((item) => {
            const active = isActive(item, pathname);
            const expanded = openId === item.id;
            const inner = (
              <>
                {active ? (
                  <motion.span
                    layoutId="nav-active-pill"
                    aria-hidden="true"
                    className="nav-active"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                ) : null}
                <item.Icon aria-hidden="true" className="relative h-[22px] w-[22px]" strokeWidth={active ? 2.4 : 2} />
                <span className="relative text-[11px] font-bold leading-none sm:text-xs">{item.label}</span>
              </>
            );

            return (
              <li key={item.id} className="min-w-0 flex-1">
                {item.panel ? (
                  <button
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={expanded}
                    aria-controls={`nav-panel-${item.id}`}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpenId(expanded ? null : item.id)}
                    className={cn("nav-item", (active || expanded) && "nav-item-on")}
                  >
                    {inner}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn("nav-item", active && "nav-item-on")}
                  >
                    {inner}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </MotionConfig>
  );
}
