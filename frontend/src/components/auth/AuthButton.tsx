import { ButtonHTMLAttributes, ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type AuthButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
  icon?: ReactNode;
  showArrow?: boolean;
};

export function AuthButton({
  children,
  variant = "primary",
  loading = false,
  icon,
  showArrow = false,
  className,
  disabled,
  ...props
}: AuthButtonProps) {
  const variants = {
    primary:
      "bg-gradient-to-r from-primary via-[#965BFF] to-secondary text-white shadow-2xl shadow-primary/40 hover:shadow-primary/60",
    secondary:
      "border border-white/10 bg-white/5 text-white backdrop-blur-xl hover:bg-white/10 hover:border-white/20",
    ghost: "text-white/70 hover:text-white hover:bg-white/5",
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      disabled={disabled || loading}
      className={cn(
        "group relative w-full overflow-hidden rounded-2xl px-6 py-4 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        className
      )}
      {...props}
    >
      <div className="relative flex items-center justify-center gap-2">
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            {icon}
            <span className="text-base">{children}</span>
            {showArrow && (
              <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            )}
          </>
        )}

        {/* Shine effect on hover (only for primary) */}
        {variant === "primary" && !disabled && !loading && (
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        )}
      </div>
    </motion.button>
  );
}
