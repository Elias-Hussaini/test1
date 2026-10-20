"use client";

import { useParams } from "next/navigation";
import { UserDetailView } from "@/components/admin/views/user-detail-view";

export default function UserDetailPage() {
  const params = useParams<{ id: string }>();
  return <UserDetailView id={params.id} />;
}
