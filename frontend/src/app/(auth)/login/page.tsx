"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail } from "lucide-react";
import { AuthField, PasswordField } from "@/components/auth/field";
import { AuthHeading } from "@/components/auth/auth-heading";
import { AuthTabs } from "@/components/auth/auth-tabs";
import { BrandLogo } from "@/components/auth/brand";
import { FormAlert } from "@/components/auth/form-alert";
import { GradientButton } from "@/components/auth/gradient-button";
import { safeRedirect } from "@/lib/navigation";
import { useAuthStore } from "@/stores/auth-store";

function LoginForm() {
  const router = useRouter();
  const next = safeRedirect(useSearchParams().get("next"));

  const status = useAuthStore((s) => s.status);
  const login = useAuthStore((s) => s.login);
  const loginAsGuest = useAuthStore((s) => s.loginAsGuest);
  const loading = useAuthStore((s) => s.loading);
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  useEffect(() => {
    clearError();
  }, [clearError]);

  // کاربری که از قبل وارد شده، اینجا کاری ندارد
  useEffect(() => {
    if (status === "authed") router.replace(next);
  }, [status, next, router]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (loading) return;

    const found: typeof fieldErrors = {};
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) found.email = "ایمیل معتبر وارد کن.";
    if (!password) found.password = "رمز عبور را وارد کن.";
    setFieldErrors(found);
    if (Object.keys(found).length > 0) return;

    clearError();
    const result = await login(email.trim(), password);
    if (result.success) router.replace(next);
  };

  const onGuest = async () => {
    clearError();
    const result = await loginAsGuest();
    if (result.success) router.replace(next);
  };

  return (
    <section className="auth-card auth-rise">
      <BrandLogo className="mb-3" />
      <AuthHeading title="به دنیای زبان خوش آمدید" />

      <div className="mt-6">
        <AuthTabs active="login" />
      </div>

      <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
        {error ? <FormAlert>{error}</FormAlert> : null}

        <AuthField
          label="ایمیل"
          icon={Mail}
          type="email"
          ltr
          autoComplete="username"
          inputMode="email"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="ایمیل"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldErrors.email}
        />

        <div>
          <PasswordField
            label="رمز عبور"
            autoComplete="current-password"
            placeholder="رمز عبور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={fieldErrors.password}
          />
          <div className="mt-2.5 px-1">
            <Link href="/forgot-password/" className="text-xs font-bold text-primary hover:underline">
              رمز عبور را فراموش کرده‌اید؟
            </Link>
          </div>
        </div>

        <GradientButton loading={loading}>{loading ? "در حال ورود…" : "ورود"}</GradientButton>
      </form>

      <div className="my-6 flex items-center gap-4 text-xs text-muted">
        <span className="h-px flex-1 bg-border" />
        یا
        <span className="h-px flex-1 bg-border" />
      </div>

      <button
        type="button"
        onClick={onGuest}
        disabled={loading}
        className="h-12 w-full rounded-2xl border border-border text-sm font-bold text-foreground hover:border-primary/50 hover:text-primary disabled:opacity-50"
      >
        ادامه به‌عنوان مهمان
      </button>

      <p className="mt-6 text-center text-sm text-muted">
        حساب کاربری ندارید؟{" "}
        <Link href="/register/" className="font-bold text-primary hover:underline">
          ثبت‌نام کنید
        </Link>
      </p>
    </section>
  );
}

export default function LoginPage() {
  // useSearchParams به Suspense نیاز دارد (export استاتیک)
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
