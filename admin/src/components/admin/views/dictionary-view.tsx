"use client";

import { useState } from "react";
import { BookOpen, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useApi, useDebouncedValue } from "@/hooks/use-api";
import { dictionaryApi, errorMessage, type Article, type Word } from "@/lib/api";
import { faNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button, FilterSelect, SearchInput } from "../common/controls";
import { ConfirmDialog } from "../common/confirm-dialog";
import { PageHeader, Panel } from "../common/page-header";
import { Pagination } from "../common/pagination";
import { EmptyState, ErrorState, Skeleton } from "../common/states";
import { WordFormDialog } from "../word-form-dialog";

const PAGE_SIZE = 15;
export const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

const articleStyle: Record<Article, string> = {
  der: "bg-secondary-c/15 text-secondary-c",
  die: "bg-danger/15 text-danger",
  das: "bg-success/15 text-success",
};

export function DictionaryView() {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("");
  const [article, setArticle] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search.trim());

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Word | null>(null);
  const [deleting, setDeleting] = useState<Word | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const { data, error, loading, reload } = useApi(
    (signal) => dictionaryApi.search({ q: debouncedSearch, level, article, page, limit: PAGE_SIZE }, signal),
    [debouncedSearch, level, article, page],
  );

  const words = data?.words ?? [];
  const filtersActive = Boolean(debouncedSearch || level || article);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (word: Word) => {
    setEditing(word);
    setFormOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await dictionaryApi.remove(deleting.id);
      toast({ title: "حذف شد", description: `«${deleting.german}» از واژه‌نامه حذف شد.` });
      setDeleting(null);
      // اگر آخرین ردیف صفحه حذف شد، یک صفحه عقب برو
      if (words.length === 1 && page > 1) setPage(page - 1);
      else reload();
    } catch (err) {
      toast({ title: "حذف نشد", description: errorMessage(err), variant: "destructive" });
    } finally {
      setDeleteBusy(false);
    }
  };

  return (
    <>
      <PageHeader
        title="واژه‌نامه"
        description={data ? `${faNumber(data.pagination.total)} کلمه ${filtersActive ? "مطابق فیلترها" : "در دیتابیس"}` : "مدیریت لغات آلمانی"}
        actions={
          <Button onClick={openCreate}>
            <Plus aria-hidden="true" className="h-4 w-4" />
            کلمه‌ی جدید
          </Button>
        }
      />

      <Panel>
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
          <div className="relative min-w-[14rem] flex-1">
            <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <SearchInput
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="جستجوی آلمانی یا فارسی…"
              aria-label="جستجوی کلمه"
              className="pl-10"
            />
          </div>
          <FilterSelect
            label="فیلتر سطح"
            value={level}
            onChange={(event) => {
              setLevel(event.target.value);
              setPage(1);
            }}
          >
            <option value="">همه‌ی سطح‌ها</option>
            {LEVELS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </FilterSelect>
          <FilterSelect
            label="فیلتر حرف تعریف"
            value={article}
            onChange={(event) => {
              setArticle(event.target.value);
              setPage(1);
            }}
          >
            <option value="">همه‌ی حروف تعریف</option>
            <option value="der">der</option>
            <option value="die">die</option>
            <option value="das">das</option>
          </FilterSelect>
        </div>

        {error ? (
          <div className="p-5">
            <ErrorState message={error} onRetry={reload} />
          </div>
        ) : loading && !data ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 7 }, (_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : words.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title={filtersActive ? "کلمه‌ای با این فیلترها پیدا نشد" : "واژه‌نامه خالی است"}
            description={filtersActive ? "جستجو یا فیلترها را تغییر بده." : "اولین کلمه را اضافه کن تا کاربران بتوانند آن را ببینند."}
            action={
              filtersActive ? undefined : (
                <Button size="sm" onClick={openCreate}>
                  <Plus aria-hidden="true" className="h-4 w-4" />
                  افزودن کلمه
                </Button>
              )
            }
          />
        ) : (
          <div className={loading ? "opacity-60 transition-opacity" : "transition-opacity"} aria-busy={loading}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-sm">
                <thead>
                  <tr className="border-b border-border text-right text-xs text-muted-foreground">
                    <th scope="col" className="px-5 py-3 font-semibold">آلمانی</th>
                    <th scope="col" className="px-3 py-3 font-semibold">فارسی</th>
                    <th scope="col" className="px-3 py-3 font-semibold">سطح</th>
                    <th scope="col" className="hidden px-3 py-3 font-semibold md:table-cell">نوع</th>
                    <th scope="col" className="w-24 px-3 py-3"><span className="sr-only">عملیات</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {words.map((word) => (
                    <tr key={word.id} className="hover:bg-muted/40">
                      <td className="px-5 py-3">
                        <div dir="ltr" className="flex items-center justify-end gap-2 text-right">
                          {word.article ? <span className={cn("rounded-md px-1.5 py-0.5 text-[11px] font-black", articleStyle[word.article])}>{word.article}</span> : null}
                          <span lang="de" className="font-bold">{word.german}</span>
                          {word.plural ? <span className="text-xs text-muted-foreground">({word.plural})</span> : null}
                        </div>
                      </td>
                      <td className="px-3 py-3">{word.persian}</td>
                      <td className="px-3 py-3">
                        <span className="rounded-md bg-primary/12 px-2 py-0.5 text-xs font-black text-primary">{word.level}</span>
                      </td>
                      <td className="hidden px-3 py-3 text-xs text-muted-foreground md:table-cell">{word.partOfSpeech ?? "—"}</td>
                      <td className="px-3 py-3">
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openEdit(word)}
                            aria-label={`ویرایش ${word.german}`}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-primary"
                          >
                            <Pencil aria-hidden="true" className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleting(word)}
                            aria-label={`حذف ${word.german}`}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-danger/10 hover:text-danger"
                          >
                            <Trash2 aria-hidden="true" className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={page} totalPages={data?.pagination.totalPages ?? 1} total={data?.pagination.total ?? 0} onChange={setPage} disabled={loading} />
          </div>
        )}
      </Panel>

      <WordFormDialog open={formOpen} onOpenChange={setFormOpen} word={editing} onSaved={reload} />

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => (open ? undefined : setDeleting(null))}
        title="حذف کلمه"
        description={
          <>
            کلمه‌ی <b lang="de">{deleting?.german}</b> برای همیشه از واژه‌نامه حذف می‌شود. این کار قابل بازگشت نیست.
          </>
        }
        confirmLabel="حذف کن"
        tone="danger"
        loading={deleteBusy}
        onConfirm={confirmDelete}
      />
    </>
  );
}
