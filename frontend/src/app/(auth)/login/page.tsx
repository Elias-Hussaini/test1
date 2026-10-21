"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/stores/auth-store";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthBrand } from "@/components/auth/AuthBrand";
import { AuthTabs } from "@/components/auth/AuthTabs";
import { AuthInput, PasswordInput } from "@/components/auth/AuthInput";
import { AuthButton } from "@/components/auth/AuthButton";
import { SocialLogin } from "@/components/auth/SocialLogin";

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    const result = await login(email, password);
    if (result.success) {
      router.push("/dashboard");
    }
  };

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full"
      >
        {/* Glass Card */}
        <div className="relative rounded-3xl border border-white/10 bg-[#080D25]/80 p-8 shadow-2xl backdrop-blur-xl">
          {/* Logo Section */}
          <div className="mb-8 text-center">
            <AuthBrand size="medium" className="mb-6" />
            <h1 className="text-xl font-medium text-white/90">
              به دنیای زبان خوش آمدید
            </h1>
          </div>

          {/* Tab Switcher */}
          <div className="mb-8">
            <AuthTabs activeTab="login" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
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

            {/* Password Input */}
            <PasswordInput
              label="رمز عبور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              icon={Lock}
              required
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 cursor-pointer rounded border-white/20 bg-white/5 text-[#713CFF] focus:ring-2 focus:ring-[#713CFF]/20"
                />
                <span className="font-medium text-white/70">
                  مرا به خاطر بسپار
                </span>
              </label>

              <Link
                href="/forgot-password"
                className="font-bold text-[#713CFF] hover:text-[#28C7E8]"
              >
                رمز عبور را فراموش کردید؟
              </Link>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <AuthButton type="submit" loading={loading} showArrow>
              ورود
            </AuthButton>
          </form>

          {/* Social Login */}
          <div className="mt-8">
            <SocialLogin />
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-white/50">
            حساب کاربری ندارید؟{" "}
            <Link
              href="/register"
              className="font-bold text-[#713CFF] hover:text-[#28C7E8]"
            >
              ثبت‌نام کنید
            </Link>
          </p>
        </div>
      </motion.div>
    </AuthLayout>
  );
}
