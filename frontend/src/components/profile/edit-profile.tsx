"use client";

import { useState } from "react";
import { Card } from "@/components/app/ui";
import { ApiError, usersApi, type ProfileUpdate } from "@/lib/api";
import { levels } from "@/config/levels";
import { useAuthStore } from "@/stores/auth-store";

type Props = {
  initial: { firstName: string | null; lastName: string | null; bio: string | null; level: string };
  onSaved: () => void;
};

export default function EditProfile({ initial, onSaved }: Props) {
  const [firstName, setFirstName] = useState(initial.firstName ?? "");
  const [lastName, setLastName] = useState(initial.lastName ?? "");
  const [bio, setBio] = useState(initial.bio ?? "");
  const [level, setLevel] = useState(initial.level);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    // فقط فیلدهای پر ارسال می‌شوند (بک‌اند مقدار خالی را نمی‌پذیرد)
    const data: ProfileUpdate = { level: level as ProfileUpdate["level"] };
    if (firstName.trim()) data.firstName = firstName.trim();
    if (lastName.trim()) data.lastName = lastName.trim();
    data.bio = bio.trim();
    try {
      const res = await usersApi.updateProfile(data);
      useAuthStore.setState((s) => ({ user: s.user ? { ...s.user, level: res.level } : s.user }));
      setMsg({ ok: true, text: "تغییرات ذخیره شد." });
      onSaved();
    } catch (err) {
      setMsg({ ok: false, text: err instanceof ApiError ? err.message : "ذخیره نشد. دوباره تلاش کن." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card>
      <h2 className="font-extrabold">ویرایش پروفایل</h2>
      <form onSubmit={submit} className="mt-4 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-bold">
            نام
            <input className="field mt-1.5 font-normal" value={firstName} maxLength={50} onChange={(e) => setFirstName(e.target.value)} autoComplete="given-name" />
          </label>
          <label className="block text-sm font-bold">
            نام خانوادگی
            <input className="field mt-1.5 font-normal" value={lastName} maxLength={50} onChange={(e) => setLastName(e.target.value)} autoComplete="family-name" />
          </label>
        </div>
        <label className="block text-sm font-bold">
          سطح زبان
          <select className="field mt-1.5 font-normal" value={level} onChange={(e) => setLevel(e.target.value)}>
            {levels.map((l) => (
              <option key={l.id} value={l.id}>{l.id} · {l.title}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-bold">
          درباره‌ی من
          <textarea className="field mt-1.5 font-normal" rows={3} maxLength={500} value={bio} onChange={(e) => setBio(e.target.value)} />
        </label>
        <div className="flex items-center gap-3">
          <button type="submit" className="btn-primary" disabled={busy}>{busy ? "در حال ذخیره…" : "ذخیره"}</button>
          {msg ? <p role={msg.ok ? "status" : "alert"} className={msg.ok ? "text-sm text-success" : "text-sm text-danger"}>{msg.text}</p> : null}
        </div>
      </form>
    </Card>
  );
}
