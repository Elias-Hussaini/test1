"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Plus, Volume2 } from "lucide-react";
import { ApiError, vocabularyApi, type Word } from "@/lib/api";
import { canSpeak, speakGerman } from "@/lib/speech";
import { cn } from "@/lib/utils";

const articleTone: Record<string, string> = {
  der: "bg-secondary/15 text-secondary",
  die: "bg-danger/15 text-danger",
  das: "bg-success/15 text-success",
};

export function GermanWord({ word, className }: { word: Pick<Word, "german" | "article">; className?: string }) {
  return (
    <span lang="de" dir="ltr" className={cn("inline-flex items-baseline gap-1.5 font-black", className)}>
      {word.article ? <span className={cn("rounded-md px-1.5 text-[0.7em] font-extrabold", articleTone[word.article])}>{word.article}</span> : null}
      {word.german}
    </span>
  );
}

type Props = {
  word: Word;
  saved: boolean;
  onSaved: (id: string) => void;
};

export default function WordCard({ word, saved, onSaved }: Props) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setBusy(true);
    setError(null);
    try {
      await vocabularyApi.add(word.id);
      onSaved(word.id);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "ذخیره نشد. دوباره تلاش کن.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <li className="app-card overflow-hidden">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-16 w-full items-center gap-3 px-4 py-3 text-start sm:px-5"
      >
        <GermanWord word={word} className="text-lg" />
        <span className="min-w-0 flex-1 truncate text-sm text-muted">{word.persian}</span>
        {saved ? <Check aria-label="ذخیره‌شده" className="h-4 w-4 shrink-0 text-success" /> : null}
        <span dir="ltr" className="badge shrink-0 bg-foreground/[0.06] text-muted">{word.level}</span>
      </button>

      {open ? (
        <div className="border-t border-border px-4 pb-4 pt-4 sm:px-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xl font-extrabold">{word.persian}</p>
              <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
                {word.partOfSpeech ? (<><dt className="text-muted">نوع کلمه</dt><dd dir="ltr" className="text-start font-semibold">{word.partOfSpeech}</dd></>) : null}
                {word.plural ? (<><dt className="text-muted">جمع</dt><dd lang="de" dir="ltr" className="text-start font-semibold">die {word.plural}</dd></>) : null}
                {word.ipa ? (<><dt className="text-muted">تلفظ</dt><dd dir="ltr" className="text-start font-semibold">/{word.ipa.replace(/^\/|\/$/g, "")}/</dd></>) : null}
              </dl>
            </div>
            <div className="flex gap-2">
              {canSpeak() ? (
                <button type="button" className="icon-btn" aria-label={`تلفظ ${word.german}`} onClick={() => speakGerman(`${word.article ?? ""} ${word.german}`.trim())}>
                  <Volume2 aria-hidden="true" className="h-[18px] w-[18px]" />
                </button>
              ) : null}
              {saved ? (
                <Link href="/vocabulary/" className="btn-soft"><Check aria-hidden="true" className="h-4 w-4" /> ذخیره شد</Link>
              ) : (
                <button type="button" onClick={save} disabled={busy} className="btn-primary">
                  <Plus aria-hidden="true" className="h-4 w-4" /> {busy ? "در حال ذخیره…" : "ذخیره در واژگان"}
                </button>
              )}
            </div>
          </div>

          {word.example ? (
            <div className="mt-4 rounded-2xl bg-foreground/[0.04] p-4">
              <p lang="de" dir="ltr" className="text-start font-semibold">{word.example}</p>
              {word.exampleFa ? <p className="mt-1.5 text-sm text-muted">{word.exampleFa}</p> : null}
            </div>
          ) : null}
          {error ? <p role="alert" className="mt-3 text-sm text-danger">{error}</p> : null}
        </div>
      ) : null}
    </li>
  );
}
