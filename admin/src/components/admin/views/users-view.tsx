"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { Ellipsis, MailCheck, MailQuestion, Search, Users } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useApi, useDebouncedValue } from "@/hooks/use-api";
import { adminUsersApi, type AdminUser, type UserRole, type UserStatus } from "@/lib/api";
import { faDate, faNumber } from "@/lib/format";
import { RoleBadge, StatusBadge } from "../badges";
import { FilterSelect, SearchInput } from "../common/controls";
import { ConfirmDialog } from "../common/confirm-dialog";
import { PageHeader, Panel } from "../common/page-header";
import { Pagination } from "../common/pagination";
import { EmptyState, ErrorState, Skeleton } from "../common/states";
import { actionsFor, useUserActions } from "../user-actions";

const PAGE_SIZE = 15;

export function UsersView() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<UserStatus | "">("");
  const [role, setRole] = useState<UserRole | "">("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search.trim());

  const { data, error, loading, reload, setData } = useApi(
    (signal) => adminUsersApi.list({ page, limit: PAGE_SIZE, search: debouncedSearch, status, role }, signal),
    [page, debouncedSearch, status, role],
  );

  const handleUpdated = useCallback(
    (id: string, fields: Partial<AdminUser>) =>
      setData((current) => ({ ...current, users: current.users.map((user) => (user.id === id ? { ...user, ...fields } : user)) })),
    [setData],
  );
  const actions = useUserActions(handleUpdated);

  const users = data?.users ?? [];
  const filtersActive = Boolean(debouncedSearch || status || role);

  return (
    <>
      <PageHeader title="کاربران" description={data ? `${faNumber(data.pagination.total)} حساب ${filtersActive ? "مطابق فیلترها" : "در سیستم"}` : "مدیریت حساب‌های LINGO"} />

      <Panel>
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
          <div className="relative min-w-[14rem] flex-1">
            <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <SearchInput
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="جستجو با ایمیل یا نام کاربری…"
              aria-label="جستجوی کاربر"
              className="pl-10"
            />
          </div>
          <FilterSelect
            label="فیلتر وضعیت"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as UserStatus | "");
              setPage(1);
            }}
          >
            <option value="">همه‌ی وضعیت‌ها</option>
            <option value="active">فعال</option>
            <option value="suspended">معلق</option>
            <option value="blocked">مسدود</option>
          </FilterSelect>
          <FilterSelect
            label="فیلتر نقش"
            value={role}
            onChange={(event) => {
              setRole(event.target.value as UserRole | "");
              setPage(1);
            }}
          >
            <option value="">همه‌ی نقش‌ها</option>
            <option value="user">کاربر</option>
            <option value="premium">پرمیوم</option>
            <option value="guest">مهمان</option>
            <option value="admin">مدیر</option>
          </FilterSelect>
        </div>

        {error ? (
          <div className="p-5">
            <ErrorState message={error} onRetry={reload} />
          </div>
        ) : loading && !data ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <EmptyState
            icon={Users}
            title={filtersActive ? "کاربری با این فیلترها پیدا نشد" : "هنوز کاربری وجود ندارد"}
            description={filtersActive ? "جستجو یا فیلترها را تغییر بده." : undefined}
          />
        ) : (
          <div className={loading ? "opacity-60 transition-opacity" : "transition-opacity"} aria-busy={loading}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-border text-right text-xs text-muted-foreground">
                    <th scope="col" className="px-5 py-3 font-semibold">کاربر</th>
                    <th scope="col" className="px-3 py-3 font-semibold">نقش</th>
                    <th scope="col" className="px-3 py-3 font-semibold">وضعیت</th>
                    <th scope="col" className="hidden px-3 py-3 font-semibold lg:table-cell">سطح</th>
                    <th scope="col" className="hidden px-3 py-3 font-semibold md:table-cell">عضویت</th>
                    <th scope="col" className="w-12 px-3 py-3"><span className="sr-only">عملیات</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((user) => {
                    const available = actionsFor(user, actions.selfId);
                    return (
                      <tr key={user.id} className="hover:bg-muted/40">
                        <td className="px-5 py-3">
                          <Link href={`/users/${user.id}`} className="flex items-center gap-3">
                            <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary-c text-sm font-bold text-white">
                              {user.username.charAt(0).toUpperCase()}
                            </span>
                            <span className="min-w-0">
                              <span className="flex items-center gap-1.5 font-bold">
                                <span className="truncate">{user.username}</span>
                                {user.isEmailVerified ? (
                                  <MailCheck aria-label="ایمیل تأییدشده" className="h-3.5 w-3.5 shrink-0 text-success" />
                                ) : (
                                  <MailQuestion aria-label="ایمیل تأییدنشده" className="h-3.5 w-3.5 shrink-0 text-warning" />
                                )}
                              </span>
                              <span dir="ltr" className="block truncate text-right text-xs text-muted-foreground">{user.email}</span>
                            </span>
                          </Link>
                        </td>
                        <td className="px-3 py-3"><RoleBadge role={user.role} /></td>
                        <td className="px-3 py-3"><StatusBadge status={user.status} /></td>
                        <td className="hidden px-3 py-3 lg:table-cell">
                          {user.profile ? (
                            <span className="text-xs">
                              <b className="text-primary">{user.profile.level}</b>
                              <span className="text-muted-foreground"> · {faNumber(user.profile.xp)} XP</span>
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="hidden px-3 py-3 text-xs text-muted-foreground md:table-cell">{faDate(user.createdAt)}</td>
                        <td className="px-3 py-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                type="button"
                                aria-label={`عملیات ${user.username}`}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                              >
                                <Ellipsis aria-hidden="true" className="h-4 w-4" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-56">
                              <DropdownMenuItem asChild>
                                <Link href={`/users/${user.id}`}>مشاهده‌ی پروفایل</Link>
                              </DropdownMenuItem>
                              {available.length > 0 ? <DropdownMenuSeparator /> : null}
                              {available.map((action) => (
                                <DropdownMenuItem key={action.key} variant={action.tone === "danger" ? "destructive" : "default"} onClick={() => actions.run(user, action)}>
                                  <action.icon aria-hidden="true" />
                                  {action.label}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Pagination page={page} totalPages={data?.pagination.totalPages ?? 1} total={data?.pagination.total ?? 0} onChange={setPage} disabled={loading} />
          </div>
        )}
      </Panel>

      <ConfirmDialog
        open={actions.pending !== null}
        onOpenChange={(open) => (open ? undefined : actions.cancelPending())}
        title={actions.pending?.action.confirm?.title ?? ""}
        description={actions.pending?.action.confirm?.description ?? ""}
        confirmLabel={actions.pending?.action.confirm?.confirmLabel ?? "تأیید"}
        tone={actions.pending?.action.tone === "danger" ? "danger" : "primary"}
        loading={actions.busy}
        onConfirm={actions.confirmPending}
      />
    </>
  );
}
