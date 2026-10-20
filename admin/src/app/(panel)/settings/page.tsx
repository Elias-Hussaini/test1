import type { Metadata } from "next";
import { SettingsView } from "@/components/admin/views/settings-view";

export const metadata: Metadata = { title: "تنظیمات" };

export default function SettingsPage() {
  return <SettingsView />;
}
