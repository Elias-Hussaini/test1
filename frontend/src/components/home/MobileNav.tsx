"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

type NavItem = {
  href: string;
  label: string;
};

type MobileNavProps = {
  links: NavItem[];
};

export default function MobileNav({ links }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "بستن منو" : "باز کردن منو"}
        onClick={() => setOpen((current) => !current)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface hover:border-primary/40 hover:text-primary active:scale-95"
      >
        {open ? (
          <X aria-hidden="true" className="h-5 w-5" />
        ) : (
          <Menu aria-hidden="true" className="h-5 w-5" />
        )}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.nav
            id="mobile-menu"
            aria-label="ناوبری موبایل"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            // هدر والد position دارد؛ منو نسبت به آن و زیر آن باز می‌شود.
            className="glass-strong absolute inset-x-4 top-[calc(100%+0.5rem)] z-50 flex flex-col p-2"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-base font-semibold hover:bg-primary/10 hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
