"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/stores/auth-store";

export default function RegisterPage() {
  const router = useRouter();
  const { register, loading, error, clearError } = useAuthStore();

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const usernameValid = !username || /^[a-zA-Z0-9_]{3,30}$/.test(username);
  const emailValid = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordValid = !password || password.length >= 8;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();

    if (!usernameValid || !emailValid || !passwordValid) return;

    const result = await register({
      email,
      password,
      username,
      firstName: firstName || undefined,
    });

    if (result.success) {
      if (result.needsVerification) {
        router.push("/verify-email/");
      } else {
        router.push("/dashboard/");
      }
    }
  };

  return (
    <div className="w-full rounded-3xl border border-white/10 bg-[#0a0515]/60 p-8 shadow-2xl backdrop-blur-xl">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7567F8] to-[#28C7E8] text-2xl font-black text-white shadow-lg shadow-[#7567F8]/30">
          L
        </div>
        <h1 className="text-2xl font-black text-white">LINGO</h1>
        <p className="mt-1 text-sm text-white/60">همین حالا ثبت‌نام کنید</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 rounded-2xl bg-white/5 p-1.5">
        <div className="flex-1 rounded-xl bg-[#7567F8] px-4 py-2.5 text-center text-sm font-semibold text-white shadow-lg shadow-[#7567F8]/30">
          ثبت‌نام
        </div>
        <Link
          href="/login/"
          className="flex-1 rounded-xl px-4 py-2.5 text-center text-sm font-semibold text-white/60 transition-all hover:text-white"
        >
          ورود
        </Link>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-white/80">
            نام و نام خانوادگی
          </label>
          <div className="relative">
            <User className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="مثلاً احمد رضایی"
              required
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pr-12 pl-4 text-white placeholder-white/30 backdrop-blur-sm transition-all focus:border-[#7567F8] focus:bg-white/10 focus:outline-none"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-white/80">
            ایمیل یا شماره موبایل
          </label>
          <div className="relative">
            <Mail className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              dir="ltr"
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pr-12 pl-4 text-white placeholder-white/30 backdrop-blur-sm transition-all focus:border-[#7567F8] focus:bg-white/10 focus:outline-none"
            />
          </div>
          {!emailValid && email ? (
            <p className="mt-1.5 text-xs text-red-400">ایمیل نامعتبر است</p>
          ) : null}
        </div>

        {/* Username */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-white/80">
            نام کاربری
          </label>
          <div className="relative">
            <User className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ahmad_rezaei"
              required
              dir="ltr"
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pr-12 pl-4 text-white placeholder-white/30 backdrop-blur-sm transition-all focus:border-[#7567F8] focus:bg-white/10 focus:outline-none"
            />
          </div>
          {!usernameValid && username ? (
            <p className="mt-1.5 text-xs text-red-400">فقط حروف انگلیسی، عدد و _ (۳-۳۰ کاراکتر)</p>
          ) : null}
        </div>

        {/* Password */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-white/80">
            رمز عبور
          </label>
          <div className="relative">
            <Lock className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="حداقل ۸ کاراکتر"
              required
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pr-12 pl-4 text-white placeholder-white/30 backdrop-blur-sm transition-all focus:border-[#7567F8] focus:bg-white/10 focus:outline-none"
            />
          </div>
        </div>

        {/* Password hints */}
        {password ? (
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className={`flex items-center gap-1.5 ${password.length >= 8 ? "text-[#28C7E8]" : "text-white/40"}`}>
              <div className={`h-1.5 w-1.5 rounded-full ${password.length >= 8 ? "bg-[#28C7E8]" : "bg-white/20"}`} />
              حداقل ۸ کاراکتر
            </div>
            <div className={`flex items-center gap-1.5 ${/[a-z]/.test(password) ? "text-[#28C7E8]" : "text-white/40"}`}>
              <div className={`h-1.5 w-1.5 rounded-full ${/[a-z]/.test(password) ? "bg-[#28C7E8]" : "bg-white/20"}`} />
              حرف کوچک
            </div>
            <div className={`flex items-center gap-1.5 ${/[A-Z]/.test(password) ? "text-[#28C7E8]" : "text-white/40"}`}>
              <div className={`h-1.5 w-1.5 rounded-full ${/[A-Z]/.test(password) ? "bg-[#28C7E8]" : "bg-white/20"}`} />
              حرف بزرگ
            </div>
            <div className={`flex items-center gap-1.5 ${/[0-9]/.test(password) ? "text-[#28C7E8]" : "text-white/40"}`}>
              <div className={`h-1.5 w-1.5 rounded-full ${/[0-9]/.test(password) ? "bg-[#28C7E8]" : "bg-white/20"}`} />
              عدد
            </div>
          </div>
        ) : null}

        {/* Terms */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/60">
          با ایستادن موافقت می‌کنید با{" "}
          <Link href="/terms/" className="text-[#7567F8] hover:text-[#28C7E8]">
            شرایط استفاده
          </Link>{" "}
          و{" "}
          <Link href="/privacy/" className="text-[#7567F8] hover:text-[#28C7E8]">
            سیاست حریم خصوصی
          </Link>
        </div>

        {/* Error */}
        {error ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
          >
            {error}
          </motion.div>
        ) : null}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !usernameValid || !emailValid || !passwordValid}
          className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#7567F8] to-[#28C7E8] py-3.5 font-bold text-white shadow-lg shadow-[#7567F8]/30 transition-all hover:shadow-xl hover:shadow-[#7567F8]/40 disabled:opacity-50"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {loading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <>
                ثبت‌نام
                <ArrowLeft className="h-5 w-5" />
              </>
            )}
          </span>
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
        </button>
      </form>

      {/* Divider */}
      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-sm text-white/40">یا ورود با</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      {/* Social */}
      <div className="flex gap-3">
        <button className="flex-1 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm transition-all hover:bg-white/10">
          <svg className="mx-auto h-6 w-6" viewBox="0 0 24 24">
            <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        </button>
        <button className="flex-1 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm transition-all hover:bg-white/10">
          <svg className="mx-auto h-6 w-6" viewBox="0 0 24 24" fill="#fff">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
          </svg>
        </button>
        <button className="flex-1 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm transition-all hover:bg-white/10">
          <svg className="mx-auto h-6 w-6" viewBox="0 0 24 24" fill="#fff">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
          </svg>
        </button>
      </div>

      {/* Footer */}
      <p className="mt-6 text-center text-sm text-white/50">
        حساب کاربری دارید؟{" "}
        <Link href="/login/" className="font-semibold text-[#7567F8] hover:text-[#28C7E8] transition-colors">
          وارد شوید
        </Link>
      </p>
    </div>
  );
}
