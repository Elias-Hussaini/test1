export const levels = [
  { id: "A1", title: "مبتدی", description: "سلام و معرفی، اعداد، خرید و جمله‌های ساده‌ی روزمره." },
  { id: "A2", title: "پایه", description: "مکالمه‌های روزمره، گذشته‌ی ساده و توضیح نیازها." },
  { id: "B1", title: "متوسط", description: "ارتباط مستقل در سفر، کار و بیان نظر." },
  { id: "B2", title: "متوسط پیشرفته", description: "متن‌های پیچیده‌تر، بحث و آمادگی برای تحصیل و کار." },
] as const;

export type LevelId = (typeof levels)[number]["id"];
