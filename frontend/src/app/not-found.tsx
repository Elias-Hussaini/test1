import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5">
      <div className="glass w-full max-w-md rounded-3xl p-10 text-center">
        <p className="text-6xl font-black text-primary">404</p>

        <h1 className="mt-5 text-2xl font-extrabold">
          صفحه‌ای که دنبالش بودی پیدا نشد
        </h1>

        <p className="mt-4 leading-8 text-muted">
          شاید آدرس رو اشتباه وارد کردی یا این صفحه حذف شده.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-2xl bg-primary px-6 py-3 font-bold text-white transition hover:opacity-90"
        >
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </main>
  );
}