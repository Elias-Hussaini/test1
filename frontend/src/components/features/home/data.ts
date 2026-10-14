import { BookOpen, Brain, PenLine, Sparkles } from "lucide-react";

/** عبارت‌های کوتاه آلمانی برای افکت Typewriter */
export const germanPhrases = [
  "Guten Morgen!",
  "Ich lerne Deutsch.",
  "Wie geht's dir?",
  "Schritt für Schritt.",
  "Übung macht den Meister.",
];

/*
  آیکن‌ها کامپوننت هستند و فقط در Server Componentها رندر می‌شوند؛
  هیچ تابعی به Client Component پاس داده نمی‌شود.
  کلاس‌ها عمداً کامل نوشته شده‌اند تا Tailwind بتواند آن‌ها را تشخیص دهد.
*/
export const features = [
  {
    number: "01",
    Icon: BookOpen,
    title: "واژه‌نامه هوشمند",
    description:
      "معنی فارسی، تلفظ و اطلاعات واژگان آلمانی را پیدا کن و کلمات جدید یاد بگیر.",
    href: "/dictionary/",
    iconClass: "border-secondary/30 bg-secondary/15 text-secondary",
    washClass: "from-secondary/15",
    hoverClass: "hover:border-secondary/50",
  },
  {
    number: "02",
    Icon: Brain,
    title: "مرور واژگان",
    description:
      "کلمات یادگرفته‌شده را مرور کن و با تکرار فاصله‌دار، بهتر به خاطر بسپار.",
    href: "/vocabulary/",
    iconClass: "border-primary/30 bg-primary/15 text-primary",
    washClass: "from-primary/15",
    hoverClass: "hover:border-primary/50",
  },
  {
    number: "03",
    Icon: PenLine,
    title: "تمرین زبان",
    description:
      "دانسته‌هایت را با تمرین‌های ترجمه، دستور زبان و جمله‌سازی تقویت کن.",
    href: "/exercises/",
    iconClass: "border-success/30 bg-success/15 text-success",
    washClass: "from-success/15",
    hoverClass: "hover:border-success/50",
  },
  {
    number: "04",
    Icon: Sparkles,
    title: "مربی هوش مصنوعی",
    description:
      "جمله بساز، سؤال بپرس و برای یادگیری آلمانی راهنمایی شخصی دریافت کن.",
    href: "/ai-tutor/",
    iconClass: "border-accent/30 bg-accent/15 text-accent",
    washClass: "from-accent/15",
    hoverClass: "hover:border-accent/50",
  },
];

export const learningLevels = [
  { level: "A1", title: "مبتدی", description: "از پایه شروع کن" },
  { level: "A2", title: "پایه", description: "مکالمات روزمره" },
  { level: "B1", title: "متوسط", description: "ارتباط مستقل" },
  { level: "B2", title: "متوسط پیشرفته", description: "آمادگی برای تحصیل و کار" },
];

/*
  فقط اعداد واقعی و قابل‌راستی‌آزمایی؛ هیچ آمار کاربری ساختگی (مثل «۱۰ هزار کاربر») نیست:
  - ۴ سطح و ۴ ابزار همین صفحه
  - ۳ آرتیکل آلمانی: der / die / das
  - ۴ حالت دستوری آلمانی: Nominativ, Akkusativ, Dativ, Genitiv
*/
export const stats = [
  { value: 4, label: "سطح زبانی", hint: "از A1 تا B2" },
  { value: 4, label: "ابزار یادگیری", hint: "واژه‌نامه، مرور، تمرین و مربی هوشمند" },
  { value: 3, label: "آرتیکل آلمانی", hint: "der، die و das" },
  { value: 4, label: "حالت دستوری", hint: "از Nominativ تا Genitiv" },
];
