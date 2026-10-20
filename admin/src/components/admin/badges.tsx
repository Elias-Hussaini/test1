import { cn } from "@/lib/utils";

import type { UserRole, UserStatus } from "@/lib/api";

type StatusBadgeProps = {
  status: UserStatus;
  className?: string;
};

const statusConfig: Record<UserStatus, { label: string; classes: string }> = {
  active: {
    label: "فعال",
    classes: "bg-success/15 text-success border-success/30",
  },
  blocked: {
    label: "مسدود",
    classes: "bg-danger/15 text-danger border-danger/30",
  },
  suspended: {
    label: "معلق",
    classes: "bg-warning/15 text-warning border-warning/30",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const cfg = statusConfig[status] ?? statusConfig.active;
  return (
    <span
      className={cn(
        "status-pill",
        cfg.classes,
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {cfg.label}
    </span>
  );
}

type RoleBadgeProps = {
  role: UserRole;
  className?: string;
};

const roleConfig: Record<UserRole, { label: string; classes: string }> = {
  user: { label: "کاربر", classes: "bg-muted text-muted-foreground border-border" },
  guest: { label: "مهمان", classes: "bg-secondary-c/15 text-secondary-c border-secondary-c/30" },
  premium: { label: "پرمیوم", classes: "bg-primary/15 text-primary border-primary/30" },
  admin: { label: "مدیر", classes: "bg-accent/15 text-accent border-accent/30" },
};

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const cfg = roleConfig[role] ?? roleConfig.user;
  return (
    <span
      className={cn(
        "status-pill",
        cfg.classes,
        className,
      )}
    >
      {cfg.label}
    </span>
  );
}
