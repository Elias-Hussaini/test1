"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthBrand } from "@/components/auth/AuthBrand";
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthButton } from "@/components/auth/AuthButton";
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
      setError(error.message ?? "خطا در ارسال کد بازیابی");
    } finally {
      setLoading(false);
    }
  };

  if (stage === "sent") {
    return (
      <AuthLayout showWelcomePanel={false}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full"
        >
          <div className="relative rounded-3xl border border-white/10 bg-[#080D25]/80 p-8 text-center shadow-2xl backdrop-blur-xl">
            {/* Success icon */}
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#28C7E8]/20">
              <svg className="h-10 w-10 text-[#28C7E8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="mb-3 text-2xl font-black text-white">ایمیل ارسال شد</h2>
            <p className="mb-6 text-sm text-white/70">
              کد بازیابی به{" "}
              <span className="font-bold text-white" dir="ltr">
                {email}
              </span>{" "}
              ارسال شد
            </p>

            <AuthButton
              onClick={() => router.push(`/reset-password?email=${encodeURIComponent(email)}`)}
              showArrow
            >
              ادامه
            </AuthButton>

            <button
              onClick={() => setStage("request")}
              className="mt-4 text-sm text-white/60 hover:text-white"
            >
              تغییر ایمیل
            </button>
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
          {/* Back button */}
          <Link
            href="/login"
            className="mb-6 inline-flex items-center gap-2 text-sm text-white/60 hover:text-white"
          >
            <ArrowRight className="h-4 w-4" />
            بازگشت
          </Link>

          {/* Logo and title */}
          <div className="mb-8 text-center">
            <AuthBrand size="medium" className="mb-6" />
            <h1 className="mb-2 text-2xl font-black text-white">بازیابی رمز عبور</h1>
            <p className="text-sm text-white/70">
              ایمیل خود را وارد کنید تا کد بازیابی برایتان ارسال شود
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <AuthInput
              label="ایمیل یا شماره موبایل"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              icon={Mail}
              required
              dir="ltr"
            />

            {error && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300">
                {error}
              </div>
            )}

            <AuthButton type="submit" loading={loading} showArrow>
              ارسال لینک بازیابی
            </AuthButton>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-white/50">
            <Link href="/login" className="font-bold text-[#713CFF] hover:text-[#28C7E8]">
              بازگشت به ورود
            </Link>
          </p>
        </div>
      </motion.div>
    </AuthLayout>
  );
}
