import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

/**
 * هش کردن رمز عبور با bcrypt.
 * @param password رمز عبور متن‌آشکار
 * @returns هش
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * بررسی رمز عبور در برابر هش ذخیره‌شده.
 * به‌صورت constant-time برای جلوگیری از timing attack.
 */
export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
