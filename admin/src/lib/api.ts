/**
 * LINGO API Client
 *
 * Server-side fetch wrapper with auth + auto refresh.
 * Backend base URL: http://localhost:4000 (configurable via NEXT_PUBLIC_API_URL)
 *
 * NOTE: This must run on the server because:
 *   1. z-ai-web-dev-sdk requires server context
 *   2. Backend CORS only allows specific origins
 *   3. We don't want to leak access token to client
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

/**
 * ساخت URL با query string.
 */
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
 * در صورت 401، یک‌بار refresh می‌کند و دوباره امتحان می‌کند.
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

  const res = await fetch(buildUrl(path, query), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  // 204 No Content
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
   Auth endpoints
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
  login: (email: string, password: string) =>
    apiFetch<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: { email, password },
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

  logout: (refreshToken?: string) =>
    apiFetch<{ success: boolean }>("/api/auth/logout", {
      method: "POST",
      body: { refreshToken },
    }),
};

/* ═══════════════════════════════════
   Admin Users endpoints
   ═══════════════════════════════════ */

export type AdminUser = {
  id: string;
  email: string;
  username: string;
  role: string;
  status: string;
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

export type ListUsersResponse = {
  users: AdminUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export const adminUsersApi = {
  list: (
    token: string,
    params: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
      role?: string;
    } = {},
  ) =>
    apiFetch<ListUsersResponse>("/api/admin/users", {
      token,
      query: params as Record<string, string | number>,
    }),

  update: (
    token: string,
    userId: string,
    data: {
      role?: string;
      status?: string;
      isEmailVerified?: boolean;
    },
  ) =>
    apiFetch<AdminUser>(`/api/admin/users/${userId}`, {
      method: "PATCH",
      token,
      body: data,
    }),
};

/* ═══════════════════════════════════
   Dictionary endpoints
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
  createdAt: string;
  updatedAt: string;
};

export type ListWordsResponse = {
  words: Word[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type CreateWordInput = {
  german: string;
  persian: string;
  article?: "der" | "die" | "das" | null;
  plural?: string;
  partOfSpeech?: string;
  level?: string;
  example?: string;
  exampleFa?: string;
  ipa?: string;
  audioUrl?: string;
};

export const dictionaryApi = {
  search: (
    token: string | null,
    params: {
      q?: string;
      level?: string;
      article?: string;
      partOfSpeech?: string;
      page?: number;
      limit?: number;
    } = {},
  ) =>
    apiFetch<ListWordsResponse>("/api/dictionary/search", {
      token,
      query: params as Record<string, string | number>,
    }),

  create: (token: string, data: CreateWordInput) =>
    apiFetch<Word>("/api/admin/dictionary", {
      method: "POST",
      token,
      body: data,
    }),

  update: (token: string, id: string, data: Partial<CreateWordInput>) =>
    apiFetch<Word>(`/api/admin/dictionary/${id}`, {
      method: "PATCH",
      token,
      body: data,
    }),

  delete: (token: string, id: string) =>
    apiFetch<{ success: boolean }>(`/api/admin/dictionary/${id}`, {
      method: "DELETE",
      token,
    }),
};
