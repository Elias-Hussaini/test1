"use client";

import { useEffect, useState, type FormEvent } from "react";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { dictionaryApi, errorMessage, type Article, type Word, type WordInput } from "@/lib/api";
import { Button, SelectField, TextAreaField, TextField } from "./common/controls";
import { FormAlert } from "./common/form-alert";

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
const PARTS_OF_SPEECH: Array<[string, string]> = [
  ["Noun", "اسم (Noun)"],
  ["Verb", "فعل (Verb)"],
  ["Adjective", "صفت (Adjective)"],
  ["Adverb", "قید (Adverb)"],
  ["Preposition", "حرف اضافه (Preposition)"],
  ["Conjunction", "حرف ربط (Conjunction)"],
];

type FormState = {
  german: string;
  persian: string;
  article: "" | Article;
  plural: string;
  partOfSpeech: string;
  level: string;
  example: string;
  exampleFa: string;
  ipa: string;
  audioUrl: string;
};

const EMPTY: FormState = { german: "", persian: "", article: "", plural: "", partOfSpeech: "", level: "A1", example: "", exampleFa: "", ipa: "", audioUrl: "" };

function fromWord(word: Word | null): FormState {
  if (!word) return EMPTY;
  return {
    german: word.german,
    persian: word.persian,
    article: word.article ?? "",
    plural: word.plural ?? "",
    partOfSpeech: word.partOfSpeech ?? "",
    level: word.level,
    example: word.example ?? "",
    exampleFa: word.exampleFa ?? "",
    ipa: word.ipa ?? "",
    audioUrl: word.audioUrl ?? "",
  };
}

type Errors = Partial<Record<keyof FormState, string>>;

function validate(form: FormState): Errors {
  const errors: Errors = {};
  if (!form.german.trim()) errors.german = "واژه‌ی آلمانی الزامی است.";
  else if (form.german.length > 100) errors.german = "حداکثر ۱۰۰ کاراکتر.";
  if (!form.persian.trim()) errors.persian = "ترجمه‌ی فارسی الزامی است.";
  else if (form.persian.length > 100) errors.persian = "حداکثر ۱۰۰ کاراکتر.";
  if (form.plural.length > 100) errors.plural = "حداکثر ۱۰۰ کاراکتر.";
  if (form.ipa.length > 100) errors.ipa = "حداکثر ۱۰۰ کاراکتر.";
  if (form.example.length > 500) errors.example = "حداکثر ۵۰۰ کاراکتر.";
  if (form.exampleFa.length > 500) errors.exampleFa = "حداکثر ۵۰۰ کاراکتر.";
  if (form.audioUrl.trim()) {
    try {
      const url = new URL(form.audioUrl.trim());
      if (url.protocol !== "https:" && url.protocol !== "http:") errors.audioUrl = "آدرس باید با http یا https شروع شود.";
    } catch {
      errors.audioUrl = "آدرس معتبر نیست.";
    }
  }
  return errors;
}

type WordFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** null یعنی کلمه‌ی جدید */
  word: Word | null;
  onSaved: () => void;
};

export function WordFormDialog({ open, onOpenChange, word, onSaved }: WordFormDialogProps) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // هر بار که دیالوگ باز می‌شود فرم از نو پر می‌شود
  useEffect(() => {
    if (open) {
      setForm(fromWord(word));
      setErrors({});
      setFormError(null);
    }
  }, [open, word]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => (previous[key] ? { ...previous, [key]: undefined } : previous));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    // بک‌اند برای partOfSpeech و audioUrl مقدار خالی نمی‌پذیرد؛ پس فقط وقتی پر باشند فرستاده می‌شوند.
    const payload: WordInput = {
      german: form.german.trim(),
      persian: form.persian.trim(),
      article: form.article === "" ? null : form.article,
      plural: form.plural.trim(),
      level: form.level,
      example: form.example.trim(),
      exampleFa: form.exampleFa.trim(),
      ipa: form.ipa.trim(),
      ...(form.partOfSpeech ? { partOfSpeech: form.partOfSpeech } : {}),
      ...(form.audioUrl.trim() ? { audioUrl: form.audioUrl.trim() } : {}),
    };

    // برای کلمه‌ی جدید، فیلدهای خالی اصلاً فرستاده نمی‌شوند (در دیتابیس null بماند)؛
    // برای ویرایش، رشته‌ی خالی یعنی «پاک کن».
    if (!word) {
      for (const key of ["plural", "example", "exampleFa", "ipa"] as const) {
        if (payload[key] === "") delete payload[key];
      }
    }

    setSaving(true);
    setFormError(null);
    try {
      if (word) await dictionaryApi.update(word.id, payload);
      else await dictionaryApi.create(payload);
      toast({ title: word ? "ذخیره شد" : "کلمه اضافه شد", description: `«${payload.german}» ${word ? "به‌روز شد" : "به واژه‌نامه اضافه شد"}.` });
      onOpenChange(false);
      onSaved();
    } catch (error) {
      setFormError(errorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => (saving ? undefined : onOpenChange(next))}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{word ? "ویرایش کلمه" : "کلمه‌ی جدید"}</DialogTitle>
          <DialogDescription>فقط واژه‌ی آلمانی و ترجمه‌ی فارسی الزامی‌اند.</DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} noValidate className="space-y-4">
          {formError ? <FormAlert>{formError}</FormAlert> : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="آلمانی *" ltr lang="de" value={form.german} onChange={(e) => set("german", e.target.value)} error={errors.german} placeholder="Haus" autoFocus />
            <TextField label="فارسی *" value={form.persian} onChange={(e) => set("persian", e.target.value)} error={errors.persian} placeholder="خانه" />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <SelectField label="حرف تعریف" value={form.article} onChange={(e) => set("article", e.target.value as FormState["article"])}>
              <option value="">— ندارد —</option>
              <option value="der">der</option>
              <option value="die">die</option>
              <option value="das">das</option>
            </SelectField>
            <SelectField label="سطح" value={form.level} onChange={(e) => set("level", e.target.value)}>
              {LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </SelectField>
            <SelectField label="نوع کلمه" value={form.partOfSpeech} onChange={(e) => set("partOfSpeech", e.target.value)}>
              <option value="">— مشخص نشده —</option>
              {PARTS_OF_SPEECH.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </SelectField>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="جمع" ltr lang="de" value={form.plural} onChange={(e) => set("plural", e.target.value)} error={errors.plural} placeholder="Häuser" />
            <TextField label="تلفظ (IPA)" ltr value={form.ipa} onChange={(e) => set("ipa", e.target.value)} error={errors.ipa} placeholder="[haʊs]" />
          </div>

          <TextAreaField label="جمله‌ی نمونه (آلمانی)" ltr lang="de" value={form.example} onChange={(e) => set("example", e.target.value)} error={errors.example} rows={2} />
          <TextAreaField label="ترجمه‌ی جمله‌ی نمونه" value={form.exampleFa} onChange={(e) => set("exampleFa", e.target.value)} error={errors.exampleFa} rows={2} />
          <TextField label="آدرس فایل صوتی" ltr type="url" value={form.audioUrl} onChange={(e) => set("audioUrl", e.target.value)} error={errors.audioUrl} placeholder="https://…" hint="اختیاری" />

          <DialogFooter className="gap-2 pt-2 sm:justify-start">
            <Button type="submit" loading={saving}>
              {word ? "ذخیره‌ی تغییرات" : "افزودن کلمه"}
            </Button>
            <Button variant="ghost" disabled={saving} onClick={() => onOpenChange(false)}>
              انصراف
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
