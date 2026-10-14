"use client";

import { useState, type FormEvent } from "react";
import { Mail, Lock, ArrowLeft, Eye, EyeOff, ShieldCheck, AlertCircle } from "lucide-react";
import { useAdminStore } from "@/lib/admin-store";

export function AdminLogin() {
  const { login, authLoading, authError } = useAdminStore();
  const [email, setEmail] = useState("admin@lingo.app");
  const [password, setPassword] = useState("Lingo@Admin2026");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      {/* Subtle background — only here, only soft */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(117, 103, 248, 0.10), transparent 70%)," +
            "radial-gradient(ellipse 50% 40% at 100% 100%, rgba(40, 199, 232, 0.06), transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div
            className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl font-black text-white shadow-2xl shadow-primary/40"
            style={{
              backgroundImage: "linear-gradient(135deg, var(--primary), var(--secondary-c))",
            }}
          >
            L
          </div>
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
            <span className="gradient-text">LINGO</span> Admin
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            برای ورود به پنل مدیریت، اطلاعات حساب را وارد کنید.
          </p>
        </div>

        {/* Form card — clean, not glassy per spec */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-lg sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold">
                ایمیل
              </label>
              <div className="group relative">
                <Mail
                  className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary"
                  aria-hidden="true"
                />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  dir="ltr"
                  placeholder="admin@lingo.app"
                  className="h-12 w-full rounded-xl border border-input bg-background px-11 pl-4 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-semibold">
                  رمز عبور
                </label>
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:text-primary"
                >
                  فراموشی رمز؟
                </button>
              </div>
              <div className="group relative">
                <Lock
                  className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary"
                  aria-hidden="true"
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  dir="ltr"
                  placeholder="••••••••"
                  className="h-12 w-full rounded-xl border border-input bg-background px-11 pl-11 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                  aria-label={showPassword ? "پنهان کردن رمز" : "نمایش رمز"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Remember */}
            <div className="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-border accent-[var(--primary)]"
              />
              <label htmlFor="remember" className="text-sm text-muted-foreground">
                مرا به خاطر بسپار
              </label>
            </div>

            {/* Error */}
            {authError ? (
              <div
                role="alert"
                className="flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                {authError}
              </div>
            ) : null}

            {/* Submit */}
            <button
              type="submit"
              disabled={authLoading}
              className="glow-primary group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-primary-foreground transition-all hover:bg-primary-hover disabled:opacity-70"
            >
              {authLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  در حال ورود...
                </>
              ) : (
                <>
                  ورود به پنل
                  <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs">
            <p className="mb-1 font-semibold text-primary">اعتبارنامه‌ی ادمین</p>
            <p className="text-muted-foreground" dir="ltr">
              admin@lingo.app / Lingo@Admin2026
            </p>
          </div>
        </div>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-success" />
          تمام ارتباطات رمزنگاری‌شده است · LINGO Admin
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
