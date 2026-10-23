import type { Metadata } from "next";
import FeatureCard from "@/components/app/feature-card";
import { PageHeader } from "@/components/app/ui";
import { features } from "@/config/features";

export const metadata: Metadata = { title: "خدمات" };

export default function ServicesPage() {
  return (
    <>
      <PageHeader title="خدمات" description="همه‌ی ابزارهای یادگیری یک‌جا. خدمات فعال تو به اشتراکت بستگی دارد." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features
          .filter((f) => f.group === "services")
          .map((f) => (
            <FeatureCard key={f.id} feature={f} />
          ))}
      </div>
    </>
  );
}
