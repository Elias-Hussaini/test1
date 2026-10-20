import type { Metadata } from "next";
import { DictionaryView } from "@/components/admin/views/dictionary-view";

export const metadata: Metadata = { title: "واژه‌نامه" };

export default function DictionaryPage() {
  return <DictionaryView />;
}
