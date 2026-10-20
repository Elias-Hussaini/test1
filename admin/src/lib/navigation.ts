/**
 * مقصد بازگشت بعد از ورود. فقط مسیرهای داخلی پذیرفته می‌شوند
 * تا `?next=https://evil.com` یا `//evil.com` کاربر را بیرون از پنل نبرد.
 */
export function safeRedirect(next: string | null | undefined, fallback = "/"): string {
  if (!next) return fallback;
  if (!next.startsWith("/") || next.startsWith("//") || next.includes("\\")) return fallback;
  if (next === "/login" || next.startsWith("/login?") || next.startsWith("/login/")) return fallback;
  return next;
}
