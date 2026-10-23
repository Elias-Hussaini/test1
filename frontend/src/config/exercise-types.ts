/**
 * انواع تمرین. وقتی یک نوع ساخته شد، status را به "live" تغییر بده و صفحه‌ی آن را اضافه کن.
 * سؤال‌ها باید داده‌ی ساختاریافته (از بک‌اند) باشند، نه متن ثابت داخل کامپوننت.
 */
export const exerciseTypes = [
  { id: "multiple-choice", icon: "CheckSquare", title: "چندگزینه‌ای", description: "انتخاب پاسخ درست برای واژه یا جمله.", status: "soon" },
  { id: "matching", icon: "Link2", title: "جور کردن واژه‌ها", description: "وصل کردن واژه‌ی آلمانی به معنی فارسی.", status: "soon" },
  { id: "fill-blank", icon: "Pencil", title: "جای‌خالی", description: "کامل کردن جمله با واژه‌ی درست.", status: "soon" },
  { id: "sentence-order", icon: "ListOrdered", title: "چیدن جمله", description: "مرتب کردن کلمه‌ها برای ساخت جمله.", status: "soon" },
  { id: "translation", icon: "Languages", title: "ترجمه", description: "ترجمه‌ی آلمانی به فارسی و برعکس.", status: "soon" },
  { id: "grammar", icon: "Puzzle", title: "گرامر", description: "آرتیکل، حالت‌های دستوری و صرف فعل.", status: "soon" },
  { id: "listening", icon: "Headphones", title: "شنیداری", description: "گوش دادن و انتخاب یا نوشتن پاسخ.", status: "soon" },
  { id: "reading", icon: "ScrollText", title: "درک مطلب", description: "خواندن متن کوتاه و پاسخ به سؤال.", status: "soon" },
] as const;
