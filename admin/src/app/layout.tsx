import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { themeInitScript } from "@/lib/theme";

export const metadata: Metadata = {
  title: {
    default: "پنل مدیریت LINGO",
    template: "%s | پنل مدیریت LINGO",
  },
  description:
    "پنل مدیریت پلتفرم آموزش زبان آلمانی LINGO",
  applicationName: "LINGO Admin",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F6F7FC" },
    { media: "(prefers-color-scheme: dark)", color: "#0D1020" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
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
