import type { Metadata } from "next";
import { CheckSquare, Headphones, Link2, ListOrdered, Pencil, Puzzle, ScrollText, Languages } from "lucide-react";
import { PageHeader, StatusBadge } from "@/components/app/ui";
import { exerciseTypes } from "@/config/exercise-types";

export const metadata: Metadata = { title: "تمرین‌ها" };

const icons = { CheckSquare, Link2, Pencil, ListOrdered, Languages, Puzzle, Headphones, ScrollText } as const;

export default function ExercisesPage() {
  return (
    <>
      <PageHeader
        title="تمرین‌ها"
        description="تمرین‌ها یکی‌یکی اضافه می‌شوند. ساختار هر نوع تمرین آماده است و هر کدام که ساخته شد، اینجا فعال می‌شود."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {exerciseTypes.map((t) => {
          const Icon = icons[t.icon];
          return (
            <div key={t.id} className="app-card flex flex-col p-5">
              <div className="flex items-start justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <StatusBadge status={t.status} />
              </div>
              <h2 className="mt-4 font-extrabold">{t.title}</h2>
              <p className="mt-1.5 text-sm leading-7 text-muted">{t.description}</p>
            </div>
          );
        })}
      </div>
    </>
  );
}
