import type { Metadata } from "next";
import { DashboardView } from "@/components/admin/views/dashboard-view";

export const metadata: Metadata = { title: "داشبورد" };

export default function DashboardPage() {
  return <DashboardView />;
}
