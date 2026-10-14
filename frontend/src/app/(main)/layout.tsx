import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const vazirmatn = localFont({
  src: "../../public/fonts/vazirmatn/fonts/webfonts/Vazirmatn[wght].woff2",
  display: "swap",
  variable: "--font-vazirmatn",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "LINGO | یادگیری زبان آلمانی",
    template: "%s | LINGO",
  },
  description:
    "با LINGO زبان آلمانی را هوشمندانه یاد بگیر؛ از واژگان و تمرین تا مکالمه با هوش مصنوعی.",
  applicationName: "LINGO",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "LINGO",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F5FA" },
    { media: "(prefers-color-scheme: dark)", color: "#050510" },
  ],
};

/**
 * اسکریپت اولیه‌ی تم — قبل از اولین رنگ‌آمیزی صفحه اجرا می‌شود تا پرش رنگ ایجاد نشود.
 * ترتیب انتخاب: ۱) انتخاب ذخیره‌شده‌ی کاربر  ۲) ترجیح سیستم‌عامل  ۳) روشن.
 * کلید ذخیره‌سازی باید با ThemeToggle یکسان باشد ("lingo-theme").
 */
const themeInitScript = `(function(){var r=document.documentElement,d=null;try{var s=localStorage.getItem("lingo-theme");if(s==="dark")d=true;else if(s==="light")d=false}catch(e){}if(d===null){d=!!(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches)}r.classList.toggle("dark",d)})();`;

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    // suppressHydrationWarning ضروری است: اسکریپت بالا کلاس `dark` را قبل از هیدریشن تغییر می‌دهد.
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={vazirmatn.variable}>{children}</body>
    </html>
  );
}
