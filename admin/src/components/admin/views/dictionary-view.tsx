"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  BookOpen,
  X,
} from "lucide-react";
import { useAdminStore } from "@/lib/admin-store";
import { dictionaryApi, type Word, type CreateWordInput } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type FilterLevel = "all" | "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

const emptyForm: CreateWordInput = {
  german: "",
  persian: "",
  article: null,
  plural: "",
  partOfSpeech: "Noun",
  level: "A1",
  example: "",
  exampleFa: "",
  ipa: "",
};

export function DictionaryView() {
  const { accessToken } = useAdminStore();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<FilterLevel>("all");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const [words, setWords] = useState<Word[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form dialog
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CreateWordInput>(emptyForm);
  const [saving, setSaving] = useState(false);

  // Delete dialog
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const result = await dictionaryApi.search(accessToken, {
        q: search || undefined,
        level: levelFilter === "all" ? undefined : levelFilter,
        page,
        limit: pageSize,
      });
      setWords(result.words);
      setTotal(result.pagination.total);
      setTotalPages(result.pagination.totalPages);
    } catch (err) {
      const error = err as { message?: string };
      setError(error.message ?? "خطا در بارگذاری واژه‌ها");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!accessToken) return;
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [accessToken, search, levelFilter, page]);

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setFormOpen(true);
  };

  const openEdit = (word: Word) => {
    setForm({
      german: word.german,
      persian: word.persian,
      article: (word.article as "der" | "die" | "das") ?? null,
      plural: word.plural ?? "",
      partOfSpeech: word.partOfSpeech ?? "Noun",
      level: word.level,
      example: word.example ?? "",
      exampleFa: word.exampleFa ?? "",
      ipa: word.ipa ?? "",
    });
    setEditingId(word.id);
    setFormOpen(true);
  };

  const handleSave = async () => {
    if (!accessToken) return;
    if (!form.german.trim() || !form.persian.trim()) {
      toast({
        title: "خطا",
        description: "واژه آلمانی و ترجمه فارسی الزامی است.",
        variant: "destructive",
      });
      return;
    }
    setSaving(true);
    try {
      const payload: CreateWordInput = {
        german: form.german.trim(),
        persian: form.persian.trim(),
        article: form.article || null,
        plural: form.plural || undefined,
        partOfSpeech: form.partOfSpeech,
        level: form.level,
        example: form.example || undefined,
        exampleFa: form.exampleFa || undefined,
        ipa: form.ipa || undefined,
      };

      if (editingId) {
        await dictionaryApi.update(accessToken, editingId, payload);
        toast({ title: "واژه به‌روزرسانی شد" });
      } else {
        await dictionaryApi.create(accessToken, payload);
        toast({ title: "واژه اضافه شد" });
      }

      setFormOpen(false);
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (err) {
      const error = err as { message?: string };
      toast({
        title: "خطا",
        description: error.message ?? "ذخیره ناموفق بود.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!accessToken || !deleteId) return;
    setDeleting(true);
    try {
      await dictionaryApi.delete(accessToken, deleteId);
      toast({ title: "واژه حذف شد" });
      setDeleteId(null);
      load();
    } catch (err) {
      const error = err as { message?: string };
      toast({
        title: "خطا",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-xs">
            <Search
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="جستجوی واژه..."
              className="h-10 w-full rounded-lg border border-input bg-background pr-10 pl-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <select
            value={levelFilter}
            onChange={(e) => {
              setLevelFilter(e.target.value as FilterLevel);
              setPage(1);
            }}
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">همه سطح‌ها</option>
            <option value="A1">A1</option>
            <option value="A2">A2</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
            <option value="C1">C1</option>
            <option value="C2">C2</option>
          </select>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground hover:bg-primary-hover"
        >
          <Plus className="h-4 w-4" />
          واژه جدید
        </button>
      </div>

      <p className="text-sm text-muted-foreground">
        {total > 0 ? `${total.toLocaleString("fa-IR")} واژه` : "در حال بارگذاری..."}
      </p>

      {/* Words grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-danger/30 bg-danger/5 p-8 text-center text-sm text-danger">
          {error}
        </div>
      ) : words.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <BookOpen className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-3 text-sm font-semibold">هیچ واژه‌ای یافت نشد</p>
          <p className="mt-1 text-xs text-muted-foreground">
            اولین واژه را اضافه کنید.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {words.map((w) => (
            <div
              key={w.id}
              className="group rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-lg font-black" dir="ltr" lang="de">
                    {w.article ? <span className="text-accent">{w.article} </span> : null}
                    {w.german}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{w.persian}</p>
                </div>
                <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold">
                  {w.level}
                </span>
              </div>

              {w.example ? (
                <p className="mt-3 line-clamp-2 text-xs text-muted-foreground" dir="ltr" lang="de">
                  {w.example}
                </p>
              ) : null}

              <div className="mt-4 flex items-center gap-1 border-t border-border pt-3">
                <button
                  type="button"
                  onClick={() => openEdit(w)}
                  className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg text-xs font-medium hover:bg-muted"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  ویرایش
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteId(w.id)}
                  className="inline-flex h-8 items-center justify-center rounded-lg border border-danger/30 px-3 text-danger hover:bg-danger/10"
                  aria-label="حذف"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 ? (
        <div className="flex items-center justify-between text-sm">
          <p className="text-muted-foreground">
            صفحه {page.toLocaleString("fa-IR")} از {totalPages.toLocaleString("fa-IR")}
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:border-primary/40 disabled:opacity-40"
            >
              ›
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:border-primary/40 disabled:opacity-40"
            >
              ‹
            </button>
          </div>
        </div>
      ) : null}

      {/* Create/Edit Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "ویرایش واژه" : "افزودن واژه جدید"}</DialogTitle>
            <DialogDescription>
              {editingId
                ? "اطلاعات واژه را ویرایش کنید."
                : "یک واژه آلمانی جدید به دیکشنری اضافه کنید."}
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[60vh] space-y-3 overflow-y-auto py-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-semibold">واژه آلمانی</label>
                <input
                  value={form.german}
                  onChange={(e) => setForm({ ...form, german: e.target.value })}
                  dir="ltr"
                  placeholder="Haus"
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold">ترجمه فارسی</label>
                <input
                  value={form.persian}
                  onChange={(e) => setForm({ ...form, persian: e.target.value })}
                  placeholder="خانه"
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-semibold">آرتیکل</label>
                <select
                  value={form.article ?? ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      article: (e.target.value || null) as "der" | "die" | "das" | null,
                    })
                  }
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">—</option>
                  <option value="der">der</option>
                  <option value="die">die</option>
                  <option value="das">das</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold">سطح</label>
                <select
                  value={form.level}
                  onChange={(e) => setForm({ ...form, level: e.target.value })}
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                  <option value="B1">B1</option>
                  <option value="B2">B2</option>
                  <option value="C1">C1</option>
                  <option value="C2">C2</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold">نوع</label>
                <select
                  value={form.partOfSpeech}
                  onChange={(e) => setForm({ ...form, partOfSpeech: e.target.value })}
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="Noun">اسم</option>
                  <option value="Verb">فعل</option>
                  <option value="Adjective">صفت</option>
                  <option value="Adverb">قید</option>
                  <option value="Preposition">حرف اضافه</option>
                  <option value="Conjunction">حرف ربط</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold">جمع (Plural)</label>
              <input
                value={form.plural}
                onChange={(e) => setForm({ ...form, plural: e.target.value })}
                dir="ltr"
                placeholder="Häuser"
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold">مثال آلمانی</label>
              <input
                value={form.example}
                onChange={(e) => setForm({ ...form, example: e.target.value })}
                dir="ltr"
                placeholder="Das Haus ist groß."
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold">ترجمه مثال</label>
              <input
                value={form.exampleFa}
                onChange={(e) => setForm({ ...form, exampleFa: e.target.value })}
                placeholder="خانه بزرگ است."
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold">تلفظ IPA</label>
              <input
                value={form.ipa}
                onChange={(e) => setForm({ ...form, ipa: e.target.value })}
                dir="ltr"
                placeholder="/haʊs/"
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <DialogFooter>
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="inline-flex h-10 items-center rounded-xl border border-border px-4 text-sm font-medium hover:bg-muted"
            >
              انصراف
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !form.german.trim() || !form.persian.trim()}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground hover:bg-primary-hover disabled:opacity-50"
            >
              {saving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  در حال ذخیره...
                </>
              ) : editingId ? (
                "به‌روزرسانی"
              ) : (
                "افزودن"
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>حذف واژه</DialogTitle>
            <DialogDescription>
              آیا از حذف این واژه مطمئن هستید؟ این عمل قابل بازگشت نیست.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              type="button"
              onClick={() => setDeleteId(null)}
              className="inline-flex h-10 items-center rounded-xl border border-border px-4 text-sm font-medium hover:bg-muted"
            >
              انصراف
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-danger px-4 text-sm font-bold text-white hover:bg-danger/90 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              {deleting ? "در حال حذف..." : "حذف کن"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DictionaryView;
