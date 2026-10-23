import type { Metadata } from "next";
import Link from "next/link";
import { Bell } from "lucide-react";
import FeatureCard from "@/components/app/feature-card";
import { PageHeader } from "@/components/app/ui";
import { features } from "@/config/features";

export const metadata: Metadata = { title: "ارتباطات" };

export default function CommunicationsPage() {
  return (
    <>
      <PageHeader
        title="ارتباطات"
        description="با دوستان و هم‌کلاسی‌ها گفتگو کن، لغت و تصویر به اشتراک بگذار و تماس بگیر."
        actions={
          <Link href="/notifications/" className="btn-soft">
            <Bell aria-hidden="true" className="h-4 w-4" />
            اعلان‌ها
          </Link>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features
          .filter((f) => f.group === "comms")
          .map((f) => (
            <FeatureCard key={f.id} feature={f} />
          ))}
      </div>
    </>
  );
}
