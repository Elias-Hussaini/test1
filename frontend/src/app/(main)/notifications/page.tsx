import type { Metadata } from "next";
import { BellOff } from "lucide-react";
import { Card, EmptyState, PageHeader } from "@/components/app/ui";

export const metadata: Metadata = { title: "اعلان‌ها" };

export default function NotificationsPage() {
  return (
    <>
      <PageHeader title="اعلان‌ها" description="درخواست دوستی، پیام‌ها و یادآوری مرور اینجا می‌آیند." />
      <Card>
        <EmptyState
          Icon={BellOff}
          title="اعلانی نداری"
          description="مرکز اعلان هنوز به بک‌اند وصل نشده است؛ بعد از اتصال، اعلان‌های واقعی با وضعیت خوانده/نخوانده اینجا نمایش داده می‌شوند."
        />
      </Card>
    </>
  );
}
