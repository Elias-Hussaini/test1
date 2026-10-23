"use client";

import { canUse, resolvePlan } from "@/lib/entitlements";
import type { FeatureId } from "@/config/plans";
import { useAuthStore } from "@/stores/auth-store";

export function usePlan() {
  const user = useAuthStore((s) => s.user);
  const plan = resolvePlan(user);
  return { plan, can: (feature: FeatureId) => canUse(plan, feature) };
}
