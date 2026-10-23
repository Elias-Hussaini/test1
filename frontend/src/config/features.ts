import {
  BookOpen,
  Bot,
  Camera,
  GraduationCap,
  Image as ImageIcon,
  MessageCircle,
  PenLine,
  Phone,
  Share2,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react";
import type { FeatureId } from "./plans";

/**
 * فهرست مرکزی ویژگی‌های اپ.
 * افزودن یک ویژگی جدید = افزودن یک ردیف اینجا (+ نام آن در plans.ts)؛ کارت‌های خدمات/ارتباطات،
 * پنل ناوبری و قفل اشتراک خودکار آن را می‌گیرند.
 *
 * status: «live» یعنی صفحه‌ی واقعی و متصل به بک‌اند دارد، «soon» یعنی رابط آماده ولی سرویس هنوز وصل نیست.
 */
export type FeatureStatus = "live" | "soon";

export type Feature = {
  id: FeatureId;
  group: "services" | "comms";
  title: string;
  description: string;
  href?: string;
  Icon: LucideIcon;
  status: FeatureStatus;
  /** رنگ تأکیدی آیکن (کلاس کامل برای Tailwind) */
  tone: string;
};

export const features: Feature[] = [
  {
    id: "dictionary",
    group: "services",
    title: "دیکشنری",
    description: "جستجوی آلمانی و فارسی با آرتیکل، جمع، تلفظ و مثال.",
    href: "/dictionary/",
    Icon: BookOpen,
    status: "live",
    tone: "bg-secondary/15 text-secondary",
  },
  {
    id: "vocabulary",
    group: "services",
    title: "واژگان من",
    description: "واژه‌های ذخیره‌شده و مرور با فلش‌کارت.",
    href: "/vocabulary/",
    Icon: GraduationCap,
    status: "live",
    tone: "bg-primary/15 text-primary",
  },
  {
    id: "exercises",
    group: "services",
    title: "تمرین‌ها",
    description: "چندگزینه‌ای، جای‌خالی، ترجمه، گرامر و شنیداری.",
    href: "/exercises/",
    Icon: PenLine,
    status: "soon",
    tone: "bg-success/15 text-success",
  },
  {
    id: "ai-tutor",
    group: "services",
    title: "مربی هوشمند",
    description: "مکالمه، تصحیح جمله و توضیح گرامر با دسترسی به دیکشنری.",
    href: "/ai-tutor/",
    Icon: Bot,
    status: "soon",
    tone: "bg-accent/20 text-accent",
  },
  {
    id: "classes",
    group: "services",
    title: "کلاس‌های آنلاین",
    description: "کلاس زنده با دوربین، میکروفون و لغات مشترک.",
    href: "/classes/",
    Icon: Video,
    status: "soon",
    tone: "bg-danger/15 text-danger",
  },
  {
    id: "friends",
    group: "comms",
    title: "دوستان",
    description: "دوست پیدا کن و با هم آلمانی تمرین کنید.",
    href: "/friends/",
    Icon: Users,
    status: "soon",
    tone: "bg-secondary/15 text-secondary",
  },
  {
    id: "chat",
    group: "comms",
    title: "پیام‌ها",
    description: "گفتگوی خصوصی و گروهی با دوستان و هم‌کلاسی‌ها.",
    href: "/chat/",
    Icon: MessageCircle,
    status: "soon",
    tone: "bg-primary/15 text-primary",
  },
  {
    id: "voice-call",
    group: "comms",
    title: "تماس صوتی",
    description: "تمرین مکالمه با یک تماس صوتی با کیفیت.",
    Icon: Phone,
    status: "soon",
    tone: "bg-success/15 text-success",
  },
  {
    id: "video-call",
    group: "comms",
    title: "ویدیو کال",
    description: "تماس تصویری حرفه‌ای در چت و کلاس.",
    Icon: Camera,
    status: "soon",
    tone: "bg-danger/15 text-danger",
  },
  {
    id: "word-share",
    group: "comms",
    title: "اشتراک لغات",
    description: "لغت را از دیکشنری مستقیم در چت یا تماس بفرست.",
    Icon: Share2,
    status: "soon",
    tone: "bg-accent/20 text-accent",
  },
  {
    id: "image-share",
    group: "comms",
    title: "اشتراک تصویر",
    description: "ارسال تصویر در چت و حین تماس برای توضیح بهتر.",
    Icon: ImageIcon,
    status: "soon",
    tone: "bg-secondary/15 text-secondary",
  },
];

export const featureById = (id: FeatureId) => features.find((f) => f.id === id)!;
