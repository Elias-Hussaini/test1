import { forwardRef, InputHTMLAttributes, ReactNode, useState } from "react";
import { Eye, EyeOff, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type AuthInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon?: LucideIcon;
  error?: string;
  wrapperClassName?: string;
};

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, icon: Icon, error, wrapperClassName, className, ...props }, ref) => {
    return (
      <div className={wrapperClassName}>
        <label className="mb-2.5 block text-sm font-bold text-white/90">
          {label}
        </label>
        <div className="group relative">
          {/* Glow effect on focus */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 blur-xl transition-opacity group-focus-within:opacity-100" />

          <div className="relative flex items-center">
            {/* Icon (RTL: on the right) */}
            {Icon && (
              <Icon className="absolute right-4 h-5 w-5 text-white/40 transition-colors group-focus-within:text-primary" />
            )}

            {/* Input field */}
            <input
              ref={ref}
              className={cn(
                "w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 font-medium text-white placeholder-white/30 backdrop-blur-xl transition-all focus:border-primary/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary/20",
                Icon ? "pr-12 pl-4" : "px-4",
                error && "border-danger/50 focus:border-danger/50 focus:ring-danger/20",
                className
              )}
              {...props}
            />
          </div>
        </div>

        {/* Error message */}
        {error && (
          <p className="mt-2 text-sm font-medium text-danger">{error}</p>
        )}
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";

// Password Input with visibility toggle
type PasswordInputProps = Omit<AuthInputProps, "type">;

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, icon: Icon, error, wrapperClassName, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className={wrapperClassName}>
        <label className="mb-2.5 block text-sm font-bold text-white/90">
          {label}
        </label>
        <div className="group relative">
          {/* Glow effect on focus */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 blur-xl transition-opacity group-focus-within:opacity-100" />

          <div className="relative flex items-center">
            {/* Icon (RTL: on the right) */}
            {Icon && (
              <Icon className="absolute right-4 h-5 w-5 text-white/40 transition-colors group-focus-within:text-primary" />
            )}

            {/* Input field */}
            <input
              ref={ref}
              type={showPassword ? "text" : "password"}
              className={cn(
                "w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 font-medium text-white placeholder-white/30 backdrop-blur-xl transition-all focus:border-primary/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary/20",
                Icon ? "pr-12 pl-12" : "px-12",
                error && "border-danger/50 focus:border-danger/50 focus:ring-danger/20",
                className
              )}
              {...props}
            />

            {/* Toggle visibility button */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-4 text-white/40 transition-colors hover:text-white/80"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <p className="mt-2 text-sm font-medium text-danger">{error}</p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
