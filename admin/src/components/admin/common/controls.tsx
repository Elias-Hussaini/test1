"use client";

import { forwardRef, useId, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Button ─── */

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md";

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary-hover glow-primary disabled:shadow-none",
  secondary: "border border-border bg-card text-foreground hover:border-primary/40 hover:text-primary",
  ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
  danger: "bg-danger text-white hover:bg-danger/90",
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: "h-9 gap-1.5 rounded-lg px-3 text-xs",
  md: "h-11 gap-2 rounded-xl px-5 text-sm",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", loading = false, disabled, className, children, type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap font-bold active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
        buttonVariants[variant],
        buttonSizes[size],
        className,
      )}
      {...props}
    >
      {loading ? <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  );
});

/* ─── Fields ─── */

const fieldBase =
  "w-full rounded-xl border border-input bg-muted/60 px-3.5 text-sm text-foreground placeholder:text-muted-foreground/70 hover:border-primary/30 focus:border-primary focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary/25 disabled:opacity-50";

type FieldShellProps = {
  label: string;
  htmlFor: string;
  error?: string | null;
  hint?: string;
  children: ReactNode;
  className?: string;
};

export function FieldShell({ label, htmlFor, error, hint, children, className }: FieldShellProps) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-bold text-foreground/90">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="mt-1.5 text-xs font-medium text-danger">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

type FieldExtras = { label: string; error?: string | null; hint?: string; wrapperClassName?: string; ltr?: boolean };

export const TextField = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & FieldExtras>(function TextField(
  { label, error, hint, wrapperClassName, ltr, id, className, ...props },
  ref,
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <FieldShell label={label} htmlFor={fieldId} error={error} hint={hint} className={wrapperClassName}>
      <input
        ref={ref}
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        dir={ltr ? "ltr" : undefined}
        className={cn(fieldBase, "h-11", ltr && "text-left", error && "border-danger/60", className)}
        {...props}
      />
    </FieldShell>
  );
});

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & FieldExtras>(
  function TextAreaField({ label, error, hint, wrapperClassName, ltr, id, className, ...props }, ref) {
    const autoId = useId();
  const fieldId = id ?? autoId;
    return (
      <FieldShell label={label} htmlFor={fieldId} error={error} hint={hint} className={wrapperClassName}>
        <textarea
          ref={ref}
          id={fieldId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          dir={ltr ? "ltr" : undefined}
          className={cn(fieldBase, "min-h-[88px] resize-y py-2.5 leading-7", ltr && "text-left", error && "border-danger/60", className)}
          {...props}
        />
      </FieldShell>
    );
  },
);

export const SelectField = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement> & FieldExtras>(function SelectField(
  { label, error, hint, wrapperClassName, id, className, children, ...props },
  ref,
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <FieldShell label={label} htmlFor={fieldId} error={error} hint={hint} className={wrapperClassName}>
      <select ref={ref} id={fieldId} className={cn(fieldBase, "h-11 cursor-pointer", className)} {...props}>
        {children}
      </select>
    </FieldShell>
  );
});

/** فیلتر فشرده (بدون برچسب دیداری) برای نوار جستجو. */
export const FilterSelect = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement> & { label: string }>(
  function FilterSelect({ label, className, children, ...props }, ref) {
    return (
      <select ref={ref} aria-label={label} className={cn(fieldBase, "h-11 w-auto min-w-[8.5rem] cursor-pointer", className)} {...props}>
        {children}
      </select>
    );
  },
);

export function SearchInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="search"
      className={cn(fieldBase, "h-11 pr-3.5", className)}
      {...props}
    />
  );
}
