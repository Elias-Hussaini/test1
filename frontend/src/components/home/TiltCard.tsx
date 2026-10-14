"use client";

import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";

type TiltCardProps = {
  children: ReactNode;
  /** کلاس‌های ظاهری کارت (رنگ، حاشیه، شعاع گوشه، padding ...) */
  className?: string;
  /** حداکثر زاویه‌ی چرخش به درجه */
  max?: number;
  /** بزرگ‌نمایی هنگام Hover */
  scale?: number;
  /** نور ملایمی که دنبال ماوس حرکت می‌کند */
  glare?: boolean;
};

const SPRING = { stiffness: 230, damping: 20, mass: 0.6 };

export default function TiltCard({
  children,
  className = "",
  max = 9,
  scale = 1.02,
  glare = true,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useRef(false);

  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const targetScale = useMotionValue(1);
  const rotateX = useSpring(targetX, SPRING);
  const rotateY = useSpring(targetY, SPRING);
  const scaleSpring = useSpring(targetScale, SPRING);

  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glareStrength = useSpring(useMotionValue(0), { stiffness: 140, damping: 22 });
  const glareBackground = useMotionTemplate`radial-gradient(420px circle at ${glareX}% ${glareY}%, color-mix(in srgb, var(--primary-glow) ${glareStrength}%, transparent), transparent 62%)`;

  // وضعیت حرکت کم فقط در کلاینت و بعد از mount خوانده می‌شود تا با HTML سرور تفاوتی نداشته باشد.
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotion.current = media.matches;
    const onChange = (event: MediaQueryListEvent) => {
      reducedMotion.current = event.matches;
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const reset = () => {
    targetX.set(0);
    targetY.set(0);
    targetScale.set(1);
    glareStrength.set(0);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    // فقط ماوس؛ روی لمس، چرخش مزاحم اسکرول و تپ می‌شود.
    if (reducedMotion.current || event.pointerType !== "mouse") return;
    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    targetY.set((px - 0.5) * 2 * max);
    targetX.set((0.5 - py) * 2 * max);
    targetScale.set(scale);

    glareX.set(px * 100);
    glareY.set(py * 100);
    glareStrength.set(24);
  };

  return (
    <div className="perspective-1000 h-full">
      <motion.div
        ref={ref}
        onPointerMove={onPointerMove}
        onPointerLeave={reset}
        onPointerCancel={reset}
        style={{
          rotateX,
          rotateY,
          scale: scaleSpring,
          transformStyle: "preserve-3d",
        }}
        className={`relative h-full will-change-transform ${className}`}
      >
        {children}
        {glare ? (
          <motion.div
            aria-hidden="true"
            style={{ background: glareBackground }}
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
          />
        ) : null}
      </motion.div>
    </div>
  );
}
