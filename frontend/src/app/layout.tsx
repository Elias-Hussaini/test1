import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { themeInitScript } from "@/lib/theme";
import { AuthProvider } from "@/components/providers/auth-provider";
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

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    // suppressHydrationWarning ضروری است: themeInitScript (lib/theme.ts) کلاس `dark` را قبل از هیدریشن تغییر می‌دهد.
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={vazirmatn.variable}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
