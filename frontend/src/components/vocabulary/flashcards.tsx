"use client";

import { useState } from "react";
import { Check, RotateCcw, Volume2, X } from "lucide-react";
import { GermanWord } from "@/components/dictionary/word-card";
import { vocabularyApi, type SavedWord } from "@/lib/api";
import { canSpeak, speakGerman } from "@/lib/speech";

/**
 * جلسه‌ی مرور با فلش‌کارت.
 * «بلدم» وضعیت را learned و «نیاز به مرور» را learning می‌کند. الگوریتم فاصله‌دار (SRS) هنوز پیاده نشده؛
 * مدل داده (status) برای افزودنش بعداً آماده است.
 */
export default function Flashcards({ cards, onClose }: { cards: SavedWord[]; onClose: (changed: boolean) => void }) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [known, setKnown] = useState(0);
  const [again, setAgain] = useState(0);
  const [failed, setFailed] = useState(false);

  const done = index >= cards.length;
  const card = cards[index];

  const answer = (isKnown: boolean) => {
    // به‌روزرسانی در پس‌زمینه؛ اگر خطا شد در پایان اطلاع می‌دهیم
    vocabularyApi.update(card.word.id, isKnown ? "learned" : "learning").catch(() => setFailed(true));
    if (isKnown) setKnown((k) => k + 1);
    else setAgain((a) => a + 1);
    setRevealed(false);
    setIndex((i) => i + 1);
  };

  if (done) {
    return (
      <div className="app-card mx-auto max-w-md p-8 text-center" role="status">
        <h2 className="text-xl font-black">مرور تمام شد</h2>
        <p className="mt-3 text-sm leading-7 text-muted">
          {known.toLocaleString("fa-IR")} واژه را بلد بودی و {again.toLocaleString("fa-IR")} واژه برای مرور دوباره ماند.
        </p>
        {failed ? <p role="alert" className="mt-3 text-sm text-danger">ثبت بعضی نتیجه‌ها ناموفق بود؛ وضعیت واژه‌ها ممکن است کامل ذخیره نشده باشد.</p> : null}
        <button type="button" className="btn-primary mt-6" onClick={() => onClose(true)}>برگشت به واژگان</button>
      </div>
    );
  }

  const progress = (index / cards.length) * 100;

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-4 flex items-center gap-3">
        <button type="button" className="icon-btn" aria-label="خروج از مرور" onClick={() => onClose(index > 0)}>
          <X aria-hidden="true" className="h-[18px] w-[18px]" />
        </button>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-foreground/10" role="progressbar" aria-valuemin={0} aria-valuemax={cards.length} aria-valuenow={index}>
          <div className="h-full rounded-full bg-linear-to-l from-primary to-secondary transition-[width] duration-300" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-sm font-bold tabular-nums text-muted">{(index + 1).toLocaleString("fa-IR")}/{cards.length.toLocaleString("fa-IR")}</span>
      </div>

      <div className="app-card flex min-h-[18rem] flex-col items-center justify-center p-8 text-center">
        <GermanWord word={card.word} className="text-4xl" />
        {card.word.ipa ? <p dir="ltr" className="mt-2 text-sm text-muted">/{card.word.ipa.replace(/^\/|\/$/g, "")}/</p> : null}
        {canSpeak() ? (
          <button type="button" className="icon-btn mt-4" aria-label="تلفظ" onClick={() => speakGerman(`${card.word.article ?? ""} ${card.word.german}`.trim())}>
            <Volume2 aria-hidden="true" className="h-[18px] w-[18px]" />
          </button>
        ) : null}

        {revealed ? (
          <div className="mt-5" aria-live="polite">
            <p className="text-2xl font-extrabold text-primary">{card.word.persian}</p>
            {card.word.example ? <p lang="de" dir="ltr" className="mt-3 text-sm text-muted">{card.word.example}</p> : null}
          </div>
        ) : (
          <button type="button" className="btn-soft mt-6" onClick={() => setRevealed(true)} autoFocus>
            نمایش معنی
          </button>
        )}
      </div>

      {revealed ? (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button type="button" onClick={() => answer(false)} className="btn-soft !text-danger !bg-danger/10 min-h-12">
            <RotateCcw aria-hidden="true" className="h-4 w-4" /> نیاز به مرور
          </button>
          <button type="button" onClick={() => answer(true)} className="btn-primary min-h-12">
            <Check aria-hidden="true" className="h-4 w-4" /> بلدم
          </button>
        </div>
      ) : null}
    </div>
  );
}
