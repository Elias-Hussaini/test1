/**
 * ساخت نام کاربری از ایمیل (کاربر در فرم ثبت‌نام نام کاربری نمی‌نویسد).
 * قانون بک‌اند: ۳ تا ۳۰ کاراکتر از [a-zA-Z0-9_].
 * اول خودِ نام، و اگر گرفته شده بود با پسوند عددی تصادفی.
 */
function randomDigits(length: number): string {
  const bytes = new Uint32Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => String(b % 10)).join("");
}

export function usernameCandidates(email: string, attempts = 4): string[] {
  const local = email.split("@")[0] ?? "";
  let base = local
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 20);
  if (base.length < 3) base = `user${base}`.slice(0, 20);

  const list = [base];
  for (let i = 1; i < attempts; i++) list.push(`${base}_${randomDigits(4)}`);
  return list;
}
