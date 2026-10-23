/**
 * پلن‌ها و دسترسی ویژگی‌ها.
 *
 * فعلاً پلن از روی `role` کاربر مشخص می‌شود (`premium` ⇒ پلن ویژه) تا بک‌اند بتواند
 * با تغییر نقش، خدمات را فعال یا غیرفعال کند. بعداً با یک endpoint اشتراک جایگزین می‌شود
 * (کافی است `resolvePlan` در lib/entitlements.ts عوض شود؛ بقیه‌ی اپ دست نمی‌خورد).
 * دسترسی واقعی به خدمات پولی باید در سمت سرور هم کنترل شود؛ این فایل فقط نمایش رابط است.
 */
export type PlanId = "free" | "premium";

export type FeatureId =
  | "dictionary"
  | "vocabulary"
  | "exercises"
  | "ai-tutor"
  | "friends"
  | "chat"
  | "voice-call"
  | "video-call"
  | "image-share"
  | "word-share"
  | "classes";

export type Plan = {
  id: PlanId;
  name: string;
  tagline: string;
  features: readonly FeatureId[];
};

export const plans: Record<PlanId, Plan> = {
  free: {
    id: "free",
    name: "رایگان",
    tagline: "شروع یادگیری با ابزارهای پایه",
    features: ["dictionary", "vocabulary", "exercises", "friends"],
  },
  premium: {
    id: "premium",
    name: "ویژه",
    tagline: "مربی هوشمند، چت، تماس و کلاس‌های آنلاین",
    features: [
      "dictionary",
      "vocabulary",
      "exercises",
      "friends",
      "ai-tutor",
      "chat",
      "voice-call",
      "video-call",
      "image-share",
      "word-share",
      "classes",
    ],
  },
};
