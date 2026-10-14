/**
 * LINGO Frontend API Client
 *
 * Client-side fetch wrapper for LINGO backend.
 * Backend URL configurable via NEXT_PUBLIC_API_URL (default: http://localhost:4000)
 *
 * Tokens:
 *   - accessToken in memory (not localStorage for security)
 *   - refreshToken in HttpOnly cookie (set by backend)
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000";

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type FetchOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string | null;
  query?: Record<string, string | number | boolean | undefined>;
};

function buildUrl(path: string, query?: FetchOptions["query"]): string {
  const url = new URL(
    path.startsWith("http") ? path : `${API_BASE}${path}`,
  );
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null) {
        url.searchParams.set(k, String(v));
      }
    }
  }
  return url.toString();
}

/**
 * درخواست اصلی به API.
 * در صورت 401، سعی می‌کند refresh کند.
 */
export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const { method = "GET", body, token, query } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  let res = await fetch(buildUrl(path, query), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include", // برای ارسال cookie refresh_token
  });

  // در صورت 401، یک‌بار refresh کن و دوباره امتحان کن
  if (res.status === 401 && !path.includes("/auth/")) {
    const refreshRes = await fetch(`${API_BASE}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
      credentials: "include",
    });

    if (refreshRes.ok) {
      const refreshData = await refreshRes.json();
      const newToken = refreshData.data?.accessToken;
      if (newToken) {
        // retry with new token
        headers.Authorization = `Bearer ${newToken}`;
        res = await fetch(buildUrl(path, query), {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
          credentials: "include",
        });
        // Store new token in memory
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("lingo:token-refreshed", {
              detail: { accessToken: newToken },
            }),
          );
        }
      }
    }
  }

  // 204
  if (res.status === 204) return undefined as T;

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = json?.error;
    throw new ApiError(
      err?.code ?? "UNKNOWN",
      err?.message ?? `HTTP ${res.status}`,
      res.status,
      err?.details,
    );
  }

  return json.data as T;
}

/* ═══════════════════════════════════
   Auth API
   ═══════════════════════════════════ */

export type AuthUser = {
  id: string;
  email: string;
  username: string;
  role: string;
  level?: string;
};

export type LoginResponse = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
};

export const authApi = {
  register: (data: {
    email: string;
    password: string;
    username: string;
    firstName?: string;
    lastName?: string;
  }) =>
    apiFetch<LoginResponse & { needsVerification: boolean }>("/api/auth/register", {
      method: "POST",
      body: data,
    }),

  login: (email: string, password: string) =>
    apiFetch<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: { email, password },
    }),

  guest: () =>
    apiFetch<LoginResponse>("/api/auth/guest", {
      method: "POST",
      body: {},
    }),

  logout: () =>
    apiFetch<{ success: boolean }>("/api/auth/logout", {
      method: "POST",
      body: {},
    }),

  me: (token: string) =>
    apiFetch<{
      id: string;
      email: string;
      username: string;
      role: string;
      status: string;
      isEmailVerified: boolean;
      avatarUrl: string | null;
      profile: {
        firstName: string | null;
        lastName: string | null;
        bio: string | null;
        level: string;
        xp: number;
        streak: number;
      } | null;
    }>("/api/auth/me", { token }),

  requestPasswordReset: (email: string) =>
    apiFetch<{ success: boolean }>("/api/auth/forgot-password", {
      method: "POST",
      body: { email },
    }),

  resetPassword: (data: { code: string; newPassword: string }) =>
    apiFetch<{ success: boolean }>("/api/auth/reset-password", {
      method: "POST",
      body: data,
    }),

  verifyEmail: (data: { code: string }) =>
    apiFetch<{ success: boolean }>("/api/auth/verify-email", {
      method: "POST",
      body: data,
    }),

  resendVerification: () =>
    apiFetch<{ success: boolean }>("/api/auth/resend-verification", {
      method: "POST",
      body: {},
    }),
};

/* ═══════════════════════════════════
   Dictionary API
   ═══════════════════════════════════ */

export type Word = {
  id: string;
  german: string;
  persian: string;
  article: string | null;
  plural: string | null;
  partOfSpeech: string | null;
  level: string;
  example: string | null;
  exampleFa: string | null;
  ipa: string | null;
  audioUrl: string | null;
};

export const dictionaryApi = {
  search: (
    token: string | null,
    params: {
      q?: string;
      level?: string;
      article?: string;
      page?: number;
      limit?: number;
    } = {},
  ) =>
    apiFetch<{ words: Word[]; pagination: { total: number; page: number; limit: number; totalPages: number } }>(
      "/api/dictionary/search",
      { token, query: params as Record<string, string | number> },
    ),
};

/* ═══════════════════════════════════
   Vocabulary API
   ═══════════════════════════════════ */

export const vocabularyApi = {
  list: (token: string, params: { page?: number; limit?: number; status?: string } = {}) =>
    apiFetch<{ words: unknown[]; pagination: unknown }>("/api/vocabulary", {
      token,
      query: params as Record<string, string | number>,
    }),

  add: (token: string, wordId: string, status: "learning" | "learned" | "unknown" = "learning") =>
    apiFetch("/api/vocabulary", {
      method: "POST",
      token,
      body: { wordId, status },
    }),

  remove: (token: string, wordId: string) =>
    apiFetch(`/api/vocabulary/${wordId}`, {
      method: "DELETE",
      token,
    }),

  stats: (token: string) =>
    apiFetch<{ total: number; learning: number; learned: number; unknown: number }>(
      "/api/vocabulary/stats",
      { token },
    ),
};
