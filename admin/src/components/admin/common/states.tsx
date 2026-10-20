import type { LucideIcon } from "lucide-react";
import { CircleAlert, Inbox, RotateCw } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./controls";

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("animate-pulse rounded-lg bg-foreground/[0.07]", className)} />;
}

export function ErrorState({ message, onRetry, className }: { message: string; onRetry?: () => void; className?: string }) {
  return (
    <div role="alert" className={cn("flex flex-col items-center gap-3 rounded-2xl border border-danger/30 bg-danger/10 px-6 py-10 text-center", className)}>
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-danger/15 text-danger">
        <CircleAlert aria-hidden="true" className="h-6 w-6" />
      </span>
      <p className="max-w-md text-sm font-semibold leading-7">{message}</p>
      {onRetry ? (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          <RotateCw aria-hidden="true" className="h-3.5 w-3.5" />
          تلاش دوباره
        </Button>
      ) : null}
    </div>
  );
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon aria-hidden="true" className="h-7 w-7" />
      </span>
      <p className="text-sm font-bold">{title}</p>
      {description ? <p className="max-w-sm text-xs leading-6 text-muted-foreground">{description}</p> : null}
      {action}
    </div>
  );
}
