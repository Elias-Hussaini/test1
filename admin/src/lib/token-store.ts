/**
 * نگهداری توکن‌ها.
 *
 * - access token فقط در حافظه‌ی JS است (با رفرش صفحه از بین می‌رود و با refresh دوباره ساخته می‌شود).
 * - refresh token در sessionStorage است: با بستن تب پاک می‌شود (برخلاف localStorage که ماندگار است).
 *
 * توجه: هر دو در برابر XSS کاملاً امن نیستند؛ راه‌حل نهایی کوکی HttpOnly است (مرحله‌ی بعد، سمت بک‌اند).
 */

const REFRESH_KEY = "lingo-admin-rt";

let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function getRefreshToken(): string | null {
  try {
    return sessionStorage.getItem(REFRESH_KEY);
  } catch {
    return null;
  }
}

export function setRefreshToken(token: string | null): void {
  try {
    if (token) sessionStorage.setItem(REFRESH_KEY, token);
    else sessionStorage.removeItem(REFRESH_KEY);
  } catch {
    /* sessionStorage در دسترس نیست (حالت خصوصی و ...) */
  }
}

export function clearTokens(): void {
  accessToken = null;
  setRefreshToken(null);
}
