"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft, ShieldCheck, User } from "lucide-react";
import { motion } from "framer-motion";
import { AuthInput, PasswordInput } from "@/components/auth/auth-input";
import { AuthButton } from "@/components/auth/auth-button";
import { Divider, SocialButton } from "@/components/auth/auth-divider";
import { useAuthStore } from "@/stores/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const { login, loginAsGuest, loading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    const result = await login(email, password);
    if (result.success) {
      router.push("/dashboard/");
    }
  };

  const handleGuest = async () => {
    clearError();
    const result = await loginAsGuest();
    if (result.success) {
      router.push("/dashboard/");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-strong rounded-3xl p-6 sm:p-8"
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-black tracking-tight">
          ورود به <span className="gradient-text-purple">LINGO</span>
        </h2>
        <p className="mt-1.5 text-sm text-muted">
          حساب نداری؟{" "}
          <Link
            href="/register/"
            className="font-semibold text-primary hover:underline"
          >
            ثبت‌نام کن
          </Link>
        </p>
      </div>

      {/* Social */}
      <div className="mb-5 flex gap-3">
        <SocialButton provider="google">
          گوگل
        </SocialButton>
        <SocialButton provider="github">
          گیت‌هاب
        </SocialButton>
      </div>

      <Divider label="یا با ایمیل" className="my-5" />

      {/* Form */}
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

        <div>
          <PasswordInput
            label="رمز عبور"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <div className="mt-2 flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs text-muted">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-[var(--primary)]"
              />
              مرا به خاطر بسپار
            </label>
            <Link
              href="/forgot-password/"
              className="text-xs font-medium text-muted hover:text-primary"
            >
              رمز را فراموش کردی؟
            </Link>
          </div>
        </div>

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
          ورود
        </AuthButton>
      </form>

      {/* Guest login */}
      <div className="mt-5">
        <Divider className="my-4" />
        <AuthButton
          variant="secondary"
          onClick={handleGuest}
          disabled={loading}
          icon={<User className="h-4 w-4" />}
          size="md"
          className="w-full"
        >
          ورود به‌عنوان مهمان
        </AuthButton>
      </div>

      {/* Security note */}
      <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-muted">
        <ShieldCheck className="h-3.5 w-3.5 text-success" />
        ورود امن با رمزنگاری SSL
      </p>
    </motion.div>
  );
}
