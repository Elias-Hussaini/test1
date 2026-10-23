"use client";

import Link from "next/link";
import { Camera, Image as ImageIcon, MessageCircle, Phone, Search, Send, Share2, Wrench } from "lucide-react";
import { EmptyState } from "@/components/app/ui";

const tools = [
  { Icon: Share2, label: "اشتراک لغت" },
  { Icon: ImageIcon, label: "تصویر" },
  { Icon: Phone, label: "تماس صوتی" },
  { Icon: Camera, label: "ویدیو کال" },
] as const;

/** رابط پیام‌رسان؛ سرویس پیام‌رسانی هنوز به بک‌اند وصل نیست. */
export default function ChatWorkspace() {
  return (
    <div className="space-y-4">
      <div role="status" className="flex items-start gap-3 rounded-2xl border border-primary/30 bg-primary/10 p-4 text-sm leading-7">
        <Wrench aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-primary" />
        <p><b>سرویس پیام‌رسانی هنوز متصل نیست.</b> بعد از اتصال، گفتگوها فقط برای اعضای خودشان قابل مشاهده خواهند بود.</p>
      </div>

      <div className="app-card grid min-h-[28rem] overflow-hidden md:grid-cols-[17rem_1fr]">
        <section aria-label="گفتگوها" className="flex flex-col border-border md:border-e">
          <div className="p-3">
            <div className="relative">
              <Search aria-hidden="true" className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input disabled className="field ps-10" placeholder="جستجوی گفتگو" aria-label="جستجوی گفتگو" />
            </div>
          </div>
          <EmptyState Icon={MessageCircle} title="گفتگویی نداری" description="بعد از اضافه‌کردن دوست، گفتگوها اینجا نمایش داده می‌شوند." action={<Link href="/friends/" className="btn-soft">دوستان</Link>} className="flex-1" />
        </section>

        <section aria-label="گفتگوی فعال" className="hidden flex-col md:flex">
          <div className="flex flex-1 items-center justify-center p-6 text-center text-sm text-muted">یک گفتگو را انتخاب کن</div>
          <div className="flex items-center gap-2 border-t border-border p-3">
            {tools.map((t) => (
              <button key={t.label} type="button" disabled className="icon-btn opacity-60" aria-label={`${t.label} (به‌زودی)`} title={`${t.label} · به‌زودی`}>
                <t.Icon aria-hidden="true" className="h-[18px] w-[18px]" />
              </button>
            ))}
            <input disabled className="field flex-1" placeholder="پیام…" aria-label="متن پیام" />
            <button type="button" disabled className="btn-primary !h-11 !w-11 !p-0" aria-label="ارسال">
              <Send aria-hidden="true" className="h-4 w-4 -scale-x-100" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
