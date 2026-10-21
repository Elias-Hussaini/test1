"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Mail } from "lucide-react";
import { AuthField } from "@/components/auth/field";
import { AuthHeading } from "@/components/auth/auth-heading";
import { BrandLogo } from "@/components/auth/brand";
import { FormAlert } from "@/components/auth/form-alert";
import { GradientButton } from "@/components/auth/gradient-button";
import { ApiError, authApi } from "@/lib/api";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (loading) return;

    const value = email.trim();
    if (!/^\S+@\S+\.\S+$/.test(value)) {
      setFieldError("ایمیل معتبر وارد کن.");
      return;
    }
    setFieldError(null);
    setError(null);
    setLoading(true);

    try {
      await authApi.requestPasswordReset(value);
      // پاسخ عمداً برای ایمیل موجود و ناموجود یکسان است؛ در هر حال به صفحه‌ی ورود کد می‌رویم.
      router.push(`/reset-password/?email=${encodeURIComponent(value)}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "ارسال انجام نشد. دوباره تلاش کن.");
      setLoading(false);
    }
  };

  return (
    <section className="auth-card auth-rise">
      <Link href="/login/" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-foreground">
        <ArrowRight aria-hidden="true" className="h-4 w-4" />
        بازگشت
      </Link>

      <BrandLogo width={132} className="mb-3" />
      <AuthHeading title="بازیابی رمز عبور">
        ایمیل حسابت را وارد کن؛ یک کد ۶ رقمی برایت می‌فرستیم تا رمز جدید انتخاب کنی.
      </AuthHeading>

      <form onSubmit={onSubmit} noValidate className="mt-7 space-y-4">
        {error ? <FormAlert>{error}</FormAlert> : null}

        <AuthField
          label="ایمیل"
          icon={Mail}
          type="email"
          ltr
          autoFocus
          autoComplete="email"
          inputMode="email"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="ایمیل"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldError}
        />

        <GradientButton loading={loading}>{loading ? "در حال ارسال…" : "ارسال کد بازیابی"}</GradientButton>
      </form>

      <p className="mt-6 text-center text-sm">
        <Link href="/login/" className="font-bold text-primary hover:underline">
          بازگشت به ورود
        </Link>
      </p>
    </section>
  );
}
