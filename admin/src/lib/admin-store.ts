import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi, type AuthUser } from "./api";

export type AdminView =
  | "dashboard"
  | "users"
  | "user-detail"
  | "dictionary"
  | "settings";

type AdminState = {
  /* Auth */
  isAuthenticated: boolean;
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  authLoading: boolean;
  authError: string | null;

  /* Navigation */
  currentView: AdminView;
  selectedUserId: string | null;
  setView: (view: AdminView) => void;
  openUserDetail: (userId: string) => void;

  /* Theme */
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (t: "light" | "dark") => void;

  /* Mobile sidebar */
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  /* Auth actions */
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loadUser: () => Promise<void>;
};

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      authLoading: false,
      authError: null,

      currentView: "dashboard",
      selectedUserId: null,
      setView: (view) =>
        set({
          currentView: view,
          selectedUserId: view === "users" ? null : get().selectedUserId,
        }),
      openUserDetail: (userId) =>
        set({ currentView: "user-detail", selectedUserId: userId }),

      theme: "dark",
      toggleTheme: () => {
        const isDark = document.documentElement.classList.contains("dark");
        const next = isDark ? "light" : "dark";
        document.documentElement.classList.toggle("dark", next === "dark");
        try {
          localStorage.setItem("lingo-admin-theme", next);
        } catch {}
        set({ theme: next });
      },
      setTheme: (t) => {
        document.documentElement.classList.toggle("dark", t === "dark");
        try {
          localStorage.setItem("lingo-admin-theme", t);
        } catch {}
        set({ theme: t });
      },

      sidebarOpen: false,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      login: async (email, password) => {
        set({ authLoading: true, authError: null });
        try {
          const result = await authApi.login(email, password);

          // فقط ادمین‌ها می‌تونن وارد بشن
          if (result.user.role !== "admin") {
            set({
              authLoading: false,
              authError: "شما دسترسی ادمین ندارید.",
            });
            return false;
          }

          set({
            isAuthenticated: true,
            user: result.user,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            authLoading: false,
            authError: null,
          });
          return true;
        } catch (err) {
          const error = err as { message?: string };
          set({
            authLoading: false,
            authError: error.message ?? "خطا در ورود.",
          });
          return false;
        }
      },

      logout: () => {
        const { refreshToken } = get();
        // در background logout کن
        if (refreshToken) {
          authApi.logout(refreshToken).catch(() => {});
        }
        set({
          isAuthenticated: false,
          user: null,
          accessToken: null,
          refreshToken: null,
          currentView: "dashboard",
          selectedUserId: null,
        });
      },

      loadUser: async () => {
        const { accessToken } = get();
        if (!accessToken) {
          set({ isAuthenticated: false, user: null });
          return;
        }
        try {
          const user = await authApi.me(accessToken);
          set({
            isAuthenticated: true,
            user: {
              id: user.id,
              email: user.email,
              username: user.username,
              role: user.role,
            },
          });
        } catch {
          set({
            isAuthenticated: false,
            user: null,
            accessToken: null,
            refreshToken: null,
          });
        }
      },
    }),
    {
      name: "lingo-admin-store",
      partialize: (s) => ({
        accessToken: s.accessToken,
        refreshToken: s.refreshToken,
        theme: s.theme,
      }),
    },
  ),
);
