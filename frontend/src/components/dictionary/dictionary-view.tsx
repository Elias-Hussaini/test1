"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Clock, Search, SearchX, X } from "lucide-react";
import { EmptyState, ErrorState, PageHeader, Skeleton } from "@/components/app/ui";
import WordCard from "@/components/dictionary/word-card";
import { ApiError, dictionaryApi, vocabularyApi, type Pagination, type Word } from "@/lib/api";
import { levels } from "@/config/levels";
import { cn } from "@/lib/utils";

const HISTORY_KEY = "lingo-dict-history";
const PAGE_SIZE = 20;

function readHistory(): string[] {
  try {
    const raw = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]");
    return Array.isArray(raw) ? raw.filter((x): x is string => typeof x === "string").slice(0, 8) : [];
  } catch {
    return [];
  }
}

export default function DictionaryView() {
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [level, setLevel] = useState(params.get("level") ?? "");
  const [words, setWords] = useState<Word[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [history, setHistory] = useState<string[]>([]);
  const [tick, setTick] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setHistory(readHistory()), []);

  // واژه‌های ذخیره‌شده برای نمایش وضعیت «ذخیره شد»
  useEffect(() => {
    const c = new AbortController();
    vocabularyApi
      .list({ limit: 100 }, c.signal)
      .then((r) => setSaved(new Set(r.words.map((w) => w.word.id))))
      .catch(() => {});
    return () => c.abort();
  }, []);

  // جستجوی با تأخیر ۳۰۰ میلی‌ثانیه
  useEffect(() => {
    const c = new AbortController();
    setLoading(true);
    setError(null);
    const t = setTimeout(() => {
      dictionaryApi
        .search({ q: q.trim() || undefined, level: level || undefined, page: 1, limit: PAGE_SIZE }, c.signal)
        .then((r) => {
          setWords(r.words);
          setPagination(r.pagination);
          setLoading(false);
        })
        .catch((e: unknown) => {
          if (c.signal.aborted) return;
          setError(e instanceof ApiError ? e.message : "ارتباط با سرور برقرار نشد.");
          setLoading(false);
        });
    }, q ? 300 : 0);
    return () => {
      clearTimeout(t);
      c.abort();
    };
  }, [q, level, tick]);

  const remember = useCallback((term: string) => {
    const t = term.trim();
    if (t.length < 2) return;
    const next = [t, ...readHistory().filter((h) => h !== t)].slice(0, 8);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    } catch {}
    setHistory(next);
  }, []);

  const loadMore = async () => {
    if (!pagination) return;
    setLoadingMore(true);
    try {
      const r = await dictionaryApi.search({ q: q.trim() || undefined, level: level || undefined, page: pagination.page + 1, limit: PAGE_SIZE });
      setWords((w) => [...w, ...r.words]);
      setPagination(r.pagination);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "بارگذاری بیشتر ناموفق بود.");
    } finally {
      setLoadingMore(false);
    }
  };

  const hasMore = pagination ? pagination.page < pagination.totalPages : false;

  return (
    <>
      <PageHeader title="دیکشنری آلمانی–فارسی" description="واژه‌ی آلمانی یا معنی فارسی را جستجو کن." />

      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          remember(q);
        }}
        className="sticky top-[4.5rem] z-30 -mx-1 mb-4 px-1 pb-1 pt-1"
      >
        <div className="relative">
          <Search aria-hidden="true" className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
          <input
            ref={inputRef}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onBlur={() => remember(q)}
            placeholder="مثلاً Haus یا خانه"
            aria-label="جستجوی واژه"
            autoComplete="off"
            enterKeyHint="search"
            className="field ps-12 pe-12 shadow-lg shadow-primary/5"
          />
          {q ? (
            <button
              type="button"
              aria-label="پاک کردن جستجو"
              onClick={() => {
                setQ("");
                inputRef.current?.focus();
              }}
              className="absolute end-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:bg-foreground/5"
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </form>

      <div className="mb-4 flex flex-wrap items-center gap-2" role="group" aria-label="فیلتر سطح">
        {["", ...levels.map((l) => l.id)].map((l) => (
          <button
            key={l || "all"}
            type="button"
            aria-pressed={level === l}
            onClick={() => setLevel(l)}
            className={cn(
              "min-h-10 rounded-full border px-4 text-sm font-bold transition-colors",
              level === l ? "border-primary bg-primary text-white" : "border-border bg-surface-2 hover:border-primary/50",
            )}
          >
            <span dir="ltr">{l || "همه"}</span>
          </button>
        ))}
      </div>

      {!q && history.length ? (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Clock aria-hidden="true" className="h-4 w-4 text-muted" />
          <span className="sr-only">جستجوهای اخیر</span>
          {history.map((h) => (
            <button key={h} type="button" onClick={() => setQ(h)} className="rounded-full bg-foreground/[0.06] px-3 py-1.5 text-sm hover:bg-primary/10">
              {h}
            </button>
          ))}
        </div>
      ) : null}

      <div aria-live="polite" className="sr-only">
        {!loading && pagination ? `${pagination.total} نتیجه` : ""}
      </div>

      {error ? (
        <ErrorState message={error} onRetry={() => setTick((t) => t + 1)} />
      ) : loading ? (
        <ul className="space-y-3" aria-busy="true">
          {Array.from({ length: 5 }, (_, i) => (
            <li key={i}><Skeleton className="h-16" /></li>
          ))}
        </ul>
      ) : words.length === 0 ? (
        <EmptyState
          Icon={SearchX}
          title={q || level ? "نتیجه‌ای پیدا نشد" : "دیکشنری هنوز خالی است"}
          description={q || level ? "املای واژه را بررسی کن یا فیلتر سطح را بردار." : "واژه‌ها از پنل مدیریت اضافه می‌شوند. بعد از افزودن، اینجا نمایش داده می‌شوند."}
        />
      ) : (
        <>
          <p className="mb-3 text-sm text-muted">{pagination?.total.toLocaleString("fa-IR")} واژه</p>
          <ul className="space-y-3">
            {words.map((w) => (
              <WordCard key={w.id} word={w} saved={saved.has(w.id)} onSaved={(id) => setSaved((s) => new Set(s).add(id))} />
            ))}
          </ul>
          {hasMore ? (
            <div className="mt-5 text-center">
              <button type="button" onClick={loadMore} disabled={loadingMore} className="btn-soft">
                {loadingMore ? "در حال بارگذاری…" : "نمایش بیشتر"}
              </button>
            </div>
          ) : null}
        </>
      )}
    </>
  );
}
