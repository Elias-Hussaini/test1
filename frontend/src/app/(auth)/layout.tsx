/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

/**
 * قاب مشترک صفحه‌های ورود/ثبت‌نام/بازیابی.
 *
 * سبک و بدون جاوااسکریپت: بدون انیمیشن مداوم، بدون Framer Motion، تصاویر WebP کوچک.
 * - موبایل: تصویر کلن در بالا با محو شدن به پس‌زمینه
 * - دسکتاپ: پنل تصویر کنار فرم
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="auth-backdrop relative min-h-dvh overflow-x-clip text-foreground">
      {/* موبایل: بنر تصویر با محو شدن */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[44vh] max-h-[26rem] lg:hidden"
        style={{
          WebkitMaskImage: "linear-gradient(to bottom, #000 35%, transparent)",
          maskImage: "linear-gradient(to bottom, #000 35%, transparent)",
        }}
      >
        <img
          src="/images/koln-640.webp"
          alt=""
          width={640}
          height={960}
          decoding="async"
          fetchPriority="high"
          className="h-full w-full object-cover object-[72%_32%] opacity-40 dark:opacity-60"
        />
      </div>

      <div className="relative mx-auto grid min-h-dvh max-w-[1200px] lg:grid-cols-[1.05fr_1fr]">
        {/* دسکتاپ: پنل تصویر */}
        <aside className="relative hidden overflow-hidden lg:block">
          <img
            src="/images/koln-1024.webp"
            alt=""
            width={1024}
            height={1536}
            decoding="async"
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#0B0820] via-[#0B0820]/30 to-transparent" />

          <div className="absolute inset-x-8 bottom-8 rounded-3xl border border-white/15 bg-[#0B0820]/55 p-7 text-white backdrop-blur-md">
            <h2 className="text-3xl font-black leading-[1.5]">
              آلمانی را ساده،
              <br />
              سریع و هوشمند یاد بگیر
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/70">
              با LINGO قدم‌به‌قدم تا رسیدن به اهداف زبانی‌ات همراهت هستیم؛ واژه‌نامه، تمرین و معلم هوش مصنوعی در یک اپ.
            </p>
          </div>
        </aside>

        <main className="relative flex flex-col px-5 pb-10 pt-6 sm:px-8">
          <div className="flex justify-end">
            <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-foreground">
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
              بازگشت به خانه
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-center py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
