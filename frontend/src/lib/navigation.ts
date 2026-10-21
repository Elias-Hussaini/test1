/**
 * مقصد بازگشت بعد از ورود. فقط مسیرهای داخلی پذیرفته می‌شوند
 * تا `?next=https://evil.com` یا `//evil.com` کاربر را بیرون از اپ نبرد.
 */
export function safeRedirect(next: string | null | undefined, fallback = "/dashboard/"): string {
  if (!next) return fallback;
  if (!next.startsWith("/") || next.startsWith("//") || next.includes("\\")) return fallback;
  if (/^\/(login|register|forgot-password|reset-password|verify-email)(\/|\?|$)/.test(next)) return fallback;
  return next;
}
