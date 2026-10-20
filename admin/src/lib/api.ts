/**
 * کلاینت API پنل ادمین (اجرا در مرورگر).
 *
 * - هدر Authorization به‌صورت خودکار از token-store اضافه می‌شود.
 * - با 401، یک بار (حتی با چند درخواست هم‌زمان) refresh انجام می‌شود و درخواست تکرار می‌شود.
 * - اگر refresh شکست بخورد، توکن‌ها پاک می‌شوند و رویداد `lingo-admin:unauthorized` ارسال می‌شود
 *   تا لایه‌ی UI کاربر را به صفحه‌ی ورود ببرد.
 *
 * آدرس بک‌اند: NEXT_PUBLIC_API_URL (پیش‌فرض http://localhost:4000)
 */

import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "./token-store";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

/** برای نمایش در صفحه‌ی تنظیمات. */
export const API_BASE_URL = API_BASE;

export const UNAUTHORIZED_EVENT = "lingo-admin:unauthorized";

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

/** پیام قابل‌نمایش به کاربر از هر نوع خطا. */
export function errorMessage(error: unknown, fallback = "خطایی رخ داد. دوباره تلاش کن."): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof TypeError) return "ارتباط با سرور برقرار نشد. مطمئن شو بک‌اند روشن است.";
  return fallback;
}

type Query = Record<string, string | number | boolean | undefined | null>;

type FetchOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Query;
  /** برای login/refresh که نباید خودکار refresh شوند. */
  skipAuth?: boolean;
  signal?: AbortSignal;
};

function buildUrl(path: string, query?: Query): string {
  const url = new URL(`${API_BASE}${path}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
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
    cache: "no-store",
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
      json.error?.message ?? `خطای سرور (${response.status})`,
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
    const refreshToken = getRefreshToken();
    if (!refreshToken) return null;

    try {
      const result = await rawRequest<{ accessToken: string; refreshToken: string }>(
        "/api/auth/refresh",
        { method: "POST", body: { refreshToken }, skipAuth: true },
        null,
      );
      setAccessToken(result.accessToken);
      setRefreshToken(result.refreshToken);
      return result.accessToken;
    } catch (error) {
      // فقط وقتی سرور صراحتاً رد کرده توکن‌ها را پاک کن؛ قطعی شبکه نباید کاربر را خارج کند.
      if (error instanceof ApiError) clearTokens();
      return null;
    }
  })().finally(() => {
    refreshInFlight = null;
  });

  return refreshInFlight;
}

export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  if (options.skipAuth) return rawRequest<T>(path, options, null);

  try {
    return await rawRequest<T>(path, options, getAccessToken());
  } catch (error) {
    if (!(error instanceof ApiError) || error.statusCode !== 401) throw error;

    const fresh = await refreshAccessToken();
    if (!fresh) {
      if (typeof window !== "undefined") window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
      throw error;
    }
    return rawRequest<T>(path, options, fresh);
  }
}

/* ═══════════════════════════════════
   Auth
   ═══════════════════════════════════ */

export type AuthUser = {
  id: string;
  email: string;
  username: string;
  role: string;
};

export type MeResponse = AuthUser & {
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
};

export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<{ user: AuthUser; accessToken: string; refreshToken: string }>("/api/auth/login", {
      method: "POST",
      body: { email, password },
      skipAuth: true,
    }),

  me: (signal?: AbortSignal) => apiFetch<MeResponse>("/api/auth/me", { signal }),

  logout: (refreshToken: string | null) =>
    apiFetch<{ success: boolean }>("/api/auth/logout", {
      method: "POST",
      body: refreshToken ? { refreshToken } : {},
      skipAuth: true,
    }),
};

/* ═══════════════════════════════════
   Users (admin)
   ═══════════════════════════════════ */

export type UserStatus = "active" | "blocked" | "suspended";
export type UserRole = "user" | "guest" | "premium" | "admin";

export type AdminUser = {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  status: UserStatus;
  isEmailVerified: boolean;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
  profile: {
    firstName: string | null;
    lastName: string | null;
    level: string;
    xp: number;
    streak: number;
  } | null;
};

export type AdminUserDetail = AdminUser & {
  profile: (NonNullable<AdminUser["profile"]> & { bio: string | null }) | null;
  stats: {
    savedWords: number;
    learnedWords: number;
    learningWords: number;
    sessions: number;
  };
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ListUsersParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: UserStatus | "";
  role?: UserRole | "";
};

export const adminUsersApi = {
  list: (params: ListUsersParams = {}, signal?: AbortSignal) =>
    apiFetch<{ users: AdminUser[]; pagination: Pagination }>("/api/admin/users", {
      query: params,
      signal,
    }),

  get: (id: string, signal?: AbortSignal) => apiFetch<AdminUserDetail>(`/api/admin/users/${id}`, { signal }),

  update: (id: string, data: { role?: UserRole; status?: UserStatus; isEmailVerified?: boolean }) =>
    apiFetch<Pick<AdminUser, "id" | "email" | "username" | "role" | "status" | "isEmailVerified">>(
      `/api/admin/users/${id}`,
      { method: "PATCH", body: data },
    ),
};

/* ═══════════════════════════════════
   Stats (admin)
   ═══════════════════════════════════ */

export type AdminStats = {
  users: {
    total: number;
    active: number;
    blocked: number;
    suspended: number;
    verified: number;
    newLast7Days: number;
    byRole: Record<string, number>;
  };
  words: {
    total: number;
    byLevel: Record<string, number>;
  };
  learning: {
    savedWords: number;
    learnedWords: number;
  };
  signups: Array<{ date: string; count: number }>;
};

export const adminStatsApi = {
  get: (signal?: AbortSignal) => apiFetch<AdminStats>("/api/admin/stats", { signal }),
};

/* ═══════════════════════════════════
   Dictionary
   ═══════════════════════════════════ */

export type Article = "der" | "die" | "das";

export type Word = {
  id: string;
  german: string;
  persian: string;
  article: Article | null;
  plural: string | null;
  partOfSpeech: string | null;
  level: string;
  example: string | null;
  exampleFa: string | null;
  ipa: string | null;
  audioUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type WordInput = {
  german: string;
  persian: string;
  article?: Article | null;
  plural?: string;
  partOfSpeech?: string;
  level?: string;
  example?: string;
  exampleFa?: string;
  ipa?: string;
  audioUrl?: string;
};

export type SearchWordsParams = {
  q?: string;
  level?: string;
  article?: string;
  partOfSpeech?: string;
  page?: number;
  limit?: number;
};

export const dictionaryApi = {
  search: (params: SearchWordsParams = {}, signal?: AbortSignal) =>
    apiFetch<{ words: Word[]; pagination: Pagination }>("/api/dictionary/search", {
      query: params,
      signal,
    }),

  create: (data: WordInput) =>
    apiFetch<Word>("/api/admin/dictionary", { method: "POST", body: data }),

  update: (id: string, data: Partial<WordInput>) =>
    apiFetch<Word>(`/api/admin/dictionary/${id}`, { method: "PATCH", body: data }),

  remove: (id: string) =>
    apiFetch<{ success: boolean }>(`/api/admin/dictionary/${id}`, { method: "DELETE" }),
};

/* ═══════════════════════════════════
   Health
   ═══════════════════════════════════ */

export type HealthInfo = { status: string; [key: string]: unknown };

export const healthApi = {
  get: (signal?: AbortSignal) => apiFetch<HealthInfo>("/api/health", { skipAuth: true, signal }),
};
