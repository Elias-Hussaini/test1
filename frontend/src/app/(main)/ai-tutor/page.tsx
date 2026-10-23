"use client";

import { LockedNotice, PageHeader } from "@/components/app/ui";
import TutorWorkspace from "@/components/ai/tutor-workspace";
import { usePlan } from "@/hooks/use-plan";

export default function AiTutorPage() {
  const { can } = usePlan();
  return (
    <>
      <PageHeader title="مربی هوشمند" description="مکالمه، تصحیح جمله و توضیح گرامر؛ با دسترسی به دیکشنری و واژگان تو." />
      {can("ai-tutor") ? <TutorWorkspace /> : <LockedNotice feature="ai-tutor" />}
    </>
  );
}
