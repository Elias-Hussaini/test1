import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl"
      />

      <header className="relative z-10 border-b border-border/70">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center px-5 sm:px-8">
          <Link
            href="/"
            aria-label="صفحه اصلی LINGO"
            className="flex items-center gap-3"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-500 text-xl font-black text-white shadow-lg shadow-violet-500/20">
              L
            </span>
            <span>
              <span className="block text-xl font-black tracking-tight">
                LINGO
              </span>
              <span className="block text-xs text-muted">
                یادگیری هوشمند زبان
              </span>
            </span>
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}