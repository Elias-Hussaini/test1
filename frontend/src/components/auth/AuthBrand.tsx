import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type AuthBrandProps = {
  size?: "small" | "medium" | "large";
  showWordmark?: boolean;
  className?: string;
};

export function AuthBrand({
  size = "medium",
  showWordmark = true,
  className,
}: AuthBrandProps) {
  const logoSizes = {
    small: { width: 48, height: 48 },
    medium: { width: 80, height: 80 },
    large: { width: 112, height: 112 },
  };

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      {/* Logo with glow effect */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className="relative"
      >
        {/* Animated purple glow behind logo */}
        <div className="absolute inset-0 animate-pulse rounded-full bg-[#713CFF] opacity-50 blur-3xl" />

        {/* Logo image - PNG already has transparent background and glow */}
        <div className="relative">
          <Image
            src="/images/logo1.png"
            alt="LINGO"
            width={logoSizes[size].width}
            height={logoSizes[size].height}
            className="relative z-10"
            priority
          />
        </div>
      </motion.div>

      {/* Wordmark - not needed as logo already includes it */}
    </div>
  );
}
