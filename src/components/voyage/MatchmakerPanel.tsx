"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { destinations } from "@/data/destinations";
import { inrCompact } from "@/lib/format";
import { Chip, ProgressBar } from "@/components/voyage/primitives";
import { DestinationCard } from "@/components/voyage/DestinationCard";
import type { Destination, TravelStyle } from "@/types";

interface Axis {
  key: string;
  left: string;
  right: string;
  /** tags rewarded as the slider moves right */
  rightTags: TravelStyle[];
  leftTags: TravelStyle[];
}

const axes: Axis[] = [
  {
    key: "pace-energy",
    left: "Adventure",
    right: "Relaxation",
    leftTags: ["Adventure", "Nature"],
    rightTags: ["Beach"],
  },
  {
    key: "spend",
    left: "Budget",
    right: "Luxury",
    leftTags: ["Budget"],
    rightTags: ["Luxury"],
  },
  {
    key: "terrain",
    left: "Cities",
    right: "Nature",
    leftTags: ["Culture", "Nightlife"],
    rightTags: ["Nature"],
  },
  {
    key: "crowd",
    left: "Popular",
    right: "Hidden gems",
    leftTags: [],
    rightTags: [],
  },
  {
    key: "tempo",
    left: "Fast-paced",
    right: "Slow travel",
    leftTags: ["Culture"],
    rightTags: ["Nature", "Beach"],
  },
  {
    key: "evenings",
    left: "Nightlife",
    right: "Peaceful",
    leftTags: ["Nightlife", "Food"],
    rightTags: ["Nature"],
  },
];

const initial: Record<string, number> = {
  "pace-energy": 35,
  spend: 30,
  terrain: 45,
  crowd: 60,
  tempo: 40,
  evenings: 45,
};

function scoreFor(dest: Destination, values: Record<string, number>) {
  let score = 62;
  for (const axis of axes) {
    const v = values[axis.key] / 100;
    const rightHits = axis.rightTags.filter((t) => dest.tags.includes(t)).length;
    const leftHits = axis.leftTags.filter((t) => dest.tags.includes(t)).length;
    score += rightHits * v * 9;
    score += leftHits * (1 - v) * 9;
  }
  // hidden gems axis rewards lower baseline popularity
  const gemBias = (values.crowd / 100) * (dest.collections.includes("hidden-gems") ? 8 : -4);
  score += gemBias;
  // budget axis penalises expensive picks when slider sits left
  const budgetPenalty = ((100 - values.spend) / 100) * (dest.budget / 100000) * 6;
  score -= budgetPenalty;
  return Math.max(48, Math.min(99, Math.round(score)));
}

export function MatchmakerPanel({
  showGallery = true,
  className,
}: {
  showGallery?: boolean;
  className?: string;
}) {
  const [values, setValues] = useState(initial);

  const ranked = useMemo(
    () =>
      destinations
        .map((d) => ({ ...d, match: scoreFor(d, values) }))
        .sort((a, b) => b.match - a.match),
    [values],
  );

  const [top, ...rest] = ranked;

  const reasons = useMemo(() => {
    const out: string[] = [];
    if (values.spend < 45) out.push("Great value for your spend range");
    else out.push("Room for premium stays and dining");
    if (values["pace-energy"] < 50) out.push("Strong adventure opportunities");
    else out.push("Plenty of slow, restorative days");
    if (values.evenings < 50) out.push("Excellent food and nightlife");
    else out.push("Quiet evenings and low noise");
    if (values.crowd > 55) out.push("Fewer crowds than the obvious picks");
    if (values.terrain > 55) out.push("Nature-heavy routing");
    return out.slice(0, 4);
  }, [values]);

  return (
    <div className={cn("grid gap-6 lg:grid-cols-[0.95fr_1.05fr]", className)}>
      <div className="glass rounded-4xl p-6 sm:p-8">
        <p className="eyebrow">Preference controls</p>
        <h3 className="mt-2 text-2xl font-semibold">Tune your travel personality</h3>
        <div className="mt-7 space-y-7">
          {axes.map((axis) => (
            <div key={axis.key}>
              <div className="flex items-center justify-between text-xs font-semibold tracking-wide">
                <span
                  className={cn(
                    "transition-colors",
                    values[axis.key] < 45 ? "text-cyan" : "text-muted-foreground",
                  )}
                >
                  {axis.left}
                </span>
                <span
                  className={cn(
                    "transition-colors",
                    values[axis.key] > 55 ? "text-sunset" : "text-muted-foreground",
                  )}
                >
                  {axis.right}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={values[axis.key]}
                aria-label={`${axis.left} to ${axis.right}`}
                onChange={(e) =>
                  setValues((v) => ({ ...v, [axis.key]: Number(e.target.value) }))
                }
                className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-surface-2 accent-cyan [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan [&::-webkit-slider-thumb]:shadow-[0_0_0_6px_color-mix(in_oklab,var(--cyan)_18%,transparent)]"
                style={{
                  background: `linear-gradient(90deg, color-mix(in oklab, var(--cyan) 70%, transparent) ${values[axis.key]}%, var(--surface-2) ${values[axis.key]}%)`,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        <motion.div
          layout
          className="relative overflow-hidden rounded-4xl border border-cyan/25 bg-card/70 p-6 sm:p-8"
        >
          <div
            aria-hidden
            className="absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(120% 80% at 90% 0%, color-mix(in oklab, var(--cyan) 18%, transparent), transparent 60%)",
            }}
          />
          <div className="relative">
            <p className="eyebrow">Your perfect match</p>
            <div className="mt-3 flex flex-wrap items-end gap-x-5 gap-y-2">
              <h3 className="font-display text-3xl font-semibold sm:text-4xl">
                {top.country}
              </h3>
              <motion.span
                key={top.match}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-display text-3xl font-semibold text-cyan tabular-nums"
              >
                {top.match}%
              </motion.span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {top.city} · {top.durationDays[0]}–{top.durationDays[1]} days · from{" "}
              {inrCompact(top.budget)}
            </p>
            <ProgressBar className="mt-5" value={top.match} tone="cyan" label="Match" />
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {reasons.map((r) => (
                <li
                  key={r}
                  className="flex items-center gap-2 rounded-2xl bg-surface/70 px-3 py-2 text-sm"
                >
                  <span aria-hidden className="text-success">
                    ✓
                  </span>
                  {r}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              {top.tags.map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid gap-3 sm:grid-cols-3">
          {rest.slice(0, 3).map((d) => (
            <motion.div
              layout
              key={d.id}
              className="rounded-3xl border border-border bg-surface/60 p-4"
            >
              <div className="flex items-baseline justify-between">
                <p className="text-sm font-semibold">{d.country}</p>
                <span className="text-sm font-semibold text-cyan tabular-nums">
                  {d.match}%
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{d.city}</p>
              <ProgressBar className="mt-3 h-1.5" value={d.match} tone="primary" />
              <p className="mt-3 text-xs text-muted-foreground">
                from {inrCompact(d.budget)} · {d.bestSeason}
              </p>
            </motion.div>
          ))}
        </div>

        {showGallery && (
          <div className="grid gap-4 sm:grid-cols-2">
            {ranked.slice(0, 2).map((d) => (
              <DestinationCard key={d.id} destination={d} compact />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
