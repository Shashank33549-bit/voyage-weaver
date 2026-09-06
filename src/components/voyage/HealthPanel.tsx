"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { healthSignals as seed } from "@/data/trip";
import { HealthRing, StateIcon, VButton } from "@/components/voyage/primitives";
import type { HealthSignal } from "@/types";

export function HealthPanel({
  signals: seedSignals = seed,
  baseScore = 87,
  className,
}: {
  signals?: HealthSignal[];
  baseScore?: number;
  className?: string;
}) {
  const [signals, setSignals] = useState(seedSignals);
  const [fixed, setFixed] = useState(false);

  const score = fixed ? 98 : baseScore;

  const autoFix = () => {
    setSignals((prev) =>
      prev.map((s) =>
        s.severity === "pass"
          ? s
          : {
              ...s,
              severity: "pass" as const,
              detail:
                s.id === "h4"
                  ? "Rebooked via IST with a 2h 45m connection."
                  : s.id === "h5"
                    ? "Nara detour moved to Day 6 — Day 4 transit now 1h 05m."
                    : "Applied 3 savings — projected spend ₹1,96,300.",
            },
      ),
    );
    setFixed(true);
    toast.success("3 issues resolved", {
      description: "Trip health raised from 87 to 98.",
    });
  };

  return (
    <div
      className={cn(
        "glass rounded-4xl grid gap-8 p-6 sm:p-8 lg:grid-cols-[auto_1fr] lg:items-center",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <HealthRing value={score} size={196} caption="/ 100 trip health" />
        <div>
          <p className="eyebrow">Live analysis</p>
          <p className="mt-1 max-w-[15rem] text-sm text-muted-foreground">
            {fixed
              ? "Every blocking issue is resolved. Your journey is clean."
              : "Three signals need attention before you travel."}
          </p>
        </div>
      </div>

      <div>
        <ul className="space-y-2.5">
          {signals.map((s, i) => (
            <motion.li
              key={s.id}
              layout
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className={cn(
                "flex items-start gap-3 rounded-2xl border p-4",
                s.severity === "pass"
                  ? "border-border bg-surface/60"
                  : s.severity === "warn"
                    ? "border-warning/35 bg-warning/8"
                    : "border-destructive/35 bg-destructive/8",
              )}
            >
              <span className="mt-0.5">
                <StateIcon state={s.severity} />
              </span>
              <span>
                <span className="block text-sm font-semibold">{s.label}</span>
                <span className="block text-xs leading-relaxed text-muted-foreground">
                  {s.detail}
                </span>
              </span>
            </motion.li>
          ))}
        </ul>

        <VButton
          className="mt-5"
          variant={fixed ? "glass" : "sunset"}
          onClick={autoFix}
          disabled={fixed}
          magnetic
        >
          <Sparkles className="size-4" aria-hidden />
          {fixed ? "All issues fixed" : "Automatically fix issues"}
        </VButton>
      </div>
    </div>
  );
}
