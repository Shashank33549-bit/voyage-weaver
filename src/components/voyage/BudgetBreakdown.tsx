"use client";

import { motion } from "motion/react";
import { Sparkles, TrendingDown } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { inr } from "@/lib/format";
import { CountUp } from "@/components/animations/text";
import { ProgressBar, VButton } from "@/components/voyage/primitives";
import { budgetCategories, totalBudget as seedTotal } from "@/data/trip";
import type { BudgetCategory } from "@/types";

const savings = [
  {
    id: "s1",
    label: "Shift outbound to Tue 13 Oct",
    detail: "Same carrier, 1 stop, 40 min longer",
    amount: 11400,
    category: "Flights",
  },
  {
    id: "s2",
    label: "Swap Kyoto hotel for a machiya stay",
    detail: "8.9 rating, 6 min from Karasuma line",
    amount: 12800,
    category: "Hotels",
  },
  {
    id: "s3",
    label: "7-day regional rail pass",
    detail: "Replaces 4 point-to-point Shinkansen tickets",
    amount: 6300,
    category: "Transport",
  },
];

export function BudgetBreakdown({
  total = seedTotal,
  categories = budgetCategories,
  className,
}: {
  total?: number;
  categories?: BudgetCategory[];
  className?: string;
}) {
  const [applied, setApplied] = useState<string[]>([]);
  const [showOptions, setShowOptions] = useState(false);

  const saved = useMemo(
    () =>
      savings
        .filter((s) => applied.includes(s.id))
        .reduce((sum, s) => sum + s.amount, 0),
    [applied],
  );

  const adjusted = categories.map((c) => {
    const hit = savings
      .filter((s) => applied.includes(s.id) && s.category === c.label)
      .reduce((sum, s) => sum + s.amount, 0);
    if (c.label === "Remaining") return { ...c, amount: c.amount + saved };
    return { ...c, amount: Math.max(c.amount - hit, 0) };
  });

  const spend = adjusted
    .filter((c) => c.label !== "Remaining")
    .reduce((s, c) => s + c.amount, 0);
  const max = Math.max(...adjusted.map((c) => c.amount));

  const toggle = (id: string) => {
    setApplied((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  return (
    <div className={cn("grid gap-6 lg:grid-cols-[1fr_1.05fr]", className)}>
      <div className="glass rounded-4xl p-6 sm:p-8">
        <p className="eyebrow">Total budget</p>
        <p className="font-display mt-2 text-4xl font-semibold sm:text-5xl">
          <CountUp to={total} prefix="₹" />
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Planned spend {inr(spend)} · {inr(Math.max(total - spend, 0))} unallocated
        </p>

        <div className="mt-7 space-y-5">
          {adjusted.map((c) => (
            <div key={c.key}>
              <div className="flex items-baseline justify-between text-sm">
                <span
                  className={cn(
                    "font-medium",
                    c.label === "Remaining" && "text-cyan",
                  )}
                >
                  {c.label}
                </span>
                <motion.span
                  key={c.amount}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-semibold tabular-nums"
                >
                  {inr(c.amount)}
                </motion.span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface-2">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: c.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(c.amount / max) * 100}%` }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-4xl p-6 sm:p-8">
        <p className="eyebrow">AI budget command</p>
        <div className="mt-3 rounded-3xl border border-border bg-surface/70 p-4">
          <p className="font-display text-lg">
            “Make my trip <span className="text-cyan">₹30,000 cheaper</span>.”
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            VoyageAI re-prices flights, stays and transport without breaking your
            itinerary shape.
          </p>
          <VButton
            className="mt-4"
            onClick={() => {
              setShowOptions(true);
              toast.success("3 optimizations found", {
                description: "Worth ₹30,500 combined.",
              });
            }}
          >
            <Sparkles className="size-4" aria-hidden /> Run optimization
          </VButton>
        </div>

        <motion.div
          initial={false}
          animate={{ opacity: showOptions ? 1 : 0.35 }}
          className="mt-6 space-y-3"
          aria-live="polite"
        >
          {savings.map((s) => {
            const on = applied.includes(s.id);
            return (
              <button
                key={s.id}
                type="button"
                disabled={!showOptions}
                onClick={() => toggle(s.id)}
                aria-pressed={on}
                className={cn(
                  "flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-300",
                  on
                    ? "border-success/50 bg-success/10"
                    : "border-border bg-surface/60 hover:border-cyan/40",
                  !showOptions && "cursor-not-allowed",
                )}
              >
                <TrendingDown
                  className={cn(
                    "size-4 shrink-0",
                    on ? "text-success" : "text-cyan",
                  )}
                  aria-hidden
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">{s.label}</span>
                  <span className="block text-xs text-muted-foreground">
                    {s.detail}
                  </span>
                </span>
                <span
                  className={cn(
                    "shrink-0 text-sm font-semibold tabular-nums",
                    on ? "text-success" : "text-foreground",
                  )}
                >
                  −{inr(s.amount)}
                </span>
              </button>
            );
          })}
        </motion.div>

        <div className="mt-6 border-t border-border pt-5">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">Total saved</span>
            <span className="font-display text-2xl font-semibold text-success tabular-nums">
              {inr(saved)}
            </span>
          </div>
          <ProgressBar
            className="mt-3"
            tone="success"
            value={(saved / 30000) * 100}
            label="Progress towards ₹30,000 target"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {saved >= 30000
              ? "Target reached — your journey now fits the budget."
              : `${inr(30000 - saved)} to go against the ₹30,000 target.`}
          </p>
        </div>
      </div>
    </div>
  );
}
