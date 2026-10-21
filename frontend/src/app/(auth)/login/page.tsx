"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/stores/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    const result = await login(email, password);
    if (result.success) {
      router.push("/dashboard/");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md"
    >
      {/* Glass Card with Glow */}
      <div className="group relative">
        {/* Glow Effect */}
        <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-[#7567F8] via-purple-600 to-[#28C7E8] opacity-20 blur-2xl transition-opacity group-hover:opacity-30" />

        {/* Main Card */}
        <div className="relative rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-8 shadow-2xl backdrop-blur-2xl">
          {/* Logo Section */}
          <div className="mb-8 text-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="relative mx-auto mb-6 inline-block"
            >
              <div className="absolute inset-0 animate-pulse rounded-3xl bg-gradient-to-r from-[#7567F8] to-[#28C7E8] opacity-50 blur-2xl" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#7567F8] via-purple-600 to-[#28C7E8] text-3xl font-black text-white shadow-2xl shadow-purple-500/50">
                L
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-2 bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-3xl font-black tracking-tight text-transparent"
            >
              به LINGO خوش آمدید
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm font-medium text-white/60"
            >
              به دنیای زبان خوش آمدید
            </motion.p>
          </div>

          {/* Tab Switcher */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8 flex gap-2 rounded-2xl bg-white/5 p-1.5 backdrop-blur-sm"
          >
            <Link
              href="/register/"
              className="flex-1 rounded-xl px-4 py-3 text-center text-sm font-bold text-white/50 transition-all hover:bg-white/5 hover:text-white/80"
            >
              ثبت‌نام
            </Link>
            <motion.div
              layoutId="activeTab"
              className="flex-1 rounded-xl bg-gradient-to-r from-[#7567F8] to-purple-600 px-4 py-3 text-center text-sm font-bold text-white shadow-lg shadow-[#7567F8]/30"
            >
              ورود
            </motion.div>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="mb-2.5 block text-sm font-bold text-white/90">
                ایمیل یا شماره موبایل
              </label>
              <div className="group relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#7567F8]/20 to-[#28C7E8]/20 opacity-0 blur-xl transition-opacity group-focus-within:opacity-100" />
                <div className="relative flex items-center">
                  <Mail className="absolute right-4 h-5 w-5 text-white/40 transition-colors group-focus-within:text-[#7567F8]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    dir="ltr"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pr-12 pl-4 font-medium text-white placeholder-white/30 backdrop-blur-xl transition-all focus:border-[#7567F8]/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#7567F8]/20"
                  />
                </div>
              </div>
            </motion.div>

            {/* Password Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label className="mb-2.5 block text-sm font-bold text-white/90">
                رمز عبور
              </label>
              <div className="group relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#7567F8]/20 to-[#28C7E8]/20 opacity-0 blur-xl transition-opacity group-focus-within:opacity-100" />
                <div className="relative flex items-center">
                  <Lock className="absolute right-4 h-5 w-5 text-white/40 transition-colors group-focus-within:text-[#7567F8]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pr-12 pl-12 font-medium text-white placeholder-white/30 backdrop-blur-xl transition-all focus:border-[#7567F8]/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#7567F8]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-4 text-white/40 transition-colors hover:text-white/80"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Forgot Password */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex justify-end"
            >
              <Link
                href="/forgot-password/"
                className="text-sm font-bold text-[#7567F8] transition-colors hover:text-[#28C7E8]"
              >
                رمز عبور را فراموش کردید؟
              </Link>
            </motion.div>

            {/* Error Message */}
            {error ? (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3.5 text-sm font-medium text-red-300 backdrop-blur-xl"
              >
                {error}
              </motion.div>
            ) : null}

            {/* Submit Button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#7567F8] via-purple-600 to-[#28C7E8] p-[2px] shadow-2xl shadow-[#7567F8]/40 transition-all hover:shadow-[#7567F8]/60 disabled:opacity-50"
            >
              <div className="relative flex items-center justify-center gap-2 rounded-[calc(1rem-2px)] bg-gradient-to-r from-[#7567F8] via-purple-600 to-[#28C7E8] px-6 py-4 font-bold text-white">
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <>
                    <span className="text-base">ورود</span>
                    <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                  </>
                )}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </div>
            </motion.button>
          </form>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="my-8 flex items-center gap-4"
          >
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <span className="text-sm font-medium text-white/40">یا ورود با</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </motion.div>

          {/* Social Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex gap-3"
          >
            {[
              {
                name: "Google",
                icon: (
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                ),
              },
              {
                name: "Apple",
                icon: (
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                ),
              },
              {
                name: "Telegram",
                icon: (
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                  </svg>
                ),
              },
            ].map((social, i) => (
              <motion.button
                key={social.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + i * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group relative flex-1 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/10"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#7567F8]/0 via-[#7567F8]/10 to-[#28C7E8]/0 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative text-white">{social.icon}</div>
              </motion.button>
            ))}
          </motion.div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-8 text-center text-sm text-white/50"
          >
            حساب کاربری ندارید؟{" "}
            <Link
              href="/register/"
              className="font-bold text-[#7567F8] transition-colors hover:text-[#28C7E8]"
            >
              ثبت‌نام کنید
            </Link>
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
