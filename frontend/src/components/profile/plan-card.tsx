"use client";

import { Check, Lock } from "lucide-react";
import { Card } from "@/components/app/ui";
import { features } from "@/config/features";
import { plans } from "@/config/plans";
import { usePlan } from "@/hooks/use-plan";

export default function PlanCard() {
  const { plan, can } = usePlan();
  const isPremium = plan.id === "premium";

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted">پلن فعلی</p>
          <h2 className="mt-0.5 text-xl font-black">{plan.name}</h2>
          <p className="mt-1 text-sm text-muted">{plan.tagline}</p>
        </div>
        <span className="badge bg-primary/10 text-primary">{isPremium ? "فعال" : "پایه"}</span>
      </div>

      <h3 className="mb-2 mt-5 text-sm font-extrabold">خدمات</h3>
      <ul className="grid gap-2 sm:grid-cols-2">
        {features.map((f) => {
          const ok = can(f.id);
          return (
            <li key={f.id} className="flex items-center gap-2.5 rounded-xl bg-foreground/[0.04] px-3 py-2.5 text-sm">
              {ok ? <Check aria-label="فعال" className="h-4 w-4 shrink-0 text-success" /> : <Lock aria-label="قفل" className="h-4 w-4 shrink-0 text-muted" />}
              <span className={ok ? "font-semibold" : "text-muted"}>{f.title}</span>
              {f.status === "soon" ? <span className="badge ms-auto bg-primary/10 text-primary">به‌زودی</span> : null}
            </li>
          );
        })}
      </ul>

      {isPremium ? null : (
        <div className="mt-5 rounded-2xl border border-primary/25 bg-primary/5 p-4 text-sm leading-7">
          <p className="font-extrabold">ارتقا به پلن {plans.premium.name}</p>
          <p className="mt-1 text-muted">
            پرداخت آنلاین هنوز راه‌اندازی نشده است و هیچ پرداختی انجام نمی‌شود. فعال‌سازی پلن ویژه فعلاً از طرف مدیر سیستم انجام می‌شود و بلافاصله خدمات بالا برایت باز می‌شود.
          </p>
        </div>
      )}
    </Card>
  );
}
