import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

type PasswordRequirement = {
  label: string;
  test: (password: string) => boolean;
};

const requirements: PasswordRequirement[] = [
  {
    label: "حداقل ۸ کاراکتر",
    test: (pwd) => pwd.length >= 8,
  },
  {
    label: "شامل حروف بزرگ و کوچک",
    test: (pwd) => /[a-z]/.test(pwd) && /[A-Z]/.test(pwd),
  },
  {
    label: "شامل عدد",
    test: (pwd) => /\d/.test(pwd),
  },
];

type PasswordStrengthProps = {
  password: string;
  showRequirements?: boolean;
  className?: string;
};

export function PasswordStrength({
  password,
  showRequirements = true,
  className,
}: PasswordStrengthProps) {
  const [strength, setStrength] = useState(0);
  const [metRequirements, setMetRequirements] = useState<boolean[]>([]);

  useEffect(() => {
    const met = requirements.map((req) => req.test(password));
    setMetRequirements(met);
    setStrength(met.filter(Boolean).length);
  }, [password]);

  if (!password) return null;

  const strengthPercent = (strength / requirements.length) * 100;
  const strengthColor =
    strength === 3
      ? "bg-success"
      : strength === 2
        ? "bg-warning"
        : "bg-danger";

  return (
    <div className={cn("space-y-3", className)}>
      {/* Strength bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="text-white/60">قدرت رمز عبور</span>
          <span className="text-white/80">
            {strength === 3
              ? "قوی"
              : strength === 2
                ? "متوسط"
                : "ضعیف"}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className={cn(
              "h-full transition-all duration-300",
              strengthColor
            )}
            style={{ width: `${strengthPercent}%` }}
          />
        </div>
      </div>

      {/* Requirements checklist */}
      {showRequirements && (
        <div className="space-y-2">
          {requirements.map((req, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-sm"
            >
              <div
                className={cn(
                  "flex h-4 w-4 items-center justify-center rounded-full transition-colors",
                  metRequirements[i]
                    ? "bg-success/20 text-success"
                    : "bg-white/10 text-white/40"
                )}
              >
                {metRequirements[i] ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <X className="h-3 w-3" />
                )}
              </div>
              <span
                className={cn(
                  "font-medium transition-colors",
                  metRequirements[i] ? "text-success" : "text-white/60"
                )}
              >
                {req.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
