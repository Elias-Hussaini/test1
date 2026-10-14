"use client";

import { useState } from "react";

const OPTIONS = ["der", "die", "das"] as const;
const ANSWER = "die";

/** تمرین کوچک «آرتیکل درست» برای بخش پیش‌نمایش یادگیری. */
export default function ArticleQuiz() {
  const [picked, setPicked] = useState<string | null>(null);

  const answered = picked !== null;
  const correct = picked === ANSWER;

  return (
    <div>
      <p className="text-xs text-muted">تمرین سریع: آرتیکل درست کدام است؟</p>

      <p lang="de" dir="ltr" className="mt-2 text-lg font-extrabold">
        <span className="text-muted">___</span> Sprache
      </p>

      <div
        role="group"
        aria-label="انتخاب آرتیکل"
        dir="ltr"
        className="mt-3 flex gap-2"
      >
        {OPTIONS.map((option) => {
          const isPicked = picked === option;
          const stateClass = !isPicked
            ? "border-border bg-background/60 hover:border-primary/50 hover:text-primary"
            : correct
              ? "border-success/60 bg-success/15 text-success"
              : "border-danger/60 bg-danger/15 text-danger";

          return (
            <button
              key={option}
              type="button"
              lang="de"
              aria-pressed={isPicked}
              onClick={() => setPicked(option)}
              className={`min-h-10 flex-1 rounded-xl border px-3 text-sm font-bold active:scale-95 ${stateClass}`}
            >
              {option}
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="mt-2 min-h-5 text-xs leading-6">
        {!answered ? null : correct ? (
          <span className="text-success">
            درست است! Sprache مؤنث است: die Sprache
          </span>
        ) : (
          <span className="text-danger">
            نزدیک بود؛ Sprache مؤنث است و آرتیکل درست «die» است.
          </span>
        )}
      </p>
    </div>
  );
}
