"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

type AuthButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "md" | "lg";
  loading?: boolean;
  icon?: ReactNode;
};

export const AuthButton = forwardRef<HTMLButtonElement, AuthButtonProps>(
  (
    {
      variant = "primary",
      size = "lg",
      loading = false,
      icon,
      children,
      className = "",
      disabled,
      ...props
    },
    ref,
  ) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-bold transition-all active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none";
    const sizes = {
      md: "h-10 px-4 text-sm rounded-xl",
      lg: "h-12 px-6 text-sm rounded-xl",
    };
    const variants = {
      primary:
        "glow-soft bg-primary text-white hover:bg-primary-hover hover:-translate-y-0.5",
      secondary:
        "glass border border-border text-foreground hover:border-primary/40 hover:text-primary",
      ghost:
        "text-muted hover:text-primary hover:bg-primary/5",
      danger:
        "bg-danger text-white hover:bg-danger/90",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
        {...props}
      >
        {loading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        ) : icon}
        {children}
      </button>
    );
  },
);
AuthButton.displayName = "AuthButton";
