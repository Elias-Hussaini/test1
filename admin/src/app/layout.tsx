import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { themeInitScript } from "@/lib/theme";

const vazirmatn = localFont({
  src: "../../public/fonts/Vazirmatn-Variable.woff2",
  variable: "--font-vazirmatn",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "پنل مدیریت LINGO",
    template: "%s | پنل مدیریت LINGO",
  },
  description: "پنل مدیریت پلتفرم آموزش زبان آلمانی LINGO",
  applicationName: "LINGO Admin",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F6F7FC" },
    { media: "(prefers-color-scheme: dark)", color: "#0D1020" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="antialiased bg-background text-foreground">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
