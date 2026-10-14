"use client";

import { useEffect, useRef, useState, type ClipboardEvent, type KeyboardEvent } from "react";

type OtpInputProps = {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
  autoFocus?: boolean;
};

/**
 * کامپوننت کد ۶ رقمی برای تأیید ایمیل / ریست رمز.
 * - ۶ input جدا
 * - paste پشتیبانی می‌شود
 * - کلید Backspace به خانه‌ی قبلی برمی‌گردد
 * - RTL سازگار
 */
export function OtpInput({
  length = 6,
  value,
  onChange,
  hasError = false,
  autoFocus = true,
}: OtpInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [localValues, setLocalValues] = useState<string[]>(
    Array.from({ length }, (_, i) => value[i] ?? ""),
  );

  useEffect(() => {
    if (autoFocus && inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    setLocalValues(Array.from({ length }, (_, i) => value[i] ?? ""));
  }, [value, length]);

  const focusInput = (index: number) => {
    const el = inputsRef.current[index];
    if (el) {
      el.focus();
      el.select();
    }
  };

  const handleChange = (index: number, val: string) => {
    // فقط یک رقم
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...localValues];
    next[index] = digit;
    setLocalValues(next);

    const combined = next.join("");
    onChange(combined);

    if (digit && index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !localValues[index] && index > 0) {
      focusInput(index - 1);
    } else if (e.key === "ArrowLeft" && index < length - 1) {
      focusInput(index + 1);
    } else if (e.key === "ArrowRight" && index > 0) {
      focusInput(index - 1);
    } else if (e.key === "Enter" && localValues.every((v) => v)) {
      // submit handled by parent form
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (pasted) {
      const next = Array.from({ length }, (_, i) => pasted[i] ?? "");
      setLocalValues(next);
      onChange(next.join(""));
      focusInput(Math.min(pasted.length, length - 1));
    }
  };

  return (
    <div
      className="flex gap-2 justify-center"
      dir="ltr"
      onPaste={handlePaste}
    >
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          value={localValues[i]}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onFocus={(e) => e.target.select()}
          className={`otp-input ${hasError ? "error" : ""}`}
          aria-label={`رقم ${i + 1}`}
        />
      ))}
    </div>
  );
}
