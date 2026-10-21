import type { LucideIcon } from "lucide-react";

/** نشان بزرگ صفحه‌های تأیید ایمیل / رمز جدید: کاشی شیشه‌ای با درخشش بنفش. */
export function StatusIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div className="auth-status-icon" aria-hidden="true">
      <Icon className="h-9 w-9" strokeWidth={1.75} />
    </div>
  );
}
