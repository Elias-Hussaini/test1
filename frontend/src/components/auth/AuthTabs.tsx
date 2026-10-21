import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type AuthTabsProps = {
  activeTab: "login" | "register";
  className?: string;
};

export function AuthTabs({ activeTab, className }: AuthTabsProps) {
  return (
    <div
      className={cn(
        "flex gap-2 rounded-2xl bg-white/5 p-1.5 backdrop-blur-sm",
        className
      )}
    >
      <Link
        href="/register"
        className={cn(
          "flex-1 rounded-xl px-4 py-3 text-center text-sm font-bold transition-all",
          activeTab === "register"
            ? "bg-gradient-to-r from-primary to-[#965BFF] text-white shadow-lg shadow-primary/30"
            : "text-white/50 hover:bg-white/5 hover:text-white/80"
        )}
      >
        ثبت‌نام
      </Link>
      <Link
        href="/login"
        className={cn(
          "flex-1 rounded-xl px-4 py-3 text-center text-sm font-bold transition-all",
          activeTab === "login"
            ? "bg-gradient-to-r from-primary to-[#965BFF] text-white shadow-lg shadow-primary/30"
            : "text-white/50 hover:bg-white/5 hover:text-white/80"
        )}
      >
        ورود
      </Link>
    </div>
  );
}
