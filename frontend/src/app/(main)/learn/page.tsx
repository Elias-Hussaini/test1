"use client";

import Link from "next/link";
import { BookOpen, CheckCircle2, Circle, Clock } from "lucide-react";
import { Card, PageHeader } from "@/components/app/ui";
import { levels } from "@/config/levels";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";

export default function LearnPage() {
  const current = useAuthStore((s) => s.user?.level ?? "A1");
  const currentIndex = Math.max(0, levels.findIndex((l) => l.id === current));

  return (
    <>
      <PageHeader
        title="مسیر یادگیری"
        description="از A1 تا B2. درس‌های ساختاریافته‌ی هر سطح به‌زودی اضافه می‌شوند؛ تا آن موقع واژگان هر سطح را در دیکشنری مرور کن."
      />

      <ol className="space-y-4">
        {levels.map((lvl, i) => {
          const isCurrent = i === currentIndex;
          const done = i < currentIndex;
          return (
            <li key={lvl.id}>
              <Card className={cn(isCurrent && "border-primary/50 ring-4 ring-primary/10")}>
                <div className="flex items-start gap-4">
                  <span
                    dir="ltr"
                    className={cn(
                      "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-black",
                      isCurrent ? "bg-linear-to-br from-primary to-secondary text-white" : "bg-foreground/[0.06] text-muted",
                    )}
                  >
                    {lvl.id}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-extrabold">{lvl.title}</h2>
                      {isCurrent ? <span className="badge bg-primary/10 text-primary">سطح فعلی تو</span> : null}
                      {done ? (
                        <span className="badge bg-success/15 text-success">
                          <CheckCircle2 aria-hidden="true" className="h-3 w-3" /> پشت سر گذاشته‌ای
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1.5 text-sm leading-7 text-muted">{lvl.description}</p>

                    <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                      <li className="flex items-center gap-2 rounded-xl bg-success/10 px-3 py-2.5">
                        <BookOpen aria-hidden="true" className="h-4 w-4 text-success" />
                        <Link href={`/dictionary/?level=${lvl.id}`} className="font-bold hover:underline">
                          واژگان سطح {lvl.id}
                        </Link>
                      </li>
                      <li className="flex items-center gap-2 rounded-xl bg-foreground/[0.04] px-3 py-2.5 text-muted">
                        <Clock aria-hidden="true" className="h-4 w-4" /> درس‌ها و تمرین‌ها · به‌زودی
                      </li>
                    </ul>
                  </div>
                  {!isCurrent && !done ? <Circle aria-hidden="true" className="hidden h-5 w-5 text-border sm:block" /> : null}
                </div>
              </Card>
            </li>
          );
        })}
      </ol>
    </>
  );
}
