import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type WelcomePanelProps = {
  className?: string;
};

export function WelcomePanel({ className }: WelcomePanelProps) {
  return (
    <div
      className={cn(
        "relative hidden h-full min-h-screen overflow-hidden rounded-3xl lg:block",
        className
      )}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/koln.png"
          alt="Cologne Cathedral"
          fill
          className="object-cover"
          priority
        />

        {/* Gradient overlays for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20" />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 flex h-full flex-col justify-between p-12">
        {/* Logo at top */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-xl">
              <Image
                src="/images/logo1.png"
                alt="LINGO"
                width={32}
                height={32}
              />
            </div>
            <span className="text-2xl font-black text-white">LINGO</span>
          </div>
        </motion.div>

        {/* Welcome text at bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          <h1 className="text-4xl font-black leading-tight text-white lg:text-5xl">
            آلمانی را ساده، سریع
            <br />و هوشمند یاد بگیر
          </h1>

          <p className="max-w-md text-lg leading-relaxed text-white/80">
            با LINGO، قدم به قدم به تسلط بر زبان آلمانی نزدیک شو.
          </p>

          {/* Decorative elements */}
          <div className="flex gap-2">
            <div className="h-1 w-12 rounded-full bg-primary" />
            <div className="h-1 w-8 rounded-full bg-secondary" />
            <div className="h-1 w-4 rounded-full bg-accent" />
          </div>
        </motion.div>
      </div>

      {/* Ambient glow effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-primary/30 blur-[120px]" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-secondary/20 blur-[120px]" />
      </div>
    </div>
  );
}
