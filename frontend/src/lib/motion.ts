/** منحنی نرم مشترک برای انیمیشن‌های ورود و شمارنده. */
export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * فقط در کلاینت (داخل effect یا event handler) صدا زده شود،
 * نه هنگام رندر، تا خروجی سرور و کلاینت یکسان بماند.
 */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
