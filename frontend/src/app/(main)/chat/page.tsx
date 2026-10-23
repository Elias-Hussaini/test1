"use client";

import { LockedNotice, PageHeader } from "@/components/app/ui";
import ChatWorkspace from "@/components/chat/chat-workspace";
import { usePlan } from "@/hooks/use-plan";

export default function ChatPage() {
  const { can } = usePlan();
  return (
    <>
      <PageHeader title="پیام‌ها" description="گفتگوی خصوصی، اشتراک لغت و تصویر، تماس صوتی و تصویری." />
      {can("chat") ? <ChatWorkspace /> : <LockedNotice feature="chat" />}
    </>
  );
}
