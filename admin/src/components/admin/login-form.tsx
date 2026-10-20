"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { errorMessage } from "@/lib/api";
import { safeRedirect } from "@/lib/navigation";
import { useSession } from "@/lib/session-store";
import { Button, TextField } from "./common/controls";
import { FormAlert } from "./common/form-alert";
import { Logo } from "./logo";

export function LoginForm() {
  const router = useRouter();
  const target = safeRedirect(useSearchParams().get("next"));

  const status = useSession((s) => s.status);
  const restore = useSession((s) => s.restore);
  const login = useSession((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  // اگر نشست قبلی هنوز معتبر است، مستقیم وارد پنل شو
  useEffect(() => {
    void restore();
  }, [restore]);

  useEffect(() => {
    if (status === "authed") router.replace(target);
  }, [status, target, router]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting) return;

    const found: typeof fieldErrors = {};
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) found.email = "ایمیل معتبر وارد کن.";
    if (!password) found.password = "رمز عبور را وارد کن.";
    setFieldErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    setError(null);
    try {
      await login(email.trim(), password);
      router.replace(target);
    } catch (err) {
      setError(errorMessage(err, "ورود انجام نشد. دوباره تلاش کن."));
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(117,103,248,0.18), transparent 70%), radial-gradient(ellipse 50% 40% at 100% 100%, rgba(40,199,232,0.10), transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-md animate-fade-in">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo size="lg" />
          <h1 className="mt-5 text-2xl font-black tracking-tight sm:text-3xl">
            ورود به <span className="gradient-text">پنل مدیریت</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">فقط حساب‌های مدیر به این بخش دسترسی دارند.</p>
        </div>

        <form onSubmit={onSubmit} noValidate className="glass-panel space-y-5 rounded-3xl p-6 sm:p-8">
          {error ? <FormAlert>{error}</FormAlert> : null}

          <TextField
            label="ایمیل"
            type="email"
            ltr
            autoComplete="username"
            inputMode="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={fieldErrors.email}
          />

          <div className="relative">
            <TextField
              label="رمز عبور"
              type={showPassword ? "text" : "password"}
              ltr
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={fieldErrors.password}
              className="pl-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "پنهان کردن رمز" : "نمایش رمز"}
              className="absolute left-2 top-[1.9rem] inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff aria-hidden="true" className="h-4 w-4" /> : <Eye aria-hidden="true" className="h-4 w-4" />}
            </button>
          </div>

          <Button type="submit" loading={submitting || status === "authed"} className="w-full">
            {submitting || status === "authed" ? "در حال ورود…" : "ورود"}
          </Button>

          <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck aria-hidden="true" className="h-4 w-4 text-success" />
            ارتباط و نشست شما با توکن کوتاه‌مدت محافظت می‌شود.
          </p>
        </form>
      </div>
    </div>
  );
}
