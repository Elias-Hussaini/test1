"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, CircleCheck, MailCheck, ShieldCheck, TriangleAlert } from "lucide-react";
import { AuthHeading } from "@/components/auth/auth-heading";
import { PasswordField } from "@/components/auth/field";
import { FormAlert } from "@/components/auth/form-alert";
import { GradientButton } from "@/components/auth/gradient-button";
import { OtpInput } from "@/components/auth/otp-input";
import { isPasswordValid, PasswordRules } from "@/components/auth/password-rules";
import { StatusIcon } from "@/components/auth/status-icon";
import { formatCountdown, useCooldown } from "@/components/auth/use-cooldown";
import { ApiError, authApi } from "@/lib/api";

type Stage = "code" | "password" | "done";

function ResetPasswordForm() {
  const router = useRouter();
  const email = useSearchParams().get("email") ?? "";

  const [stage, setStage] = useState<Stage>("code");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  // کد همین الان از صفحه‌ی «فراموشی رمز» فرستاده شده
  const { seconds, start } = useCooldown(60);

  if (!email) {
    return (
      <section className="auth-card auth-rise text-center">
        <StatusIcon icon={TriangleAlert} />
        <div className="mt-6">
          <AuthHeading title="لینک ناقص است">برای انتخاب رمز جدید، اول ایمیلت را در صفحه‌ی «فراموشی رمز» وارد کن.</AuthHeading>
        </div>
        <Link href="/forgot-password/" className="auth-btn mt-7">
          رفتن به فراموشی رمز
        </Link>
      </section>
    );
  }

  const onCodeSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (code.length !== 6) return;
    setError(null);
    setStage("password");
  };

  const onResend = async () => {
    if (seconds > 0 || resending) return;
    setResending(true);
    setError(null);
    try {
      const result = await authApi.requestPasswordReset(email);
      start(result.cooldownSeconds ?? 60);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "ارسال دوباره انجام نشد.");
    } finally {
      setResending(false);
    }
  };

  const onPasswordSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (loading) return;

    const found: typeof errors = {};
    if (!isPasswordValid(password)) found.password = "رمز همه‌ی شرایط زیر را ندارد.";
    if (confirm !== password) found.confirm = "تکرار رمز با رمز بالا یکی نیست.";
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setError(null);
    setLoading(true);
    try {
      await authApi.resetPassword({ email, code, newPassword: password });
      setStage("done");
    } catch (err) {
      if (err instanceof ApiError && err.code === "RESET_INVALID") {
        // کد اشتباه یا منقضی: برگرد به مرحله‌ی کد
        setCode("");
        setStage("code");
      }
      setError(err instanceof ApiError ? err.message : "تغییر رمز انجام نشد. دوباره تلاش کن.");
    } finally {
      setLoading(false);
    }
  };

  if (stage === "done") {
    return (
      <section className="auth-card auth-rise text-center">
        <StatusIcon icon={CircleCheck} />
        <div className="mt-6">
          <AuthHeading title="رمز جدید ثبت شد">برای امنیت بیشتر از همه‌ی دستگاه‌ها خارج شدی. حالا با رمز جدیدت وارد شو.</AuthHeading>
        </div>
        <button type="button" onClick={() => router.replace("/login/")} className="auth-btn mt-7">
          ورود به LINGO
        </button>
      </section>
    );
  }

  if (stage === "password") {
    return (
      <section className="auth-card auth-rise">
        <button
          type="button"
          onClick={() => setStage("code")}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-foreground"
        >
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
          بازگشت
        </button>

        <StatusIcon icon={ShieldCheck} />
        <div className="mt-6">
          <AuthHeading title="تنظیم رمز عبور جدید">رمز جدیدی انتخاب کن که قبلاً جای دیگری استفاده نکرده‌ای.</AuthHeading>
        </div>

        <form onSubmit={onPasswordSubmit} noValidate className="mt-7 space-y-4">
          {error ? <FormAlert>{error}</FormAlert> : null}

          <PasswordField
            label="رمز عبور جدید"
            autoFocus
            autoComplete="new-password"
            placeholder="رمز عبور جدید"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
          <PasswordField
            label="تکرار رمز عبور جدید"
            autoComplete="new-password"
            placeholder="تکرار رمز عبور جدید"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            error={errors.confirm}
          />

          <PasswordRules value={password} />

          <GradientButton loading={loading}>{loading ? "در حال ذخیره…" : "ذخیره تغییرات"}</GradientButton>
        </form>
      </section>
    );
  }

  return (
    <section className="auth-card auth-rise">
      <Link href="/forgot-password/" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-foreground">
        <ArrowRight aria-hidden="true" className="h-4 w-4" />
        بازگشت
      </Link>

      <StatusIcon icon={MailCheck} />
      <div className="mt-6">
        <AuthHeading title="کد بازیابی را وارد کن">
          کد ۶ رقمی را به{" "}
          <bdi dir="ltr" className="font-bold text-foreground">
            {email}
          </bdi>{" "}
          فرستادیم. اگر حسابی با این ایمیل باشد، تا چند دقیقه‌ی دیگر می‌رسد.
        </AuthHeading>
      </div>

      <form onSubmit={onCodeSubmit} className="mt-7 space-y-5">
        {error ? <FormAlert>{error}</FormAlert> : null}

        <OtpInput value={code} onChange={setCode} hasError={Boolean(error)} />

        <div className="text-center text-sm">
          {seconds > 0 ? (
            <span className="text-muted">
              ارسال مجدد کد <bdi dir="ltr">({formatCountdown(seconds)})</bdi>
            </span>
          ) : (
            <button type="button" onClick={onResend} disabled={resending} className="font-bold text-primary hover:underline disabled:opacity-50">
              {resending ? "در حال ارسال…" : "ارسال مجدد کد"}
            </button>
          )}
        </div>

        <GradientButton disabled={code.length !== 6}>ادامه</GradientButton>
      </form>

      <p className="mt-6 text-center text-sm">
        <Link href="/forgot-password/" className="font-bold text-muted hover:text-foreground">
          تغییر ایمیل
        </Link>
      </p>
    </section>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
