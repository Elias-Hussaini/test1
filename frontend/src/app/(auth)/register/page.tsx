"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, User } from "lucide-react";
import { AuthField, PasswordField } from "@/components/auth/field";
import { AuthHeading } from "@/components/auth/auth-heading";
import { AuthTabs } from "@/components/auth/auth-tabs";
import { BrandLogo } from "@/components/auth/brand";
import { FormAlert } from "@/components/auth/form-alert";
import { GradientButton } from "@/components/auth/gradient-button";
import { isPasswordValid, PasswordRules } from "@/components/auth/password-rules";
import { useAuthStore } from "@/stores/auth-store";

type Errors = { email?: string; password?: string; confirm?: string };

export default function RegisterPage() {
  const router = useRouter();
  const status = useAuthStore((s) => s.status);
  const signUp = useAuthStore((s) => s.signUp);
  const loading = useAuthStore((s) => s.loading);
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const justRegistered = useRef(false);

  useEffect(() => {
    clearError();
  }, [clearError]);

  // کاربر واردشده نباید فرم ثبت‌نام ببیند (مگر همین الان ثبت‌نام کرده و به تأیید ایمیل می‌رود)
  useEffect(() => {
    if (status === "authed" && !justRegistered.current) router.replace("/dashboard/");
  }, [status, router]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (loading) return;

    const found: Errors = {};
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) found.email = "ایمیل معتبر وارد کن.";
    if (!isPasswordValid(password)) found.password = "رمز همه‌ی شرایط زیر را ندارد.";
    if (confirm !== password) found.confirm = "تکرار رمز با رمز بالا یکی نیست.";
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    clearError();
    justRegistered.current = true;
    const result = await signUp({ email: email.trim(), password, fullName });
    if (result.success) router.replace("/verify-email/");
    else justRegistered.current = false;
  };

  return (
    <section className="auth-card auth-rise">
      <BrandLogo className="mb-3" />
      <AuthHeading title="همین حالا ثبت‌نام کنید" />

      <div className="mt-6">
        <AuthTabs active="register" />
      </div>

      <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
        {error ? <FormAlert>{error}</FormAlert> : null}

        <AuthField
          label="نام و نام خانوادگی"
          icon={User}
          autoComplete="name"
          placeholder="نام و نام خانوادگی (اختیاری)"
          maxLength={100}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <AuthField
          label="ایمیل"
          icon={Mail}
          type="email"
          ltr
          autoComplete="email"
          inputMode="email"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="ایمیل"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />

        <PasswordField
          label="رمز عبور"
          autoComplete="new-password"
          placeholder="رمز عبور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        <PasswordField
          label="تکرار رمز عبور"
          autoComplete="new-password"
          placeholder="تکرار رمز عبور"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={errors.confirm}
        />

        <PasswordRules value={password} />

        <GradientButton loading={loading}>{loading ? "در حال ساخت حساب…" : "ثبت‌نام"}</GradientButton>

        <p className="text-center text-xs leading-6 text-muted">
          با ثبت‌نام، شرایط و قوانین استفاده از LINGO را می‌پذیری. بعد از ثبت‌نام، کد تأیید به ایمیلت ارسال می‌شود.
        </p>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        قبلاً ثبت‌نام کرده‌اید؟{" "}
        <Link href="/login/" className="font-bold text-primary hover:underline">
          وارد شوید
        </Link>
      </p>
    </section>
  );
}
