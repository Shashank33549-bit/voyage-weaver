import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { layoverPlan } from "@/data/trip";

export function LayoverTimeline({
  plan = layoverPlan,
  className,
}: {
  plan?: { time: string; label: string; detail: string }[];
  className?: string;
}) {
  return (
    <ol className={cn("relative space-y-4", className)}>
      <span
        aria-hidden
        className="absolute top-3 bottom-3 left-[3.6rem] w-px bg-gradient-to-b from-sunset/70 via-border to-transparent"
      />
      {plan.map((step, i) => (
        <motion.li
          key={step.time}
          initial={{ opacity: 0, x: -14 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.08 }}
          className="relative flex items-start gap-4"
        >
          <span className="w-12 shrink-0 pt-0.5 text-right text-sm font-semibold text-sunset tabular-nums">
            {step.time}
          </span>
          <span
            aria-hidden
            className="relative z-1 mt-1.5 size-3 shrink-0 rounded-full bg-sunset ring-4 ring-background"
          />
          <span className="flex-1 rounded-2xl border border-border bg-surface/60 px-4 py-3">
            <span className="block text-sm font-semibold">{step.label}</span>
            <span className="block text-xs text-muted-foreground">{step.detail}</span>
          </span>
        </motion.li>
      ))}
    </ol>
  );
}
