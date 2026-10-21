"use client";

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthBrand } from "@/components/auth/AuthBrand";
import { PasswordInput } from "@/components/auth/AuthInput";
import { AuthButton } from "@/components/auth/AuthButton";
import { OTPInput } from "@/components/auth/OTPInput";
import { authApi } from "@/lib/api";

type Stage = "code" | "password" | "done";

function ResetPasswordContent() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") ?? "";

  const [stage, setStage] = useState<Stage>("code");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordValid = newPassword.length >= 8;
  const passwordsMatch = newPassword === confirmPassword;

  const handleCodeSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError("کد باید ۶ رقم باشد");
      return;
    }
    setError(null);
    setStage("password");
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!passwordValid) {
      setError("رمز عبور باید حداقل ۸ کاراکتر باشد");
      return;
    }

    if (!passwordsMatch) {
      setError("رمز عبور و تکرار آن یکسان نیستند");
      return;
    }

    if (!email) {
      setError("ایمیل یافت نشد");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await authApi.resetPassword({ email, code, newPassword });
      setStage("done");
    } catch (err) {
      const error = err as { message?: string };
      setError(error.message ?? "خطا در تغییر رمز عبور");
    } finally {
      setLoading(false);
    }
  };

  // Success stage
  if (stage === "done") {
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

            <h2 className="mb-3 text-2xl font-black text-white">رمز عبور تغییر کرد!</h2>
            <p className="mb-6 text-sm text-white/70">
              حالا می‌توانید با رمز جدید وارد شوید
            </p>

            <AuthButton onClick={() => router.push("/login")} showArrow>
              ورود به حساب
            </AuthButton>
          </div>
        </motion.div>
      </AuthLayout>
    );
  }

  // Code entry stage
  if (stage === "code") {
    return (
      <AuthLayout showWelcomePanel={false}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full"
        >
          <div className="relative rounded-3xl border border-white/10 bg-[#080D25]/80 p-8 shadow-2xl backdrop-blur-xl">
            {/* Icon */}
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 animate-pulse rounded-full bg-[#713CFF] opacity-50 blur-2xl" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#713CFF]/20">
                  <Lock className="h-10 w-10 text-[#713CFF]" />
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-2xl font-black text-white">کد بازیابی</h1>
              <p className="text-sm text-white/70">
                کد ۶ رقمی ارسال شده به ایمیل را وارد کنید
              </p>
            </div>

            {/* OTP Form */}
            <form onSubmit={handleCodeSubmit} className="space-y-6">
              <OTPInput length={6} value={code} onChange={setCode} error={!!error} />

              {error && (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm font-medium text-red-300">
                  {error}
                </div>
              )}

              <AuthButton type="submit" disabled={code.length !== 6} showArrow>
                تأیید کد
              </AuthButton>
            </form>
          </div>
        </motion.div>
      </AuthLayout>
    );
  }

  // Password entry stage
  return (
    <AuthLayout showWelcomePanel={false}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full"
      >
        <div className="relative rounded-3xl border border-white/10 bg-[#080D25]/80 p-8 shadow-2xl backdrop-blur-xl">
          {/* Title */}
          <div className="mb-8 text-center">
            <AuthBrand size="medium" className="mb-6" />
            <h1 className="mb-2 text-2xl font-black text-white">تنظیم رمز عبور جدید</h1>
            <p className="text-sm text-white/70">رمز عبور جدید خود را وارد کنید</p>
          </div>

          {/* Form */}
          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            <PasswordInput
              label="رمز عبور جدید"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              icon={Lock}
              required
            />

            <PasswordInput
              label="تکرار رمز عبور جدید"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              icon={Lock}
              required
            />

            {/* Password hints */}
            {newPassword && (
              <div className="space-y-2 text-xs">
                <div className={`flex items-center gap-2 ${passwordValid ? "text-[#28C7E8]" : "text-white/40"}`}>
                  <div className={`h-1.5 w-1.5 rounded-full ${passwordValid ? "bg-[#28C7E8]" : "bg-white/20"}`} />
                  حداقل ۸ کاراکتر
                </div>
                {confirmPassword && (
                  <div className={`flex items-center gap-2 ${passwordsMatch ? "text-[#28C7E8]" : "text-red-400"}`}>
                    <div className={`h-1.5 w-1.5 rounded-full ${passwordsMatch ? "bg-[#28C7E8]" : "bg-red-400"}`} />
                    {passwordsMatch ? "رمزها یکسان هستند" : "رمزها یکسان نیستند"}
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300">
                {error}
              </div>
            )}

            <AuthButton
              type="submit"
              loading={loading}
              disabled={!passwordValid || !passwordsMatch}
              showArrow
            >
              ذخیره تغییرات
            </AuthButton>
          </form>
        </div>
      </motion.div>
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
          <AuthButton
            onClick={() => router.push("/login/")}
            className="w-full"
            icon={<ArrowLeft className="h-5 w-5" />}
          >
            ورود به LINGO
          </AuthButton>
        </div>
      </motion.div>
    );
  }

  if (stage === "password") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-strong rounded-3xl p-6 sm:p-8"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-black tracking-tight">رمز جدید</h2>
          <p className="mt-1.5 text-sm text-muted">
            یک رمز قوی و جدید وارد کن.
          </p>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <PasswordInput
            label="رمز جدید"
            placeholder="حداقل ۸ کاراکتر"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            autoComplete="new-password"
            error={!passwordValid && newPassword ? "حداقل ۸ کاراکتر" : null}
          />

          {newPassword ? (
            <div className="grid grid-cols-2 gap-2 text-xs text-muted">
              <PasswordRule ok={newPassword.length >= 8}>حداقل ۸ کاراکتر</PasswordRule>
              <PasswordRule ok={/[a-z]/.test(newPassword)}>حرف کوچک</PasswordRule>
              <PasswordRule ok={/[A-Z]/.test(newPassword)}>حرف بزرگ</PasswordRule>
              <PasswordRule ok={/[0-9]/.test(newPassword)}>عدد</PasswordRule>
            </div>
          ) : null}

          <PasswordInput
            label="تکرار رمز جدید"
            placeholder="رمز را دوباره وارد کن"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            error={passwordMismatch ? "رمزها مطابقت ندارند" : null}
          />

          {error ? (
            <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
              {error}
            </div>
          ) : null}

          <AuthButton
            type="submit"
            loading={loading}
            disabled={!passwordValid || !!passwordMismatch}
            className="w-full"
            icon={<ArrowLeft className="h-5 w-5" />}
          >
            تغییر رمز
          </AuthButton>
        </form>

        <button
          type="button"
          onClick={() => setStage("code")}
          className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-primary"
        >
          <ArrowRight className="h-3.5 w-3.5" />
          تغییر کد
        </button>
      </motion.div>
    );
  }

  // stage === "code"
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-strong rounded-3xl p-6 sm:p-8"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-black tracking-tight">
          کد <span className="gradient-text-purple">تأیید</span>
        </h2>
        <p className="mt-1.5 text-sm text-muted">
          کد ۶ رقمی که به ایمیلت ارسال شد را وارد کن.
        </p>
        {email ? (
          <p className="mt-2 text-xs text-muted">
            ایمیل:{" "}
            <span dir="ltr" className="font-bold text-foreground">
              {email}
            </span>
          </p>
        ) : null}
      </div>

      <form onSubmit={handleCodeSubmit} className="space-y-6">
        <div>
          <label className="mb-3 block text-sm font-semibold text-foreground">
            کد تأیید
          </label>
          <OtpInput
            value={code}
            onChange={setCode}
            hasError={!!error}
          />
        </div>

        {error ? (
          <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        ) : null}

        <AuthButton
          type="submit"
          disabled={code.length !== 6}
          className="w-full"
          icon={<ArrowLeft className="h-5 w-5" />}
        >
          ادامه
        </AuthButton>
      </form>

      <div className="mt-6 flex items-center justify-between text-xs">
        <Link
          href="/forgot-password/"
          className="font-medium text-muted hover:text-primary"
        >
          ارسال مجدد کد
        </Link>
        <Link
          href="/login/"
          className="font-medium text-muted hover:text-primary"
        >
          بازگشت به ورود
        </Link>
      </div>
    </motion.div>
  );
}

function PasswordRule({ ok, children }: { ok: boolean; children: ReactNode }) {
  return (
    <div className={`flex items-center gap-1.5 ${ok ? "text-success" : ""}`}>
      <span
        className={`flex h-4 w-4 items-center justify-center rounded-full ${
          ok ? "bg-success text-white" : "bg-muted text-muted"
        }`}
      >
        {ok ? <Check className="h-2.5 w-2.5" /> : null}
      </span>
      {children}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="glass-strong rounded-3xl p-8 text-center">
          <span className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
