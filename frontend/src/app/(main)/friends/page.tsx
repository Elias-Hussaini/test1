import type { Metadata } from "next";
import { Users } from "lucide-react";
import { ComingSoon, PageHeader } from "@/components/app/ui";

export const metadata: Metadata = { title: "دوستان" };

export default function FriendsPage() {
  return (
    <>
      <PageHeader title="دوستان" description="با دوستانت آلمانی تمرین کن." />
      <ComingSoon
        Icon={Users}
        title="فهرست دوستان به‌زودی فعال می‌شود"
        description="سامانه‌ی دوستان هنوز به بک‌اند وصل نشده است. هیچ دوست یا درخواستی نمایش داده نمی‌شود تا زمانی که واقعی باشد."
        points={["جستجوی کاربران با نام کاربری", "ارسال و پذیرش درخواست دوستی", "پروفایل کوتاه و سطح هر دوست", "شروع گفتگو یا تماس از همین‌جا"]}
      />
    </>
  );
}
