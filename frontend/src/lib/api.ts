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

import { getAccessToken, setAccessToken } from "./token-store";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

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
  query?: Record<string, string | number | boolean | undefined>;
  /** برای login/refresh که نباید خودکار refresh شوند. */
  skipAuth?: boolean;
  signal?: AbortSignal;
};

function buildUrl(path: string, query?: FetchOptions["query"]): string {
  const url = new URL(path.startsWith("http") ? path : `${API_BASE}${path}`);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null) {
        url.searchParams.set(k, String(v));
      }
    }
  }
  return url.toString();
}

async function rawRequest<T>(path: string, options: FetchOptions, token: string | null): Promise<T> {
  const { method = "GET", body, query, signal } = options;

  const response = await fetch(buildUrl(path, query), {
    method,
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    credentials: "include", // برای ارسال cookie refresh_token
    signal,
  });

  if (response.status === 204) return undefined as T;

  const json = (await response.json().catch(() => ({}))) as {
    data?: T;
    error?: { code?: string; message?: string; details?: unknown };
  };

  if (!response.ok) {
    throw new ApiError(
      json.error?.code ?? "UNKNOWN",
      json.error?.message ?? `HTTP ${response.status}`,
      response.status,
      json.error?.details,
    );
  }

  return json.data as T;
}

/* ─── Refresh (یک درخواست هم‌زمان) ─── */

let refreshInFlight: Promise<string | null> | null = null;

export function refreshAccessToken(): Promise<string | null> {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    try {
      const result = await rawRequest<{ accessToken: string }>(
        "/api/auth/refresh",
        { method: "POST", body: {}, skipAuth: true },
        null,
      );
      setAccessToken(result.accessToken);
      return result.accessToken;
    } catch (error) {
      // فقط وقتی سرور صراحتاً رد کرده توکن را پاک کن؛ قطعی شبکه نباید کاربر را خارج کند.
      if (error instanceof ApiError) setAccessToken(null);
      return null;
    }
  })().finally(() => {
    refreshInFlight = null;
  });

  return refreshInFlight;
}

/**
 * درخواست اصلی به API.
 * در صورت 401، سعی می‌کند refresh کند.
 */
export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  if (options.skipAuth) return rawRequest<T>(path, options, null);

  try {
    return await rawRequest<T>(path, options, getAccessToken());
  } catch (error) {
    if (!(error instanceof ApiError) || error.statusCode !== 401) throw error;

    const fresh = await refreshAccessToken();
    if (!fresh) throw error;

    return rawRequest<T>(path, options, fresh);
  }
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
      skipAuth: true,
    }),

  login: (email: string, password: string) =>
    apiFetch<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: { email, password },
      skipAuth: true,
    }),

  guest: () =>
    apiFetch<LoginResponse>("/api/auth/guest", {
      method: "POST",
      body: {},
      skipAuth: true,
    }),

  logout: () =>
    apiFetch<{ success: boolean }>("/api/auth/logout", {
      method: "POST",
      body: {},
    }),

  me: (signal?: AbortSignal) =>
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
    }>("/api/auth/me", { signal }),

  requestPasswordReset: (email: string) =>
    apiFetch<{ success: boolean; cooldownSeconds?: number }>("/api/auth/forgot-password", {
      method: "POST",
      body: { email },
      skipAuth: true,
    }),

  resetPassword: (data: { email: string; code: string; newPassword: string }) =>
    apiFetch<{ success: boolean }>("/api/auth/reset-password", {
      method: "POST",
      body: data,
      skipAuth: true,
    }),

  verifyEmail: (data: { code: string }) =>
    apiFetch<{ success: boolean }>("/api/auth/verify-email", {
      method: "POST",
      body: data,
    }),

  resendVerification: () =>
    apiFetch<{ success: boolean; cooldownSeconds?: number }>("/api/auth/resend-verification", {
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
    params: {
      q?: string;
      level?: string;
      article?: string;
      page?: number;
      limit?: number;
    } = {},
    signal?: AbortSignal,
  ) =>
    apiFetch<{ words: Word[]; pagination: { total: number; page: number; limit: number; totalPages: number } }>(
      "/api/dictionary/search",
      { query: params as Record<string, string | number>, signal },
    ),
};

/* ═══════════════════════════════════
   Vocabulary API
   ═══════════════════════════════════ */

export type WordStatus = "learning" | "learned" | "unknown";

export type SavedWord = {
  id: string;
  status: WordStatus;
  createdAt: string;
  word: Word;
};

export type Pagination = { total: number; page: number; limit: number; totalPages: number };

export const vocabularyApi = {
  list: (
    params: { page?: number; limit?: number; status?: WordStatus; level?: string } = {},
    signal?: AbortSignal,
  ) =>
    apiFetch<{ words: SavedWord[]; pagination: Pagination }>("/api/vocabulary", {
      query: params as Record<string, string | number>,
      signal,
    }),

  add: (wordId: string, status: WordStatus = "learning") =>
    apiFetch<SavedWord>("/api/vocabulary", { method: "POST", body: { wordId, status } }),

  update: (wordId: string, status: WordStatus) =>
    apiFetch<SavedWord>(`/api/vocabulary/${wordId}`, { method: "PATCH", body: { status } }),

  remove: (wordId: string) => apiFetch(`/api/vocabulary/${wordId}`, { method: "DELETE" }),

  stats: (signal?: AbortSignal) =>
    apiFetch<{ total: number; learning: number; learned: number; unknown: number }>(
      "/api/vocabulary/stats",
      { signal },
    ),
};

/* ═══════════════════════════════════
   Users API
   ═══════════════════════════════════ */

export type ProfileUpdate = {
  firstName?: string;
  lastName?: string;
  bio?: string;
  level?: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
};

export const usersApi = {
  updateProfile: (data: ProfileUpdate) =>
    apiFetch<{ firstName: string | null; lastName: string | null; bio: string | null; level: string; xp: number; streak: number }>(
      "/api/users/me/profile",
      { method: "PATCH", body: data },
    ),
};
