"use client";

import { Video } from "lucide-react";
import { ComingSoon, LockedNotice, PageHeader } from "@/components/app/ui";
import DeviceCheck from "@/components/classes/device-check";
import { usePlan } from "@/hooks/use-plan";

export default function ClassesPage() {
  const { can } = usePlan();
  return (
    <>
      <PageHeader title="کلاس‌های آنلاین" description="کلاس زنده با معلم و هم‌کلاسی‌ها، همراه با لغات مشترک." />
      {can("classes") ? (
        <div className="space-y-4">
          <ComingSoon
            Icon={Video}
            title="کلاس‌های زنده به‌زودی فعال می‌شوند"
            description="سرویس تماس تصویری (WebRTC یا ارائه‌دهنده‌ی ویدیو) هنوز راه‌اندازی نشده است؛ بنابراین کلاسی برای نمایش وجود ندارد."
            points={["برنامه‌ی کلاس‌ها و ثبت‌نام", "دوربین و میکروفون با مدیریت مجوز", "فهرست شرکت‌کنندگان", "لغات و یادداشت مشترک حین کلاس", "اشتراک تصویر حین تماس"]}
          />
          <DeviceCheck />
        </div>
      ) : (
        <LockedNotice feature="classes" />
      )}
    </>
  );
}
