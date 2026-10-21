"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/stores/auth-store";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthBrand } from "@/components/auth/AuthBrand";
import { AuthTabs } from "@/components/auth/AuthTabs";
import { AuthInput, PasswordInput } from "@/components/auth/AuthInput";
import { AuthButton } from "@/components/auth/AuthButton";
import { SocialLogin } from "@/components/auth/SocialLogin";

export default function RegisterPage() {
  const router = useRouter();
  const { register, loading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "password" || field === "confirmPassword") {
      setPasswordError("");
    }
  };

  // Password validation
  const hasMinLength = formData.password.length >= 8;
  const hasLowerCase = /[a-z]/.test(formData.password);
  const hasUpperCase = /[A-Z]/.test(formData.password);
  const hasNumber = /\d/.test(formData.password);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    setPasswordError("");

    if (!hasMinLength) {
      setPasswordError("رمز عبور باید حداقل ۸ کاراکتر باشد");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setPasswordError("رمز عبور و تکرار آن یکسان نیستند");
      return;
    }

    const nameParts = formData.fullName.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const result = await register({
      email: formData.email,
      password: formData.password,
      username: formData.username || formData.email.split("@")[0],
      firstName,
      lastName,
    });

    if (result.success) {
      if (result.needsVerification) {
        router.push("/verify-email");
      } else {
        router.push("/dashboard");
      }
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
        <div className="relative rounded-3xl border border-white/10 bg-[#080D25]/80 p-8 shadow-2xl backdrop-blur-xl">
          {/* Logo Section */}
          <div className="mb-8 text-center">
            <AuthBrand size="medium" className="mb-6" />
            <h1 className="text-xl font-medium text-white/90">
              همین حالا ثبت‌نام کنید
            </h1>
          </div>

          {/* Tab Switcher */}
          <div className="mb-8">
            <AuthTabs activeTab="register" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <AuthInput
              label="نام و نام خانوادگی"
              type="text"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              placeholder="نام کامل خود را وارد کنید"
              icon={User}
              required
            />

            <AuthInput
              label="ایمیل یا شماره موبایل"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="your@email.com"
              icon={Mail}
              required
              dir="ltr"
            />

            <PasswordInput
              label="رمز عبور"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="••••••••"
              icon={Lock}
              required
            />

            <PasswordInput
              label="تکرار رمز عبور"
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              placeholder="••••••••"
              icon={Lock}
              required
            />

            {/* Password Requirements */}
            {formData.password && (
              <div className="space-y-2 text-xs">
                <div className={`flex items-center gap-2 ${hasMinLength ? "text-[#28C7E8]" : "text-white/40"}`}>
                  <div className={`h-1.5 w-1.5 rounded-full ${hasMinLength ? "bg-[#28C7E8]" : "bg-white/20"}`} />
                  حداقل ۸ کاراکتر
                </div>
                <div className={`flex items-center gap-2 ${hasUpperCase && hasLowerCase ? "text-[#28C7E8]" : "text-white/40"}`}>
                  <div className={`h-1.5 w-1.5 rounded-full ${hasUpperCase && hasLowerCase ? "bg-[#28C7E8]" : "bg-white/20"}`} />
                  شامل حروف بزرگ و کوچک
                </div>
                <div className={`flex items-center gap-2 ${hasNumber ? "text-[#28C7E8]" : "text-white/40"}`}>
                  <div className={`h-1.5 w-1.5 rounded-full ${hasNumber ? "bg-[#28C7E8]" : "bg-white/20"}`} />
                  شامل عدد
                </div>
              </div>
            )}

            {/* Terms */}
            <div className="text-xs text-white/60">
              با ثبت‌نام موافقت خود را با{" "}
              <Link href="/terms" className="text-[#713CFF] hover:text-[#28C7E8]">
                شرایط و قوانین
              </Link>{" "}
              اعلام می‌کنید.
            </div>

            {/* Error Message */}
            {(error || passwordError) && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300">
                {error || passwordError}
              </div>
            )}

            <AuthButton type="submit" loading={loading} showArrow>
              ثبت‌نام
            </AuthButton>
          </form>

          {/* Social Login */}
          <div className="mt-8">
            <SocialLogin />
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-white/50">
            قبلاً ثبت‌نام کرده‌اید؟{" "}
            <Link
              href="/login"
              className="font-bold text-[#713CFF] hover:text-[#28C7E8]"
            >
              وارد شوید
            </Link>
          </p>
        </div>
      </motion.div>
    </AuthLayout>
  );
}
