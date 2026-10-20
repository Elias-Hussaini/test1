import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = { title: "ورود" };

export default function LoginPage() {
  // useSearchParams در LoginForm به Suspense نیاز دارد
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
