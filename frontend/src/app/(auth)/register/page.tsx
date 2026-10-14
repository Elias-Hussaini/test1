"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft, ShieldCheck, User, Check } from "lucide-react";
import { motion } from "framer-motion";
import { AuthInput, PasswordInput } from "@/components/auth/auth-input";
import { AuthButton } from "@/components/auth/auth-button";
import { Divider, SocialButton } from "@/components/auth/auth-divider";
import { useAuthStore } from "@/stores/auth-store";

export default function RegisterPage() {
  const router = useRouter();
  const { register, loading, error, clearError } = useAuthStore();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);

  // اعتبارسنجی محلی
  const passwordMismatch = confirmPassword && confirmPassword !== password;
  const usernameValid = !username || /^[a-zA-Z0-9_]{3,30}$/.test(username);
  const emailValid = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordValid = !password || password.length >= 8;
  const formValid =
    firstName.trim() &&
    email.trim() &&
    emailValid &&
    username.trim() &&
    usernameValid &&
    passwordValid &&
    !passwordMismatch &&
    agree;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    if (!formValid) return;

    const result = await register({
      email,
      password,
      username,
      firstName: firstName || undefined,
      lastName: lastName || undefined,
    });

    if (result.success) {
      // اگه needsVerification true باشه، به صفحه‌ی تأیید ایمیل ببر
      if (result.needsVerification) {
        router.push("/verify-email/");
      } else {
        router.push("/dashboard/");
      }
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
          ساخت حساب <span className="gradient-text-purple">LINGO</span>
        </h2>
        <p className="mt-1.5 text-sm text-muted">
          حساب داری؟{" "}
          <Link
            href="/login/"
            className="font-semibold text-primary hover:underline"
          >
            وارد شو
          </Link>
        </p>
      </div>

      {/* Social */}
      <div className="mb-5 flex gap-3">
        <SocialButton provider="google">گوگل</SocialButton>
        <SocialButton provider="github">گیت‌هاب</SocialButton>
      </div>

      <Divider label="یا با ایمیل" className="my-5" />

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div className="grid grid-cols-2 gap-3">
          <AuthInput
            id="firstName"
            label="نام"
            placeholder="مثلاً علی"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            autoComplete="given-name"
          />
          <AuthInput
            id="lastName"
            label="نام خانوادگی"
            placeholder="مثلاً رضایی"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            autoComplete="family-name"
          />
        </div>

        {/* Email */}
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
          error={!emailValid ? "ایمیل نامعتبر است." : null}
        />

        {/* Username */}
        <AuthInput
          id="username"
          label="نام کاربری"
          placeholder="ali_rezaei"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          icon={<User className="h-5 w-5" />}
          dir="ltr"
          required
          autoComplete="username"
          error={!usernameValid ? "فقط حروف انگلیسی، عدد و _ (۳ تا ۳۰ کاراکتر)" : null}
          hint={usernameValid && username ? "نام کاربری قابل قبول است" : undefined}
        />

        {/* Password */}
        <PasswordInput
          label="رمز عبور"
          placeholder="حداقل ۸ کاراکتر"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          error={!passwordValid && password ? "حداقل ۸ کاراکتر" : null}
        />

        {/* Password strength indicators */}
        {password ? (
          <div className="grid grid-cols-2 gap-2 text-xs text-muted">
            <PasswordRule ok={password.length >= 8}>حداقل ۸ کاراکتر</PasswordRule>
            <PasswordRule ok={/[a-z]/.test(password)}>حرف کوچک انگلیسی</PasswordRule>
            <PasswordRule ok={/[A-Z]/.test(password)}>حرف بزرگ انگلیسی</PasswordRule>
            <PasswordRule ok={/[0-9]/.test(password)}>عدد</PasswordRule>
          </div>
        ) : null}

        {/* Confirm password */}
        <PasswordInput
          label="تکرار رمز عبور"
          placeholder="رمز را دوباره وارد کن"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
          error={passwordMismatch ? "رمزها مطابقت ندارند" : null}
        />

        {/* Terms */}
        <label className="flex items-start gap-2 text-sm text-muted">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-border accent-[var(--primary)]"
            required
          />
          <span>
            با{" "}
            <Link href="/terms/" className="font-semibold text-primary hover:underline">
              قوانین استفاده
            </Link>{" "}
            و{" "}
            <Link href="/privacy/" className="font-semibold text-primary hover:underline">
              حریم خصوصی
            </Link>{" "}
            موافقم
          </span>
        </label>

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
          disabled={!formValid}
          icon={<ArrowLeft className="h-5 w-5" />}
          className="w-full"
        >
          ثبت‌نام
        </AuthButton>
      </form>

      <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-muted">
        <ShieldCheck className="h-3.5 w-3.5 text-success" />
        اطلاعات شما محرمانه و رمزنگاری‌شده است
      </p>
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
