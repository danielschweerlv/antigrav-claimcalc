import React from "react";
import { cn } from "../../lib/utils";

const ShineBorder = ({
  children,
  className,
  borderWidth = 2,
  duration = 3,
  gradient = "bg-[conic-gradient(from_0deg,var(--primary)_0%,var(--secondary)_25%,var(--primary)_50%,var(--secondary)_75%,var(--primary)_100%)]",
}) => {
  return (
    <div
      className={cn("relative rounded-2xl", className)}
      style={{ padding: borderWidth }}
    >
      {/* Animated Gradient Layer */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
        <div
          className={cn(
            "absolute -inset-full blur-md animate-spin bg-conic",
            gradient
          )}
          style={{ animationDuration: `${duration}s` }}
        />
      </div>

      {/* Content Layer */}
      <div className="relative rounded-2xl bg-surface-container-low h-full shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        {children}
      </div>
    </div>
  );
};

export default ShineBorder;
