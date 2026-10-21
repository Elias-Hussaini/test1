"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CircleCheck, MailCheck } from "lucide-react";
import { AuthHeading } from "@/components/auth/auth-heading";
import { FormAlert } from "@/components/auth/form-alert";
import { GradientButton } from "@/components/auth/gradient-button";
import { OtpInput } from "@/components/auth/otp-input";
import { StatusIcon } from "@/components/auth/status-icon";
import { formatCountdown, useCooldown } from "@/components/auth/use-cooldown";
import { ApiError, authApi } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";

export default function VerifyEmailPage() {
  const router = useRouter();
  const status = useAuthStore((s) => s.status);
  const user = useAuthStore((s) => s.user);
  const needsVerification = useAuthStore((s) => s.needsEmailVerification);
  const verifyEmail = useAuthStore((s) => s.verifyEmail);
  const loading = useAuthStore((s) => s.loading);
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);

  const [code, setCode] = useState("");
  const [done, setDone] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  // وقتی خودمان در حال تأیید هستیم، گارد «قبلاً تأیید شده» نباید صفحه‌ی موفقیت را دور بزند
  const submitting = useRef(false);
  // کد همین الان (هنگام ثبت‌نام) فرستاده شده؛ تا یک دقیقه ارسال دوباره بسته است
  const { seconds, start } = useCooldown(60);

  useEffect(() => {
    clearError();
  }, [clearError]);

  useEffect(() => {
    if (status === "anon") router.replace("/login/");
  }, [status, router]);

  // ایمیل از قبل تأیید شده بود
  useEffect(() => {
    if (status === "authed" && !needsVerification && !done && !submitting.current) router.replace("/dashboard/");
  }, [status, needsVerification, done, router]);

  useEffect(() => {
    if (!done) return;
    const id = setTimeout(() => router.replace("/dashboard/"), 1400);
    return () => clearTimeout(id);
  }, [done, router]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (code.length !== 6 || loading) return;
    clearError();
    submitting.current = true;
    const result = await verifyEmail(code);
    if (result.success) setDone(true);
    else {
      submitting.current = false;
      setCode("");
    }
  };

  const onResend = async () => {
    if (seconds > 0 || resending) return;
    setResending(true);
    setResendError(null);
    try {
      const result = await authApi.resendVerification();
      start(result.cooldownSeconds ?? 60);
    } catch (err) {
      if (err instanceof ApiError && err.code === "OTP_COOLDOWN") {
        const retry = (err.details as { retryAfterSeconds?: number } | undefined)?.retryAfterSeconds;
        start(retry ?? 60);
      } else {
        setResendError(err instanceof ApiError ? err.message : "ارسال دوباره انجام نشد.");
      }
    } finally {
      setResending(false);
    }
  };

  if (status === "loading") {
    return (
      <section className="auth-card" role="status" aria-live="polite">
        <p className="text-center text-sm text-muted">در حال بررسی نشست…</p>
      </section>
    );
  }

  if (done) {
    return (
      <section className="auth-card auth-rise text-center">
        <StatusIcon icon={CircleCheck} />
        <div className="mt-6">
          <AuthHeading title="ایمیلت تأیید شد!">در حال انتقال به LINGO…</AuthHeading>
        </div>
      </section>
    );
  }

  return (
    <section className="auth-card auth-rise">
      <Link href="/login/" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-foreground">
        <ArrowRight aria-hidden="true" className="h-4 w-4" />
        بازگشت
      </Link>

      <StatusIcon icon={MailCheck} />

      <div className="mt-6">
        <AuthHeading title="تأیید ایمیل">
          کد ۶ رقمی تأیید را به{" "}
          <bdi dir="ltr" className="font-bold text-foreground">
            {user?.email ?? "ایمیل شما"}
          </bdi>{" "}
          فرستادیم. لطفاً آن را وارد کن.
        </AuthHeading>
      </div>

      <form onSubmit={onSubmit} className="mt-7 space-y-5">
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
          {resendError ? <p role="alert" className="mt-2 text-xs text-danger">{resendError}</p> : null}
        </div>

        <GradientButton loading={loading} disabled={code.length !== 6}>
          {loading ? "در حال بررسی…" : "تأیید"}
        </GradientButton>
      </form>

      <p className="mt-6 text-center text-sm">
        <Link href="/dashboard/" className="font-bold text-muted hover:text-foreground">
          بعداً تأیید می‌کنم
        </Link>
      </p>
    </section>
  );
}
