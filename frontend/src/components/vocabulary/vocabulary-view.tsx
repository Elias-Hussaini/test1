"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BookmarkX, Play, Search, Trash2 } from "lucide-react";
import { EmptyState, ErrorState, PageHeader, Skeleton } from "@/components/app/ui";
import Flashcards from "@/components/vocabulary/flashcards";
import { GermanWord } from "@/components/dictionary/word-card";
import { useApi } from "@/hooks/use-api";
import { ApiError, vocabularyApi, type SavedWord, type WordStatus } from "@/lib/api";
import { cn } from "@/lib/utils";

const tabs: { id: WordStatus | "all"; label: string }[] = [
  { id: "all", label: "همه" },
  { id: "learning", label: "در حال یادگیری" },
  { id: "unknown", label: "ناشناخته" },
  { id: "learned", label: "یادگرفته‌شده" },
];

const statusLabel: Record<WordStatus, { text: string; cls: string }> = {
  learning: { text: "در حال یادگیری", cls: "bg-primary/10 text-primary" },
  unknown: { text: "ناشناخته", cls: "bg-danger/10 text-danger" },
  learned: { text: "یادگرفته‌شده", cls: "bg-success/15 text-success" },
};

export default function VocabularyView() {
  const [tab, setTab] = useState<WordStatus | "all">("all");
  const [filter, setFilter] = useState("");
  const [reviewing, setReviewing] = useState<SavedWord[] | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const stats = useApi((s) => vocabularyApi.stats(s));
  const list = useApi((s) => vocabularyApi.list({ limit: 100, status: tab === "all" ? undefined : tab }, s), [tab]);

  const reloadAll = () => {
    list.reload();
    stats.reload();
  };

  const visible = useMemo(() => {
    const t = filter.trim().toLowerCase();
    const items = list.data?.words ?? [];
    return t ? items.filter((w) => w.word.german.toLowerCase().includes(t) || w.word.persian.includes(t)) : items;
  }, [list.data, filter]);

  const startReview = async () => {
    setActionError(null);
    try {
      const r = await vocabularyApi.list({ limit: 100 });
      const due = r.words.filter((w) => w.status !== "learned");
      if (due.length === 0) {
        setActionError("واژه‌ای برای مرور نداری؛ همه‌ی واژه‌هایت یادگرفته‌شده‌اند یا هنوز واژه‌ای ذخیره نکرده‌ای.");
        return;
      }
      setReviewing(due);
    } catch (e) {
      setActionError(e instanceof ApiError ? e.message : "شروع مرور ممکن نشد.");
    }
  };

  const remove = async (id: string) => {
    setActionError(null);
    try {
      await vocabularyApi.remove(id);
      reloadAll();
    } catch (e) {
      setActionError(e instanceof ApiError ? e.message : "حذف ناموفق بود.");
    }
  };

  if (reviewing) {
    return (
      <Flashcards
        cards={reviewing}
        onClose={(changed) => {
          setReviewing(null);
          if (changed) reloadAll();
        }}
      />
    );
  }

  const s = stats.data;
  const dueCount = s ? s.learning + s.unknown : 0;

  return (
    <>
      <PageHeader
        title="واژگان من"
        description="واژه‌هایی که از دیکشنری ذخیره کرده‌ای؛ با فلش‌کارت مرورشان کن."
        actions={
          <button type="button" className="btn-primary" onClick={startReview} disabled={!!s && s.total === 0}>
            <Play aria-hidden="true" className="h-4 w-4" />
            شروع مرور{dueCount ? ` (${dueCount.toLocaleString("fa-IR")})` : ""}
          </button>
        }
      />

      {s ? (
        <div className="mb-5 grid grid-cols-3 gap-3 text-center">
          {[
            ["کل", s.total],
            ["در حال یادگیری", s.learning + s.unknown],
            ["یادگرفته‌شده", s.learned],
          ].map(([label, n]) => (
            <div key={label as string} className="app-card p-3">
              <p className="text-xl font-black">{(n as number).toLocaleString("fa-IR")}</p>
              <p className="text-xs text-muted">{label}</p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mb-4 flex flex-wrap items-center gap-2" role="tablist" aria-label="وضعیت واژه">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "min-h-10 rounded-full border px-4 text-sm font-bold transition-colors",
              tab === t.id ? "border-primary bg-primary text-white" : "border-border bg-surface-2 hover:border-primary/50",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="relative mb-4">
        <Search aria-hidden="true" className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
        <input
          type="search"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="جستجو در واژه‌های من"
          aria-label="جستجو در واژه‌های ذخیره‌شده"
          className="field ps-12"
        />
      </div>

      {actionError ? <p role="alert" className="mb-4 rounded-2xl bg-danger/10 p-4 text-sm text-danger">{actionError}</p> : null}

      {list.error ? (
        <ErrorState message={list.error} onRetry={reloadAll} />
      ) : list.loading ? (
        <ul className="space-y-3" aria-busy="true">
          {Array.from({ length: 4 }, (_, i) => (
            <li key={i}><Skeleton className="h-16" /></li>
          ))}
        </ul>
      ) : visible.length === 0 ? (
        <EmptyState
          Icon={BookmarkX}
          title={filter || tab !== "all" ? "واژه‌ای با این شرایط نیست" : "هنوز واژه‌ای ذخیره نکرده‌ای"}
          description={filter || tab !== "all" ? undefined : "در دیکشنری دنبال یک واژه بگرد و آن را ذخیره کن تا اینجا ظاهر شود."}
          action={!filter && tab === "all" ? <Link href="/dictionary/" className="btn-primary">رفتن به دیکشنری</Link> : undefined}
        />
      ) : (
        <ul className="space-y-3">
          {visible.map((item) => (
            <li key={item.id} className="app-card flex items-center gap-3 px-4 py-3 sm:px-5">
              <div className="min-w-0 flex-1">
                <GermanWord word={item.word} className="text-lg" />
                <p className="truncate text-sm text-muted">{item.word.persian}</p>
              </div>
              <span className={cn("badge hidden shrink-0 sm:inline-flex", statusLabel[item.status].cls)}>{statusLabel[item.status].text}</span>
              <span dir="ltr" className="badge shrink-0 bg-foreground/[0.06] text-muted">{item.word.level}</span>
              <button type="button" className="icon-btn !h-10 !w-10 hover:!text-danger" aria-label={`حذف ${item.word.german}`} onClick={() => remove(item.word.id)}>
                <Trash2 aria-hidden="true" className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
