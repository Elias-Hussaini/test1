"use client";

import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, RefreshCw, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { AuthButton } from "@/components/auth/auth-button";
import { OtpInput } from "@/components/auth/otp-input";
import { useAuthStore } from "@/stores/auth-store";
import { authApi } from "@/lib/api";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { user, accessToken, verifyEmail, loading, error, clearError } =
    useAuthStore();

  const [code, setCode] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  // اگه کاربر وارد نشده، برگردان به login
  useEffect(() => {
    if (!accessToken) {
      router.push("/login/");
    }
  }, [accessToken, router]);

  // cooldown برای resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendCooldown]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return;
    clearError();
    const result = await verifyEmail(code);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => router.push("/dashboard/"), 1500);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || !accessToken) return;
    setResendLoading(true);
    try {
      await authApi.resendVerification();
      setResendCooldown(60);
    } catch {
      // ignore
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
