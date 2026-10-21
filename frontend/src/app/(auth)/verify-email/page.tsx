"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthBrand } from "@/components/auth/AuthBrand";
import { AuthButton } from "@/components/auth/AuthButton";
import { OTPInput } from "@/components/auth/OTPInput";
import { useAuthStore } from "@/stores/auth-store";
import { authApi } from "@/lib/api";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { status, user, verifyEmail, loading } = useAuthStore();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [resendLoading, setResendLoading] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "anon") {
      router.push("/login");
    }
  }, [status, router]);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return;

    setError("");
    const result = await verifyEmail(code);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 1500);
    } else {
      setError("کد تأیید نامعتبر است");
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || !user?.email) return;

    setResendLoading(true);
    setError("");

    try {
      await authApi.resendVerification(user.email);
      setResendCooldown(60);
    } catch (err) {
      setError("خطا در ارسال مجدد کد");
    } finally {
      setResendLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout showWelcomePanel={false}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full text-center"
        >
          <div className="relative rounded-3xl border border-white/10 bg-[#080D25]/80 p-8 shadow-2xl backdrop-blur-xl">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#28C7E8]/20">
              <svg className="h-10 w-10 text-[#28C7E8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-white">تأیید شد!</h2>
            <p className="mt-2 text-sm text-white/70">در حال انتقال به داشبورد...</p>
          </div>
        </motion.div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout showWelcomePanel={false}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full"
      >
        <div className="relative rounded-3xl border border-white/10 bg-[#080D25]/80 p-8 shadow-2xl backdrop-blur-xl">
          {/* Email illustration */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse rounded-full bg-[#713CFF] opacity-50 blur-2xl" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#713CFF]/20">
                <Mail className="h-10 w-10 text-[#713CFF]" />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-2xl font-black text-white">تأیید ایمیل</h1>
            <p className="text-sm text-white/70">
              کد ۶ رقمی به{" "}
              <span className="font-bold text-white" dir="ltr">
                {user?.email}
              </span>{" "}
              ارسال شد
            </p>
          </div>

          {/* OTP Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <OTPInput
              length={6}
              value={code}
              onChange={setCode}
              error={!!error}
            />

            {/* Timer and Resend */}
            <div className="text-center text-sm">
              {resendCooldown > 0 ? (
                <p className="text-white/60">
                  ارسال مجدد در{" "}
                  <span className="font-bold text-white" dir="ltr">
                    00:{resendCooldown.toString().padStart(2, "0")}
                  </span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="font-bold text-[#713CFF] hover:text-[#28C7E8] disabled:opacity-50"
                >
                  {resendLoading ? "در حال ارسال..." : "ارسال مجدد کد"}
                </button>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm font-medium text-red-300">
                {error}
              </div>
            )}

            {/* Submit */}
            <AuthButton
              type="submit"
              loading={loading}
              disabled={code.length !== 6}
              showArrow
            >
              تأیید
            </AuthButton>
          </form>

          {/* Change email */}
          <p className="mt-6 text-center text-sm text-white/50">
            <button
              onClick={() => router.push("/register")}
              className="font-bold text-[#713CFF] hover:text-[#28C7E8]"
            >
              تغییر ایمیل
            </button>
          </p>
        </div>
      </motion.div>
    </AuthLayout>
  );
}
    setResendLoading(true);
    try {
      const result = await authApi.resendVerification();
      // بررسی cooldown از سرور
      if (result.cooldownSeconds) {
        setResendCooldown(result.cooldownSeconds);
      } else {
        setResendCooldown(60);
      }
    } catch (err: unknown) {
      const error = err as { statusCode?: number; details?: { retryAfterSeconds?: number } };
      // اگر 429 برگشت، cooldown را از details بگیر
      if (error.statusCode === 429 && error.details?.retryAfterSeconds) {
        setResendCooldown(error.details.retryAfterSeconds);
      }
    } finally {
      setResendLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="glass-strong rounded-3xl p-6 sm:p-8 text-center"
      >
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring" }}
          className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-success"
        >
          <CheckCircle2 className="h-8 w-8" />
        </motion.span>

        <h2 className="text-2xl font-black">ایمیل تأیید شد!</h2>
        <p className="mt-2 text-sm text-muted">
          در حال انتقال به داشبورد...
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-strong rounded-3xl p-6 sm:p-8"
    >
      <div className="mb-6 text-center">
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
          <Mail className="h-7 w-7" />
        </span>
        <h2 className="text-2xl font-black tracking-tight">
          تأیید <span className="gradient-text-purple">ایمیل</span>
        </h2>
        <p className="mt-2 text-sm text-muted">
          کد ۶ رقمی به ایمیلت ارسال شد.
        </p>
        {user?.email ? (
          <p className="mt-1 text-xs">
            <span dir="ltr" className="font-bold text-foreground">
              {user.email}
            </span>
          </p>
        ) : null}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="mb-3 block text-center text-sm font-semibold text-foreground">
            کد تأیید را وارد کن
          </label>
          <OtpInput
            value={code}
            onChange={setCode}
            hasError={!!error}
          />
        </div>

        {error ? (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-center text-sm text-danger animate-shake"
          >
            {error}
          </motion.div>
        ) : null}

        <AuthButton
          type="submit"
          loading={loading}
          disabled={code.length !== 6}
          className="w-full"
          icon={<ArrowLeft className="h-5 w-5" />}
        >
          تأیید ایمیل
        </AuthButton>
      </form>

      <div className="mt-6 flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={handleResend}
          disabled={resendCooldown > 0 || resendLoading}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted transition-colors hover:text-primary disabled:opacity-50"
        >
          {resendLoading ? (
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" />
          )}
          {resendCooldown > 0
            ? `ارسال مجدد در ${resendCooldown} ثانیه`
            : "ارسال مجدد کد"}
        </button>

        <Link
          href="/login/"
          className="text-xs font-medium text-muted hover:text-primary"
        >
          بازگشت به ورود
        </Link>
      </div>

      <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-3 text-center text-xs text-muted">
        💡 در حالت توسعه، کد ممکن است در لاگ سرور چاپ شود.
      </div>
    </motion.div>
  );
}
