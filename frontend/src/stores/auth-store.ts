"use client";

import { create } from "zustand";
import { authApi, refreshAccessToken } from "@/lib/api";
import {
  clearSession,
  getSessionHint,
  setAccessToken,
  setSessionHint,
  type SessionHint,
} from "@/lib/token-store";

export type AuthUser = {
  id: string;
  email: string;
  username: string;
  role: string;
  level?: string;
  isEmailVerified?: boolean;
};

export type SessionStatus = "loading" | "authed" | "anon";

type AuthState = {
  status: SessionStatus;
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  needsEmailVerification: boolean;

  restore: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; needsVerification?: boolean }>;
  register: (data: {
    email: string;
    password: string;
    username: string;
    firstName?: string;
    lastName?: string;
  }) => Promise<{ success: boolean; needsVerification?: boolean }>;
  loginAsGuest: () => Promise<{ success: boolean }>;
  logout: () => Promise<void>;
  verifyEmail: (code: string) => Promise<{ success: boolean }>;
  clearError: () => void;
};

let restoring: Promise<void> | null = null;

export const useAuthStore = create<AuthState>()((set, get) => ({
  status: "loading",
  user: null,
  loading: false,
  error: null,
  needsEmailVerification: false,

  restore: () => {
    if (get().status !== "loading") return Promise.resolve();
    if (restoring) return restoring;

    restoring = (async () => {
      const hint = getSessionHint();
      if (!hint) {
        set({ status: "anon", user: null });
        return;
      }

      const token = await refreshAccessToken();
      if (!token) {
        clearSession();
        set({ status: "anon", user: null });
        return;
      }

      try {
        const me = await authApi.me();
        const user: AuthUser = {
          id: me.id,
          email: me.email,
          username: me.username,
          role: me.role,
          level: me.profile?.level,
          isEmailVerified: me.isEmailVerified,
        };
        setSessionHint({
          userId: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
        });
        set({
          status: "authed",
          user,
          needsEmailVerification: !me.isEmailVerified,
        });
      } catch {
        clearSession();
        set({ status: "anon", user: null });
      }
    })().finally(() => {
      restoring = null;
    });

    return restoring;
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const result = await authApi.login(email, password);
      const user: AuthUser = {
        id: result.user.id,
        email: result.user.email,
        username: result.user.username,
        role: result.user.role,
        level: result.user.level,
      };
      setAccessToken(result.accessToken);
      setSessionHint({
        userId: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      });
      set({
        status: "authed",
        user,
        loading: false,
        error: null,
        needsEmailVerification: false,
      });
      return { success: true };
    } catch (err) {
      const error = err as { message?: string; code?: string };
      set({
        loading: false,
        error: error.message ?? "خطا در ورود.",
      });
      return { success: false };
    }
  },

  register: async (data) => {
    set({ loading: true, error: null });
    try {
      const result = await authApi.register(data);
      const user: AuthUser = {
        id: result.user.id,
        email: result.user.email,
        username: result.user.username,
        role: result.user.role,
        level: result.user.level,
      };
      setAccessToken(result.accessToken);
      setSessionHint({
        userId: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      });
      set({
        status: "authed",
        user,
        loading: false,
        error: null,
        needsEmailVerification: true,
      });
      return { success: true, needsVerification: true };
    } catch (err) {
      const error = err as { message?: string; code?: string };
      set({
        loading: false,
        error: error.message ?? "خطا در ثبت‌نام.",
      });
      return { success: false };
    }
  },

  loginAsGuest: async () => {
    set({ loading: true, error: null });
    try {
      const result = await authApi.guest();
      const user: AuthUser = {
        id: result.user.id,
        email: result.user.email,
        username: result.user.username,
        role: result.user.role,
        level: result.user.level,
      };
      setAccessToken(result.accessToken);
      setSessionHint({
        userId: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      });
      set({
        status: "authed",
        user,
        loading: false,
        error: null,
        needsEmailVerification: false,
      });
      return { success: true };
    } catch (err) {
      const error = err as { message?: string };
      set({
        loading: false,
        error: error.message ?? "خطا در ورود مهمان.",
      });
      return { success: false };
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore
    }
    clearSession();
    set({
      status: "anon",
      user: null,
      needsEmailVerification: false,
    });
  },

  verifyEmail: async (code) => {
    if (get().status !== "authed") {
      set({ error: "ابتدا وارد شوید." });
      return { success: false };
    }
    set({ loading: true, error: null });
    try {
      await authApi.verifyEmail({ code });
      set({
        needsEmailVerification: false,
        loading: false,
      });
      return { success: true };
    } catch (err) {
      const error = err as { message?: string };
      set({
        loading: false,
        error: error.message ?? "خطا در تأیید ایمیل.",
      });
      return { success: false };
    }
  },

  clearError: () => set({ error: null }),
}));
