import { plans, type FeatureId, type Plan, type PlanId } from "@/config/plans";

/** پلن کاربر؛ تنها نقطه‌ای که باید هنگام اتصال به سیستم اشتراک واقعی عوض شود. */
export function resolvePlan(user: { role: string } | null | undefined): Plan {
  const id: PlanId = user && (user.role === "premium" || user.role === "admin") ? "premium" : "free";
  return plans[id];
}

export function canUse(plan: Plan, feature: FeatureId): boolean {
  return plan.features.includes(feature);
}
