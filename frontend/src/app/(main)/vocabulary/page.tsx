import type { Metadata } from "next";
import VocabularyView from "@/components/vocabulary/vocabulary-view";

export const metadata: Metadata = { title: "واژگان من" };

export default function VocabularyPage() {
  return <VocabularyView />;
}
