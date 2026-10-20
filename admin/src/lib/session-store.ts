import { create } from "zustand";
import { ApiError, authApi, refreshAccessToken, type AuthUser } from "./api";
import { clearTokens, getRefreshToken, setAccessToken, setRefreshToken } from "./token-store";

/**
 * وضعیت نشست ادمین. عمداً persist نمی‌شود:
 * - access token فقط در حافظه است،
 * - refresh token در sessionStorage (token-store) است،
 * - با باز شدن تب، `restore()` نشست را از refresh token دوباره می‌سازد.
 */

export type SessionStatus = "loading" | "authed" | "anon";

type SessionState = {
  status: SessionStatus;
  user: AuthUser | null;
  restore: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  expire: () => void;
};

let restoring: Promise<void> | null = null;

export const useSession = create<SessionState>()((set, get) => ({
  status: "loading",
  user: null,

  restore: () => {
    if (get().status !== "loading") return Promise.resolve();
    if (restoring) return restoring;

    restoring = (async () => {
      if (!getRefreshToken()) {
        set({ status: "anon", user: null });
        return;
      }

      const token = await refreshAccessToken();
      if (!token) {
        set({ status: "anon", user: null });
        return;
      }

      try {
        const me = await authApi.me();
        if (me.role !== "admin") {
          clearTokens();
          set({ status: "anon", user: null });
          return;
        }
        set({
          status: "authed",
          user: { id: me.id, email: me.email, username: me.username, role: me.role },
        });
      } catch {
        clearTokens();
        set({ status: "anon", user: null });
      }
    })().finally(() => {
      restoring = null;
    });

    return restoring;
  },

  login: async (email, password) => {
    const result = await authApi.login(email, password);

    if (result.user.role !== "admin") {
      // حساب عادی نباید نشست باز بگذارد؛ همین الان در سرور بسته می‌شود.
      await authApi.logout(result.refreshToken).catch(() => undefined);
      throw new ApiError("FORBIDDEN", "این حساب به پنل مدیریت دسترسی ندارد.", 403);
    }

    setAccessToken(result.accessToken);
    setRefreshToken(result.refreshToken);
    set({ status: "authed", user: result.user });
  },

  logout: async () => {
    const refreshToken = getRefreshToken();
    clearTokens();
    set({ status: "anon", user: null });
    if (refreshToken) await authApi.logout(refreshToken).catch(() => undefined);
  },

  expire: () => {
    clearTokens();
    set({ status: "anon", user: null });
  },
}));
