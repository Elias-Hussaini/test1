import { z } from "zod";
import { env } from "../../config/env.js";

/**
 * اسکیمای اعتبارسنجی برای endpoints احراز هویت.
 * همه‌ی قوانین (مثل طول رمز، فرمت ایمیل) اینجا متمرکز هستند.
 */

export const registerSchema = z.object({
  email: z.string().email("ایمیل نامعتبر است.").max(255),
  password: z
    .string()
    .min(env.PASSWORD_MIN_LENGTH, `رمز عبور باید حداقل ${env.PASSWORD_MIN_LENGTH} کاراکتر باشد.`)
    .max(128, "رمز عبور نباید بیش از ۱۲۸ کاراکتر باشد.")
    .regex(/[a-z]/, "رمز باید حداقل یک حرف کوچک انگلیسی داشته باشد.")
    .regex(/[A-Z]/, "رمز باید حداقل یک حرف بزرگ انگلیسی داشته باشد.")
    .regex(/[0-9]/, "رمز باید حداقل یک عدد داشته باشد."),
  username: z
    .string()
    .min(3, "نام کاربری باید حداقل ۳ کاراکتر باشد.")
    .max(30, "نام کاربری نباید بیش از ۳۰ کاراکتر باشد.")
    .regex(/^[a-zA-Z0-9_]+$/, "نام کاربری فقط می‌تواند شامل حروف انگلیسی، عدد و زیرخط باشد."),
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("ایمیل نامعتبر است."),
  password: z.string().min(1, "رمز عبور را وارد کنید."),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * مرورگر refresh token را از کوکی HttpOnly می‌فرستد (بدنه خالی)،
 * اپ‌های بدون کوکی (ادمین، موبایل) آن را در بدنه می‌فرستند.
 */
export const refreshSchema = z
  .object({
    refreshToken: z.string().min(1).optional(),
  })
  .default({});

export type RefreshInput = z.infer<typeof refreshSchema>;

export const logoutSchema = z.object({
  refreshToken: z.string().min(1).optional(),
});

export type LogoutInput = z.infer<typeof logoutSchema>;
