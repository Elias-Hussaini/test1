"use client";

import { useEffect, useState } from "react";

type TypewriterProps = {
  phrases: string[];
  className?: string;
  /** میلی‌ثانیه برای هر حرفِ تایپ‌شده */
  typeSpeed?: number;
  /** میلی‌ثانیه برای هر حرفِ پاک‌شده */
  deleteSpeed?: number;
  /** مدت توقف بعد از کامل شدن هر عبارت */
  pause?: number;
};

type Phase = "hold" | "deleting" | "typing";

export default function Typewriter({
  phrases,
  className = "",
  typeSpeed = 70,
  deleteSpeed = 36,
  pause = 1900,
}: TypewriterProps) {
  // حالت اولیه = عبارت اول به‌صورت کامل؛ سرور و کلاینت یکسان رندر می‌کنند و
  // برای کاربرانی که حرکت کم را فعال کرده‌اند همین متن ثابت می‌ماند.
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(phrases[0] ?? "");
  const [phase, setPhase] = useState<Phase>("hold");

  useEffect(() => {
    if (phrases.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const full = phrases[index];
    let timer: ReturnType<typeof setTimeout>;

    if (phase === "hold") {
      timer = setTimeout(() => setPhase("deleting"), pause);
    } else if (phase === "deleting") {
      if (text.length === 0) {
        timer = setTimeout(() => {
          setIndex((current) => (current + 1) % phrases.length);
          setPhase("typing");
        }, 320);
      } else {
        timer = setTimeout(() => setText((current) => current.slice(0, -1)), deleteSpeed);
      }
    } else if (text.length >= full.length) {
      timer = setTimeout(() => setPhase("hold"), 0);
    } else {
      // کمی تغییر تصادفی در سرعت، ریتم تایپ را طبیعی‌تر می‌کند.
      const delay = typeSpeed + Math.random() * 55;
      timer = setTimeout(() => setText(full.slice(0, text.length + 1)), delay);
    }

    return () => clearTimeout(timer);
  }, [phase, text, index, phrases, typeSpeed, deleteSpeed, pause]);

  return (
    <span className={className} dir="ltr" lang="de">
      {/* خوانندگان صفحه متن ثابت را می‌خوانند، نه تک‌تک حرف‌های در حال تایپ را */}
      <span className="sr-only">{phrases.join(". ")}</span>
      <span aria-hidden="true">{text}</span>
      <span aria-hidden="true" className="typewriter-caret" />
    </span>
  );
}
