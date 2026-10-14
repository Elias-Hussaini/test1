"use client";

import type { ReactNode } from "react";
import { MotionConfig, motion } from "framer-motion";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** تأخیر به ثانیه (برای ورود پلکانی کارت‌ها) */
  delay?: number;
  /** فاصله‌ی شروع حرکت از پایین، به پیکسل */
  y?: number;
};

/**
 * ورود تدریجی هنگام رسیدن به محدوده‌ی دید.
 * رعایت prefers-reduced-motion با MotionConfig انجام می‌شود: حرکت (transform) حذف می‌شود
 * و فقط محو شدن ملایم باقی می‌ماند. هیچ تفاوتی بین HTML سرور و کلاینت وجود ندارد.
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  y = 28,
}: RevealProps) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className={className}
        initial={{ opacity: 0, y }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -70px 0px" }}
        transition={{ duration: 0.7, delay, ease: EASE }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}
