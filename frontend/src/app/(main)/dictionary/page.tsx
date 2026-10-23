import { Suspense } from "react";
import type { Metadata } from "next";
import DictionaryView from "@/components/dictionary/dictionary-view";

export const metadata: Metadata = { title: "دیکشنری" };

export default function DictionaryPage() {
  return (
    <Suspense fallback={null}>
      <DictionaryView />
    </Suspense>
  );
}
