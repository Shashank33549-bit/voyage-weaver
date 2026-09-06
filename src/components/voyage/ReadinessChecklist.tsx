"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { readiness as seed } from "@/data/trip";
import { CountUp } from "@/components/animations/text";
import { ProgressBar } from "@/components/voyage/primitives";
import type { CheckState, ReadinessItem } from "@/types";

const stateMeta: Record<
  CheckState,
  { label: string; char: string; cls: string; weight: number }
> = {
  complete: {
    label: "Complete",
    char: "✓",
    cls: "border-success/40 bg-success/12 text-success",
    weight: 1,
  },
  pending: {
    label: "Pending",
    char: "!",
    cls: "border-warning/40 bg-warning/12 text-warning",
    weight: 0.5,
  },
  missing: {
    label: "Missing",
    char: "✕",
    cls: "border-destructive/40 bg-destructive/12 text-destructive",
    weight: 0,
  },
};

const cycle: CheckState[] = ["missing", "pending", "complete"];

export function ReadinessChecklist({
  items: seedItems = seed,
  className,
}: {
  items?: ReadinessItem[];
  className?: string;
}) {
  const [items, setItems] = useState(seedItems);

  const percent = useMemo(() => {
    const total = items.reduce((s, i) => s + stateMeta[i.state].weight, 0);
    return Math.round((total / items.length) * 100);
  }, [items]);

  const advance = (id: string) =>
    setItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              state: cycle[(cycle.indexOf(i.state) + 1) % cycle.length],
            }
          : i,
      ),
    );

  return (
    <div className={cn("glass rounded-4xl p-6 sm:p-8", className)}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Your trip is</p>
          <p className="font-display mt-1 text-5xl font-semibold sm:text-6xl">
            <CountUp to={percent} format={false} suffix="%" />{" "}
            <span className="text-2xl text-muted-foreground sm:text-3xl">ready</span>
          </p>
        </div>
        <p className="max-w-xs text-sm text-muted-foreground">
          Tap any item to move it forward — readiness recalculates instantly.
        </p>
      </div>

      <ProgressBar
        className="mt-6 h-3"
        value={percent}
        tone={percent >= 85 ? "success" : percent >= 60 ? "cyan" : "warning"}
        label="Trip readiness"
      />

      <ul className="mt-7 grid gap-3 sm:grid-cols-2">
        {items.map((item, i) => {
          const meta = stateMeta[item.state];
          return (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <button
                type="button"
                onClick={() => advance(item.id)}
                className="flex w-full items-center gap-4 rounded-2xl border border-border bg-surface/60 p-4 text-left transition-colors hover:border-cyan/40"
              >
                <span
                  aria-hidden
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-full border text-sm font-bold",
                    meta.cls,
                  )}
                >
                  {meta.char}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">{item.label}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {item.note}
                  </span>
                </span>
                <span
                  className={cn(
                    "shrink-0 rounded-full border px-2.5 py-1 text-[0.65rem] font-semibold tracking-wide uppercase",
                    meta.cls,
                  )}
                >
                  {meta.label}
                </span>
              </button>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
