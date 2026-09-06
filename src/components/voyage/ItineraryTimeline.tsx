"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  Clock,
  Pencil,
  Sparkles,
  Trash2,
  Train,
  Wallet,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { inr, minutesToLabel } from "@/lib/format";
import { itinerary as seedItinerary } from "@/data/trip";
import { Chip, VButton } from "@/components/voyage/primitives";
import type { Activity, ItineraryDay } from "@/types";

const categoryTone: Record<string, string> = {
  Food: "text-sunset",
  Culture: "text-cyan",
  Nature: "text-success",
  Shopping: "text-primary",
  Transit: "text-muted-foreground",
  Nightlife: "text-chart-5",
  Rest: "text-muted-foreground",
};

export function ItineraryTimeline({
  days: initialDays = seedItinerary,
  className,
}: {
  days?: ItineraryDay[];
  className?: string;
}) {
  const [days, setDays] = useState<ItineraryDay[]>(initialDays);
  const [activeDay, setActiveDay] = useState(initialDays[0]?.id ?? "");
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const day = days.find((d) => d.id === activeDay) ?? days[0];

  const totals = useMemo(() => {
    const cost = day.activities.reduce((sum, a) => sum + a.cost, 0);
    const travel = day.activities.reduce((sum, a) => sum + a.travelMinutes, 0);
    return { cost, travel };
  }, [day]);

  const update = (activities: Activity[]) =>
    setDays((prev) =>
      prev.map((d) => (d.id === day.id ? { ...d, activities } : d)),
    );

  const move = (index: number, dir: -1 | 1) => {
    const next = [...day.activities];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    update(next);
  };

  const remove = (id: string) => {
    update(day.activities.filter((a) => a.id !== id));
    toast("Activity removed", { description: "Day recalculated instantly." });
  };

  const optimize = () => {
    const next = [...day.activities]
      .sort((a, b) => a.travelMinutes - b.travelMinutes)
      .map((a, i, arr) => ({
        ...a,
        travelMinutes:
          i === 0 ? 0 : Math.max(6, Math.round(a.travelMinutes * 0.68)),
        time: arr[i].time,
      }));
    const original = day.activities.reduce((s, a) => s + a.travelMinutes, 0);
    const optimized = next.reduce((s, a) => s + a.travelMinutes, 0);
    update(next);
    toast.success(`Day ${day.day} optimized`, {
      description: `Transit time cut by ${minutesToLabel(Math.max(original - optimized, 6))}.`,
    });
  };

  const saveEdit = (id: string) => {
    update(
      day.activities.map((a) => (a.id === id ? { ...a, title: draft || a.title } : a)),
    );
    setEditing(null);
  };

  return (
    <div className={cn("glass rounded-4xl p-4 sm:p-6", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <div
          className="flex flex-1 gap-2 overflow-x-auto pb-1"
          role="tablist"
          aria-label="Itinerary days"
        >
          {days.map((d) => (
            <button
              key={d.id}
              role="tab"
              aria-selected={d.id === day.id}
              onClick={() => setActiveDay(d.id)}
              className={cn(
                "relative shrink-0 rounded-full px-4 py-2 text-xs font-semibold tracking-wide whitespace-nowrap transition-colors",
                d.id === day.id
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {d.id === day.id && (
                <motion.span
                  layoutId="day-pill"
                  className="absolute inset-0 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}
              <span className="relative">
                DAY {d.day} · {d.city}
              </span>
            </button>
          ))}
        </div>
        <VButton variant="glass" size="sm" onClick={optimize}>
          <Sparkles className="size-3.5" aria-hidden /> Optimize day
        </VButton>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border pt-5">
        <div>
          <p className="eyebrow">Day {day.day}</p>
          <h3 className="mt-1 text-xl font-semibold">{day.headline}</h3>
        </div>
        <div className="ml-auto flex gap-2">
          <Chip>
            <Wallet className="size-3" aria-hidden /> {inr(totals.cost)}
          </Chip>
          <Chip>
            <Clock className="size-3" aria-hidden /> {minutesToLabel(totals.travel)} transit
          </Chip>
        </div>
      </div>

      <ol className="relative mt-6 space-y-3">
        <span
          aria-hidden
          className="absolute top-2 bottom-2 left-[1.35rem] w-px bg-gradient-to-b from-cyan/60 via-border to-transparent sm:left-[4.25rem]"
        />
        <AnimatePresence initial={false}>
          {day.activities.map((activity, index) => (
            <motion.li
              key={activity.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex gap-3 sm:gap-5"
            >
              <div className="hidden w-12 shrink-0 pt-4 text-right text-sm font-semibold text-cyan tabular-nums sm:block">
                {activity.time}
              </div>
              <span
                aria-hidden
                className="relative z-1 mt-5 size-3 shrink-0 rounded-full bg-cyan ring-4 ring-background"
              />
              <div className="group flex-1 rounded-2xl border border-border bg-surface/70 p-4 transition-colors hover:border-cyan/40">
                <div className="flex flex-wrap items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-cyan sm:hidden">
                      {activity.time}
                    </p>
                    {editing === activity.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          aria-label="Activity name"
                          className="w-full rounded-lg border border-input bg-background px-2 py-1 text-sm"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEdit(activity.id);
                            if (e.key === "Escape") setEditing(null);
                          }}
                        />
                        <button
                          onClick={() => saveEdit(activity.id)}
                          aria-label="Save name"
                          className="grid size-7 place-items-center rounded-lg bg-success/20 text-success"
                        >
                          <Check className="size-3.5" />
                        </button>
                        <button
                          onClick={() => setEditing(null)}
                          aria-label="Cancel edit"
                          className="grid size-7 place-items-center rounded-lg bg-surface-2 text-muted-foreground"
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                    ) : (
                      <h4 className="font-display text-base font-semibold">
                        {activity.title}
                      </h4>
                    )}
                    <p className="mt-1 text-sm text-muted-foreground">
                      {activity.detail}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 opacity-70 transition-opacity group-hover:opacity-100">
                    <IconAction
                      label={`Edit ${activity.title}`}
                      onClick={() => {
                        setEditing(activity.id);
                        setDraft(activity.title);
                      }}
                    >
                      <Pencil className="size-3.5" />
                    </IconAction>
                    <IconAction
                      label={`Move ${activity.title} earlier`}
                      onClick={() => move(index, -1)}
                    >
                      <ArrowUp className="size-3.5" />
                    </IconAction>
                    <IconAction
                      label={`Move ${activity.title} later`}
                      onClick={() => move(index, 1)}
                    >
                      <ArrowDown className="size-3.5" />
                    </IconAction>
                    <IconAction
                      label={`Remove ${activity.title}`}
                      onClick={() => remove(activity.id)}
                      danger
                    >
                      <Trash2 className="size-3.5" />
                    </IconAction>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                  <span className={cn("font-semibold", categoryTone[activity.category])}>
                    {activity.category}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Train className="size-3" aria-hidden /> {activity.transport}
                  </span>
                  {activity.travelMinutes > 0 && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="size-3" aria-hidden /> travel{" "}
                      {minutesToLabel(activity.travelMinutes)}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Wallet className="size-3" aria-hidden />{" "}
                    {activity.cost === 0 ? "Free" : inr(activity.cost)}
                  </span>
                </div>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
        {day.activities.length === 0 && (
          <li className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            This day is empty. Add activities back by reloading the sample plan.
          </li>
        )}
      </ol>
    </div>
  );
}

function IconAction({
  children,
  label,
  onClick,
  danger,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "grid size-8 place-items-center rounded-xl border border-border bg-surface-2/70 text-muted-foreground transition-colors",
        danger ? "hover:border-destructive/50 hover:text-destructive" : "hover:border-cyan/50 hover:text-cyan",
      )}
    >
      {children}
    </button>
  );
}
