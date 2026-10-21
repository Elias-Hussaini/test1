import { ReactNode } from "react";
import { WelcomePanel } from "./WelcomePanel";
import { cn } from "@/lib/utils";

type AuthLayoutProps = {
  children: ReactNode;
  showWelcomePanel?: boolean;
  className?: string;
};

export function AuthLayout({
  children,
  showWelcomePanel = true,
  className,
}: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {/* Animated orbs */}
        <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div className="orb orb-c" />
        <div className="orb orb-d" />
      </div>

      {/* Main content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1600px] gap-8 p-4 lg:p-8">
        {/* Welcome panel (desktop only) */}
        {showWelcomePanel && (
          <div className="flex-1">
            <WelcomePanel />
          </div>
        )}

        {/* Auth form panel */}
        <div
          className={cn(
            "flex flex-1 items-center justify-center",
            showWelcomePanel && "lg:max-w-[580px]",
            className
          )}
        >
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
