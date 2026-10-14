"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthButton } from "@/components/auth/auth-button";
import { authApi } from "@/lib/api";

type Stage = "request" | "sent";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("request");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await authApi.requestPasswordReset(email);
      setStage("sent");
    } catch (err) {
      const error = err as { message?: string };
      setError(error.message ?? "خطا در ارسال کد.");
    } finally {
      setLoading(false);
    }
  };

  if (stage === "sent") {
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

        <h2 className="text-2xl font-black">ایمیل را بررسی کن</h2>
        <p className="mt-2 text-sm text-muted">
          کد تأیید ۶ رقمی به{" "}
          <span dir="ltr" className="font-bold text-foreground">
            {email}
          </span>{" "}
          ارسال شد.
        </p>

        <div className="mt-6 space-y-3">
          <AuthButton
            onClick={() => router.push(`/reset-password/?email=${encodeURIComponent(email)}`)}
            className="w-full"
            icon={<ArrowLeft className="h-5 w-5" />}
          >
            ادامه — وارد کردن کد
          </AuthButton>

          <button
            type="button"
            onClick={() => setStage("request")}
            className="text-xs font-medium text-muted hover:text-primary"
          >
            ایمیل اشتباه بود؟ تغییر ایمیل
          </button>
        </div>

        <p className="mt-6 text-xs text-muted">
          کد تا ۱۰ دقیقه معتبر است
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
      <div className="mb-6">
        <h2 className="text-2xl font-black tracking-tight">
          بازیابی <span className="gradient-text-purple">رمز عبور</span>
        </h2>
        <p className="mt-1.5 text-sm text-muted">
          ایمیلت رو وارد کن تا کد تأیید برات بفرستیم.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          id="email"
          type="email"
          label="ایمیل"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="h-5 w-5" />}
          dir="ltr"
          required
          autoComplete="email"
          autoFocus
        />

        {error ? (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger animate-shake"
          >
            {error}
          </motion.div>
        ) : null}

        <AuthButton
          type="submit"
          loading={loading}
          icon={<ArrowLeft className="h-5 w-5" />}
          className="w-full"
        >
          ارسال کد بازیابی
        </AuthButton>
      </form>

      <Link
        href="/login/"
        className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium text-muted transition-colors hover:text-primary"
      >
        <ArrowRight className="h-3.5 w-3.5" />
        بازگشت به ورود
      </Link>
    </motion.div>
  );
}
