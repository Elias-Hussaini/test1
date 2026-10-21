import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type GradientButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  /** آیکن فلش در انتها */
  arrow?: boolean;
  children: ReactNode;
};

export function GradientButton({ loading, arrow = true, className, children, disabled, type = "submit", ...props }: GradientButtonProps) {
  return (
    <button type={type} disabled={disabled || loading} aria-busy={loading || undefined} className={cn("auth-btn", className)} {...props}>
      {loading ? <LoaderCircle aria-hidden="true" className="h-5 w-5 animate-spin" /> : null}
      <span>{children}</span>
      {!loading && arrow ? <ArrowLeft aria-hidden="true" className="h-5 w-5" /> : null}
    </button>
  );
}
