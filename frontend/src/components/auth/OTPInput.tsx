import { useRef, useState, KeyboardEvent, ClipboardEvent, ChangeEvent } from "react";
import { cn } from "@/lib/utils";

type OTPInputProps = {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  disabled?: boolean;
  className?: string;
};

export function OTPInput({
  length = 6,
  value,
  onChange,
  error = false,
  disabled = false,
  className,
}: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, newValue: string) => {
    // Only allow digits
    const digit = newValue.replace(/\D/g, "");
    if (digit.length > 1) return;

    const newOtp = value.split("");
    newOtp[index] = digit;
    const newOtpString = newOtp.join("");
    onChange(newOtpString);

    // Auto-focus next input
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (!value[index] && index > 0) {
        // If current is empty, go back and clear previous
        const newOtp = value.split("");
        newOtp[index - 1] = "";
        onChange(newOtp.join(""));
        inputRefs.current[index - 1]?.focus();
      } else if (value[index]) {
        // Clear current
        const newOtp = value.split("");
        newOtp[index] = "";
        onChange(newOtp.join(""));
      }
    }

    // Handle arrow keys
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");
    const newOtp = pastedData.slice(0, length).split("");

    // Pad with empty strings if needed
    while (newOtp.length < length) {
      newOtp.push("");
    }

    onChange(newOtp.join(""));

    // Focus last filled input or last input
    const lastFilledIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[lastFilledIndex]?.focus();
  };

  return (
    <div className={cn("flex gap-3 justify-center", className)} dir="ltr">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={cn(
            "otp-input",
            error && "error",
            "text-center"
          )}
          aria-label={`رقم ${index + 1} از کد تأیید`}
        />
      ))}
    </div>
  );
}
