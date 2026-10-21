"use client";

import { forwardRef, useId, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { Eye, EyeOff, Lock, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type AuthFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "className"> & {
  /** برچسب (برای دسترسی‌پذیری؛ از نظر دیداری فقط placeholder دیده می‌شود، مثل طراحی) */
  label: string;
  icon: LucideIcon;
  error?: string | null;
  /** المان انتهای فیلد (مثلاً دکمه‌ی نمایش رمز) */
  trailing?: ReactNode;
  /** متن چپ‌به‌راست (ایمیل، رمز) */
  ltr?: boolean;
};

export const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(function AuthField(
  { label, icon: Icon, error, trailing, ltr, id, ...props },
  ref,
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const errorId = `${fieldId}-error`;

  return (
    <div>
      <label htmlFor={fieldId} className="sr-only">
        {label}
      </label>
      <div className="relative">
        <span aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted">
          <Icon className="h-[1.15rem] w-[1.15rem]" />
        </span>
        <input
          ref={ref}
          id={fieldId}
          dir={ltr ? "ltr" : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn("auth-input", ltr && "text-right placeholder:text-right", error && "auth-input-error")}
          {...props}
        />
        {trailing ? <span className="absolute left-2 top-1/2 -translate-y-1/2">{trailing}</span> : null}
      </div>
      {error ? (
        <p id={errorId} role="alert" className="mt-1.5 px-1 text-xs font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
});

type PasswordFieldProps = Omit<AuthFieldProps, "icon" | "trailing" | "type" | "ltr">;

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(function PasswordField(props, ref) {
  const [visible, setVisible] = useState(false);
  return (
    <AuthField
      ref={ref}
      {...props}
      icon={Lock}
      ltr
      type={visible ? "text" : "password"}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "پنهان کردن رمز" : "نمایش رمز"}
          aria-pressed={visible}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-muted hover:text-foreground"
        >
          {visible ? <EyeOff aria-hidden="true" className="h-[1.1rem] w-[1.1rem]" /> : <Eye aria-hidden="true" className="h-[1.1rem] w-[1.1rem]" />}
        </button>
      }
    />
  );
});
