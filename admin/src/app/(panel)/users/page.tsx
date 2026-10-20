import type { Metadata } from "next";
import { UsersView } from "@/components/admin/views/users-view";

export const metadata: Metadata = { title: "کاربران" };

export default function UsersPage() {
  return <UsersView />;
}
