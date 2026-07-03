import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

export function GlassCard({ children, className, glow = false, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl glass-card transition-all duration-500 hover:shadow-2xl hover:border-white/20",
        glow && "hover:shadow-primary/20",
        className
      )}
      {...props}
    >
      {glow && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 hover:opacity-100 pointer-events-none" />
      )}
      <div className="relative z-10 p-6 md:p-8">
        {children}
      </div>
    </div>
  );
}
