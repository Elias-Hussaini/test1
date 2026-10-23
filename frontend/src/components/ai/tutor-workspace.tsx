"use client";

import { useState } from "react";
import { Bot, Send, Sparkles, Wrench } from "lucide-react";
import { Card } from "@/components/app/ui";
import { cn } from "@/lib/utils";

const prompts = [
  "جمله‌ی «Ich habe gestern ein Buch gelesen» را توضیح بده",
  "تفاوت der، die و das را با مثال بگو",
  "یک مکالمه‌ی ساده در رستوران با من تمرین کن",
  "جمله‌ام را تصحیح کن: Ich gehe zu Schule",
];

/**
 * محیط مربی هوشمند. رابط آماده است، اما سرویس هوش مصنوعی هنوز به بک‌اند وصل نشده؛
 * پاسخ ساختگی نشان داده نمی‌شود. اتصال واقعی باید از طریق بک‌اند (کلید فقط روی سرور) انجام شود.
 */
export default function TutorWorkspace() {
  const [mode, setMode] = useState<"fa" | "de">("fa");
  const [text, setText] = useState("");

  return (
    <div className="space-y-4">
      <div role="status" className="flex items-start gap-3 rounded-2xl border border-primary/30 bg-primary/10 p-4 text-sm leading-7">
        <Wrench aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-primary" />
        <p>
          <b>سرویس هوش مصنوعی هنوز متصل نیست.</b> رابط آماده است و بعد از اتصال بک‌اند، مربی به دیکشنری، واژگان ذخیره‌شده و سطح تو دسترسی خواهد داشت.
        </p>
      </div>

      <Card className="flex min-h-[26rem] flex-col !p-0">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-primary to-secondary text-white">
              <Bot aria-hidden="true" className="h-5 w-5" />
            </span>
            <span className="font-extrabold">مربی آلمانی</span>
          </div>
          <div role="radiogroup" aria-label="زبان توضیح" className="flex rounded-full bg-foreground/[0.06] p-1 text-sm font-bold">
            {([["fa", "توضیح فارسی"], ["de", "Deutsch"]] as const).map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={mode === id}
                onClick={() => setMode(id)}
                className={cn("min-h-9 rounded-full px-4 transition-colors", mode === id ? "bg-primary text-white" : "text-muted")}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-8 text-center">
          <Sparkles aria-hidden="true" className="h-8 w-8 text-primary" />
          <p className="max-w-sm text-sm leading-7 text-muted">با یک پیشنهاد شروع کن یا سؤالت را بنویس:</p>
          <div className="flex max-w-xl flex-wrap justify-center gap-2">
            {prompts.map((p) => (
              <button key={p} type="button" onClick={() => setText(p)} className="rounded-2xl border border-border bg-surface-2 px-3 py-2 text-start text-sm hover:border-primary/50">
                {p}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="flex items-end gap-2 border-t border-border p-3">
          <label className="sr-only" htmlFor="tutor-input">پیام برای مربی</label>
          <textarea
            id="tutor-input"
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={mode === "fa" ? "سؤالت را بنویس…" : "Schreib auf Deutsch…"}
            className="field max-h-32 min-h-11 flex-1 resize-none"
          />
          <button type="submit" disabled className="btn-primary !h-11 !w-11 !p-0" aria-label="ارسال (سرویس هنوز متصل نیست)" title="سرویس هوش مصنوعی هنوز متصل نیست">
            <Send aria-hidden="true" className="h-4 w-4 -scale-x-100" />
          </button>
        </form>
      </Card>
    </div>
  );
}
