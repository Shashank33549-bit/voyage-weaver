"use client";

import { motion } from "motion/react";
import { Plane } from "lucide-react";
import { cn } from "@/lib/utils";
import { RotatingText } from "@/components/animations/text";

const defaultLines = [
  "Plotting your route",
  "Reading the skies",
  "Checking layover windows",
  "Balancing your budget",
];

/**
 * Branded loading state — an animated flight path tracing a dotted arc with a
 * rotating status line. Used anywhere content is being "constructed".
 */
export function BrandLoader({
  label = "VoyageAI is planning your journey",
  lines = defaultLines,
  className,
  compact = false,
}: {
  label?: string;
  lines?: string[];
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center gap-5 text-center",
        compact ? "py-8" : "py-20",
        className,
      )}
    >
      <div className="relative h-24 w-56">
        <svg viewBox="0 0 224 96" className="h-full w-full" aria-hidden>
          <path
            d="M12 78 C 60 6, 164 6, 212 78"
            fill="none"
            stroke="var(--border)"
            strokeWidth="1.5"
            strokeDasharray="4 6"
          />
          <motion.path
            d="M12 78 C 60 6, 164 6, 212 78"
            fill="none"
            stroke="var(--cyan)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            style={{ filter: "drop-shadow(0 0 8px var(--cyan))" }}
          />
          <circle cx="12" cy="78" r="3.5" fill="var(--sunset)" />
          <circle cx="212" cy="78" r="3.5" fill="var(--primary)" />
        </svg>
        <motion.span
          className="absolute top-0 left-0 text-cyan"
          animate={{ offsetDistance: ["0%", "100%"] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{
            offsetPath: 'path("M12 78 C 60 6, 164 6, 212 78")',
            offsetRotate: "auto",
          }}
        >
          <Plane className="size-4" aria-hidden />
        </motion.span>
      </div>

      <p className="font-display text-sm font-semibold tracking-[0.2em] uppercase">
        {label}
      </p>
      <p className="text-sm text-muted-foreground">
        <RotatingText items={lines} className="text-cyan" />
      </p>
    </div>
  );
}
