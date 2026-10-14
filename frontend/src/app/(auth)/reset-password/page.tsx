"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { PasswordInput } from "@/components/auth/auth-input";
import { AuthButton } from "@/components/auth/auth-button";
import { OtpInput } from "@/components/auth/otp-input";
import { authApi } from "@/lib/api";
import { Check } from "lucide-react";

type Stage = "code" | "password" | "done";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") ?? "";

  const [stage, setStage] = useState<Stage>("code");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordMismatch = confirmPassword && confirmPassword !== newPassword;
  const passwordValid = newPassword.length >= 8;

  const handleCodeSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError("کد باید ۶ رقم باشد.");
      return;
    }
    setError(null);
    setStage("password");
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!passwordValid || passwordMismatch) return;

    setError(null);
    setLoading(true);

    try {
      await authApi.resetPassword({ code, newPassword });
      setStage("done");
    } catch (err) {
      const error = err as { message?: string };
      setError(error.message ?? "خطا در تغییر رمز.");
    } finally {
      setLoading(false);
    }
  };

  if (stage === "done") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="glass-strong rounded-3xl p-6 sm:p-8 text-center"
      >
        <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-success">
          <CheckCircle2 className="h-8 w-8" />
        </span>

        <h2 className="text-2xl font-black">رمز تغییر کرد!</h2>
        <p className="mt-2 text-sm text-muted">
          حالا با رمز جدید می‌تونی وارد بشی.
        </p>

        <div className="mt-6">
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
            disabled={!passwordValid || passwordMismatch}
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

function PasswordRule({ ok, children }: { ok: boolean; children: React.ReactNode }) {
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
