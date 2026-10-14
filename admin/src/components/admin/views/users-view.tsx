"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Eye,
  Ban,
  Unlock,
} from "lucide-react";
import { useAdminStore } from "@/lib/admin-store";
import { adminUsersApi, type AdminUser } from "@/lib/api";
import { StatusBadge, RoleBadge } from "../badges";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

type FilterStatus = "all" | "active" | "blocked" | "suspended";
type FilterRole = "all" | "user" | "guest" | "premium" | "admin";

export function UsersView() {
  const { accessToken, openUserDetail } = useAdminStore();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [roleFilter, setRoleFilter] = useState<FilterRole>("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [data, setData] = useState<{
    users: AdminUser[];
    total: number;
    totalPages: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await adminUsersApi.list(accessToken, {
          page,
          limit: pageSize,
          search: search || undefined,
          status: statusFilter === "all" ? undefined : statusFilter,
          role: roleFilter === "all" ? undefined : roleFilter,
        });
        if (!cancelled) {
          setData({
            users: result.users,
            total: result.pagination.total,
            totalPages: result.pagination.totalPages,
          });
        }
      } catch (err) {
        const error = err as { message?: string };
        if (!cancelled) setError(error.message ?? "خطا در بارگذاری کاربران");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const t = setTimeout(load, 250); // debounce
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [accessToken, page, search, statusFilter, roleFilter]);

  const handleUpdate = async (
    userId: string,
    updates: { role?: string; status?: string },
  ) => {
    if (!accessToken) return;
    try {
      await adminUsersApi.update(accessToken, userId, updates);
      toast({
        title: "به‌روزرسانی شد",
        description: "وضعیت کاربر با موفقیت تغییر کرد.",
      });
      // Reload current page
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          users: prev.users.map((u) =>
            u.id === userId
              ? {
                  ...u,
                  role: updates.role ?? u.role,
                  status: updates.status ?? u.status,
                }
              : u,
          ),
        };
      });
    } catch (err) {
      const error = err as { message?: string };
      toast({
        title: "خطا",
        description: error.message ?? "به‌روزرسانی ناموفق بود.",
        variant: "destructive",
      });
    }
  };

  const users = data?.users ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-xs">
            <Search
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="جستجو..."
              className="h-10 w-full rounded-lg border border-input bg-background pr-10 pl-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as FilterStatus);
                setPage(1);
              }}
              className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">همه وضعیت‌ها</option>
              <option value="active">فعال</option>
              <option value="blocked">مسدود</option>
              <option value="suspended">معلق</option>
            </select>
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value as FilterRole);
                setPage(1);
              }}
              className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">همه نقش‌ها</option>
              <option value="user">کاربر</option>
              <option value="guest">مهمان</option>
              <option value="premium">پرمیوم</option>
              <option value="admin">مدیر</option>
            </select>
          </div>
        </div>
      </div>

      {/* Count */}
      <p className="text-sm text-muted-foreground">
        {data ? `${data.total.toLocaleString("fa-IR")} کاربر` : "در حال بارگذاری..."}
      </p>

      {/* Table (desktop) */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-right">
                <th className="px-4 py-3 font-semibold text-muted-foreground">کاربر</th>
                <th className="px-4 py-3 font-semibold text-muted-foreground">نقش</th>
                <th className="px-4 py-3 font-semibold text-muted-foreground">سطح</th>
                <th className="px-4 py-3 font-semibold text-muted-foreground">وضعیت</th>
                <th className="px-4 py-3 font-semibold text-muted-foreground">عضویت</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    در حال بارگذاری...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-danger">
                    {error}
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    هیچ کاربری یافت نشد.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => openUserDetail(u.id)}
                        className="flex items-center gap-3 text-right"
                      >
                        <span
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                          style={{
                            backgroundImage: "linear-gradient(135deg, var(--primary), var(--secondary-c))",
                          }}
                        >
                          {(u.profile?.firstName ?? u.username).charAt(0)}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate font-semibold">
                            {u.profile?.firstName ?? u.username}{" "}
                            {u.profile?.lastName ?? ""}
                          </span>
                          <span className="block truncate text-xs text-muted-foreground" dir="ltr">
                            {u.email}
                          </span>
                        </span>
                      </button>
                    </td>
                    <td className="px-4 py-3"><RoleBadge role={u.role as "user" | "guest" | "premium" | "admin"} /></td>
                    <td className="px-4 py-3 font-mono text-xs font-bold">{u.profile?.level ?? "A1"}</td>
                    <td className="px-4 py-3"><StatusBadge status={u.status as "active" | "blocked" | "suspended"} /></td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {new Date(u.createdAt).toLocaleDateString("fa-IR")}
                    </td>
                    <td className="px-4 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted"
                            aria-label="عملیات"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => openUserDetail(u.id)}>
                            <Eye className="h-4 w-4" />
                            مشاهده پروفایل
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {u.status === "blocked" ? (
                            <DropdownMenuItem
                              onClick={() => handleUpdate(u.id, { status: "active" })}
                              className="text-success focus:text-success"
                            >
                              <Unlock className="h-4 w-4" />
                              رفع مسدودیت
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => handleUpdate(u.id, { status: "blocked" })}
                              className="text-danger focus:text-danger"
                            >
                              <Ban className="h-4 w-4" />
                              مسدود کردن
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="divide-y divide-border md:hidden">
          {loading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              در حال بارگذاری...
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              کاربری یافت نشد.
            </div>
          ) : (
            users.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => openUserDetail(u.id)}
                className="flex w-full items-center gap-3 p-4 text-right hover:bg-muted/30"
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{
                    backgroundImage: "linear-gradient(135deg, var(--primary), var(--secondary-c))",
                  }}
                >
                  {(u.profile?.firstName ?? u.username).charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {u.profile?.firstName ?? u.username} {u.profile?.lastName ?? ""}
                  </p>
                  <p className="truncate text-xs text-muted-foreground" dir="ltr">
                    {u.email}
                  </p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <StatusBadge status={u.status as "active" | "blocked" | "suspended"} />
                    <RoleBadge role={u.role as "user" | "guest" | "premium" | "admin"} />
                  </div>
                </div>
                <ChevronLeft className="h-4 w-4 text-muted-foreground" />
              </button>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 ? (
          <div className="flex items-center justify-between border-t border-border p-3 text-sm">
            <p className="text-muted-foreground">
              صفحه {page.toLocaleString("fa-IR")} از {totalPages.toLocaleString("fa-IR")}
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:border-primary/40 disabled:opacity-40"
                aria-label="صفحه قبل"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:border-primary/40 disabled:opacity-40"
                aria-label="صفحه بعد"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default UsersView;
