"use client";

import { forwardRef, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

type AuthInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string | null;
  icon?: ReactNode;
  hint?: string;
};

/**
 * Input استاندارد برای صفحات احراز هویت.
 * - آیکن سمت راست
 * - حالت focus با glow
 * - خطای قرمز با آیکن
 */
export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, icon, hint, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label ? (
          <label
            htmlFor={props.id}
            className="mb-2 block text-sm font-semibold text-foreground"
          >
            {label}
          </label>
        ) : null}

        <div className="group relative">
          {icon ? (
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors group-focus-within:text-primary">
              {icon}
            </span>
          ) : null}

          <input
            ref={ref}
            {...props}
            className={`h-12 w-full rounded-xl border bg-background/60 px-3 text-sm outline-none transition-all placeholder:text-muted/60 focus:bg-background ${
              icon ? "pr-11" : ""
            } ${
              error
                ? "border-danger focus:border-danger focus:ring-4 focus:ring-danger/15"
                : "border-border focus:border-primary focus:ring-4 focus:ring-primary/15"
            } ${className}`}
          />
        </div>

        {error ? (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-danger">
            <AlertCircle className="h-3 w-3 shrink-0" />
            {error}
          </p>
        ) : hint ? (
          <p className="mt-1.5 text-xs text-muted">{hint}</p>
        ) : null}
      </div>
    );
  },
);
AuthInput.displayName = "AuthInput";

type PasswordInputProps = Omit<AuthInputProps, "icon" | "type"> & {};

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, hint, className, ...props }, ref) => {
    const [show, setShow] = useState(false);
    return (
      <div className="w-full">
        {label ? (
          <label className="mb-2 block text-sm font-semibold text-foreground">
            {label}
          </label>
        ) : null}
        <div className="relative">
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted">
            <LockIcon />
          </span>
          <input
            ref={ref}
            type={show ? "text" : "password"}
            {...props}
            className={`h-12 w-full rounded-xl border bg-background/60 pr-11 pl-11 text-sm outline-none transition-all placeholder:text-muted/60 focus:bg-background ${
              error
                ? "border-danger focus:border-danger focus:ring-4 focus:ring-danger/15"
                : "border-border focus:border-primary focus:ring-4 focus:ring-primary/15"
            } ${className ?? ""}`}
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-primary"
            aria-label={show ? "پنهان کردن رمز" : "نمایش رمز"}
            tabIndex={-1}
          >
            {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {error ? (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-danger">
            <AlertCircle className="h-3 w-3 shrink-0" />
            {error}
          </p>
        ) : hint ? (
          <p className="mt-1.5 text-xs text-muted">{hint}</p>
        ) : null}
      </div>
    );
  },
);
PasswordInput.displayName = "PasswordInput";

function LockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
