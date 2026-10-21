import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/** قوانین رمز؛ دقیقاً همان‌هایی که بک‌اند اعمال می‌کند. */
export const passwordChecks = [
  { key: "len", label: "حداقل ۸ کاراکتر", test: (v: string) => v.length >= 8 },
  { key: "case", label: "شامل حروف بزرگ و کوچک انگلیسی", test: (v: string) => /[a-z]/.test(v) && /[A-Z]/.test(v) },
  { key: "digit", label: "شامل عدد", test: (v: string) => /\d/.test(v) },
] as const;

export function isPasswordValid(value: string): boolean {
  return passwordChecks.every((rule) => rule.test(value));
}

export function PasswordRules({ value }: { value: string }) {
  return (
    <ul aria-label="شرایط رمز عبور" className="space-y-1.5 px-1">
      {passwordChecks.map((rule) => {
        const ok = rule.test(value);
        return (
          <li key={rule.key} className={cn("flex items-center gap-2 text-xs", ok ? "text-success" : "text-muted")}>
            <span
              aria-hidden="true"
              className={cn("flex h-4 w-4 items-center justify-center rounded-full border", ok ? "border-success bg-success/15" : "border-border")}
            >
              {ok ? <Check className="h-3 w-3" /> : null}
            </span>
            <span>{rule.label}</span>
            <span className="sr-only">{ok ? "برقرار است" : "برقرار نیست"}</span>
          </li>
        );
      })}
    </ul>
  );
}
