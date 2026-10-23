"use client";

import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import type { Feature } from "@/config/features";
import { usePlan } from "@/hooks/use-plan";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/app/ui";

export default function FeatureCard({ feature, compact = false }: { feature: Feature; compact?: boolean }) {
  const { can } = usePlan();
  const locked = !can(feature.id);

  const body = (
    <>
      <div className="flex items-start justify-between gap-2">
        <span className={cn("flex h-11 w-11 items-center justify-center rounded-2xl", feature.tone)}>
          <feature.Icon aria-hidden="true" className="h-5 w-5" />
        </span>
        <span className="flex items-center gap-1.5">
          {locked ? (
            <span className="badge bg-foreground/[0.06] text-muted">
              <Lock aria-hidden="true" className="h-3 w-3" /> اشتراک ویژه
            </span>
          ) : null}
          <StatusBadge status={feature.status} />
        </span>
      </div>
      <h3 className="mt-4 font-extrabold">{feature.title}</h3>
      {compact ? null : <p className="mt-1.5 flex-1 text-sm leading-7 text-muted">{feature.description}</p>}
      {feature.href ? (
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
          باز کردن
          <ArrowLeft aria-hidden="true" className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        </span>
      ) : null}
    </>
  );

  const cls = "app-card group relative flex h-full flex-col p-5 transition-all";
  return feature.href ? (
    <Link href={feature.href} className={cn(cls, "hover:-translate-y-0.5 hover:border-primary/40")}>
      {body}
    </Link>
  ) : (
    <div className={cn(cls, "opacity-90")}>{body}</div>
  );
}
