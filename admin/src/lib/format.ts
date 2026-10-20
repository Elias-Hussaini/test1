/** قالب‌بندی عددها و تاریخ‌ها به فارسی. */

const numberFormat = new Intl.NumberFormat("fa-IR");

export function faNumber(value: number | null | undefined): string {
  return numberFormat.format(value ?? 0);
}

const dateFormat = new Intl.DateTimeFormat("fa-IR", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

const dateTimeFormat = new Intl.DateTimeFormat("fa-IR", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const dayMonthFormat = new Intl.DateTimeFormat("fa-IR", { month: "short", day: "numeric" });

function parse(iso: string): Date | null {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function faDate(iso: string | null | undefined): string {
  const date = iso ? parse(iso) : null;
  return date ? dateFormat.format(date) : "—";
}

export function faDateTime(iso: string | null | undefined): string {
  const date = iso ? parse(iso) : null;
  return date ? dateTimeFormat.format(date) : "—";
}

/** «۲۵ مهر» برای محور نمودار؛ ورودی به‌شکل YYYY-MM-DD (UTC). */
export function faDayMonth(isoDay: string): string {
  const date = parse(`${isoDay}T12:00:00Z`);
  return date ? dayMonthFormat.format(date) : isoDay;
}

/** «۳ ساعت پیش»، «دیروز» و ... */
export function faRelative(iso: string | null | undefined): string {
  const date = iso ? parse(iso) : null;
  if (!date) return "—";
  const seconds = Math.round((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "همین الان";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${faNumber(minutes)} دقیقه پیش`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${faNumber(hours)} ساعت پیش`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "دیروز";
  if (days < 30) return `${faNumber(days)} روز پیش`;
  return faDate(iso);
}
