"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { authApi, type AuthUser } from "@/lib/api";

type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  needsEmailVerification: boolean;

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
  loadUser: () => Promise<void>;
  clearError: () => void;
};

/**
 * SSR-safe storage: فقط در محیط مرورگر از localStorage استفاده می‌کنه.
 * در SSR یک storage خالی برمی‌گردونه که باعث نمی‌شه خطای hydration بده.
 */
const ssrSafeStorage = {
  getItem: (name: string): string | null => {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(name, value);
    } catch {
      // ignore
    }
  },
  removeItem: (name: string): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(name);
    } catch {
      // ignore
    }
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      needsEmailVerification: false,

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const result = await authApi.login(email, password);
          set({
            user: result.user,
            accessToken: result.accessToken,
            isAuthenticated: true,
            loading: false,
            error: null,
            needsEmailVerification: !result.user.role,
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
          set({
            user: result.user,
            accessToken: result.accessToken,
            isAuthenticated: true,
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
          set({
            user: result.user,
            accessToken: result.accessToken,
            isAuthenticated: true,
            loading: false,
            error: null,
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
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          needsEmailVerification: false,
        });
      },

      verifyEmail: async (code) => {
        const { accessToken } = get();
        if (!accessToken) {
          set({ error: "ابتدا وارد شوید." });
          return { success: false };
        }
        set({ loading: true, error: null });
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/auth/verify-email`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({ code }),
              credentials: "include",
            },
          );
          const json = await res.json();
          if (!res.ok) {
            throw new Error(json?.error?.message ?? "خطا در تأیید ایمیل.");
          }
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

      loadUser: async () => {
        const { accessToken } = get();
        if (!accessToken) {
          set({ isAuthenticated: false });
          return;
        }
        try {
          const user = await authApi.me(accessToken);
          set({
            user: {
              id: user.id,
              email: user.email,
              username: user.username,
              role: user.role,
            },
            isAuthenticated: true,
            needsEmailVerification: !user.isEmailVerified,
          });
        } catch {
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "lingo-auth",
      // skipHydration جلوی خطای hydration mismatch رو می‌گیره
      // در اولین رندر سمت کلاینت، SSR state نمایش داده می‌شه
      // بعد از hydration در client، state از localStorage خوانده می‌شه
      skipHydration: true,
      storage: createJSONStorage(() => ssrSafeStorage),
      partialize: (s) => ({
        accessToken: s.accessToken,
        user: s.user,
      }),
    },
  ),
);
