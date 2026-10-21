/**
 * نگهداری توکن‌ها در فرانت‌اند.
 *
 * - access token فقط در حافظه‌ی JS (با رفرش صفحه از بین می‌رود).
 * - refresh token در HttpOnly cookie که بک‌اند می‌گذارد (credential: include).
 * - در localStorage فقط یک نشانه‌ی سبک "نشست داشتم" و اطلاعات نمایشی کاربر.
 *
 * مزیت: امنیت بیشتر (access token از localStorage بیرون آمد).
 * مکانیزم: هنگام بالا آمدن اپ، اگر نشانه در localStorage بود، یک refresh می‌زنیم.
 */

const SESSION_HINT_KEY = "lingo-session-hint";

let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export type SessionHint = {
  userId: string;
  email: string;
  username: string;
  role: string;
};

export function getSessionHint(): SessionHint | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_HINT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionHint;
  } catch {
    return null;
  }
}

export function setSessionHint(hint: SessionHint | null): void {
  if (typeof window === "undefined") return;
  try {
    if (hint) {
      localStorage.setItem(SESSION_HINT_KEY, JSON.stringify(hint));
    } else {
      localStorage.removeItem(SESSION_HINT_KEY);
    }
  } catch {
    // ignore
  }
}

export function clearSession(): void {
  accessToken = null;
  setSessionHint(null);
}
