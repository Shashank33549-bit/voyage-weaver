import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/animations/interactive";
import { CountUp } from "@/components/animations/text";
import { Chip, ProgressBar, SectionHeading } from "@/components/voyage/primitives";
import { BudgetBreakdown } from "@/components/voyage/BudgetBreakdown";
import { inr } from "@/lib/format";
import { destinations } from "@/data/destinations";

const title = "Budget Planner — VoyageAI";
const description =
  "Model a travel budget by destination, days and travellers, with animated category breakdowns and AI-style optimisation.";

export const Route = createFileRoute("/budget")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: BudgetPage,
});

const weights = [
  { key: "flights", label: "Flights", share: 0.27, color: "var(--chart-1)" },
  { key: "stay", label: "Accommodation", share: 0.31, color: "var(--chart-2)" },
  { key: "food", label: "Food", share: 0.16, color: "var(--chart-3)" },
  { key: "transport", label: "Transport", share: 0.09, color: "var(--chart-4)" },
  { key: "activities", label: "Activities", share: 0.11, color: "var(--chart-5)" },
  { key: "emergency", label: "Emergency fund", share: 0.06, color: "var(--chart-6)" },
];

function BudgetPage() {
  const [total, setTotal] = useState(200000);
  const [destination, setDestination] = useState("Japan");
  const [days, setDays] = useState(12);
  const [travellers, setTravellers] = useState(2);

  const dest = destinations.find((d) => d.country === destination) ?? destinations[0];

  const required = useMemo(() => {
    const perDayPerPerson = dest.budget / ((dest.durationDays[0] + dest.durationDays[1]) / 2);
    return Math.round(perDayPerPerson * days * (travellers * 0.82));
  }, [dest, days, travellers]);

  const ratio = total / required;
  const health =
    ratio >= 1.12
      ? { label: "Comfortable", tone: "success" as const }
      : ratio >= 0.95
        ? { label: "Moderate", tone: "warning" as const }
        : { label: "Over budget", tone: "destructive" as const };

  const rows = weights.map((w) => ({ ...w, amount: Math.round(total * w.share) }));
  const max = Math.max(...rows.map((r) => r.amount));

  return (
    <>
      <PageHeader
        eyebrow="Budget planner"
        title="Know exactly what your journey costs."
        description="Set the shape of the trip and VoyageAI models the spend, flags the gap and finds the savings."
      />

      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div className="glass rounded-4xl p-6 sm:p-8">
              <p className="eyebrow">Trip inputs</p>

              <div className="mt-6 space-y-7">
                <div>
                  <label htmlFor="total" className="flex justify-between text-sm">
                    <span className="font-medium">Total budget</span>
                    <span className="font-semibold text-cyan tabular-nums">
                      {inr(total)}
                    </span>
                  </label>
                  <input
                    id="total"
                    type="range"
                    min={50000}
                    max={600000}
                    step={5000}
                    value={total}
                    onChange={(e) => setTotal(Number(e.target.value))}
                    className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan"
                    style={{
                      background: `linear-gradient(90deg, color-mix(in oklab, var(--cyan) 70%, transparent) ${((total - 50000) / 550000) * 100}%, var(--surface-2) ${((total - 50000) / 550000) * 100}%)`,
                    }}
                  />
                </div>

                <div>
                  <p className="text-sm font-medium">Destination</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {destinations.map((d) => (
                      <Chip
                        key={d.id}
                        active={destination === d.country}
                        onClick={() => setDestination(d.country)}
                      >
                        {d.country}
                      </Chip>
                    ))}
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Stepper
                    label="Days"
                    value={days}
                    min={2}
                    max={30}
                    onChange={setDays}
                  />
                  <Stepper
                    label="Travellers"
                    value={travellers}
                    min={1}
                    max={8}
                    onChange={setTravellers}
                  />
                </div>
              </div>

              <div className="mt-8 rounded-3xl border border-border bg-surface/70 p-5">
                <div className="flex items-center justify-between">
                  <p className="eyebrow">Budget health</p>
                  <Chip
                    className={
                      health.tone === "success"
                        ? "border-success/50 bg-success/12 text-success"
                        : health.tone === "warning"
                          ? "border-warning/50 bg-warning/12 text-warning"
                          : "border-destructive/50 bg-destructive/12 text-destructive"
                    }
                  >
                    {health.label}
                  </Chip>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  A {days}-day {dest.country} trip for {travellers}{" "}
                  {travellers === 1 ? "traveller" : "travellers"} typically needs{" "}
                  <span className="font-semibold text-foreground">{inr(required)}</span>.
                </p>
                <ProgressBar
                  className="mt-4"
                  value={Math.min(ratio * 100, 100)}
                  tone={health.tone}
                  label="Budget coverage"
                />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="glass rounded-4xl p-6 sm:p-8">
              <p className="eyebrow">Allocated breakdown</p>
              <p className="font-display mt-2 text-4xl font-semibold">
                <CountUp to={total} prefix="₹" key={total} />
              </p>
              <div className="mt-7 space-y-5">
                {rows.map((r) => (
                  <div key={r.key}>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{r.label}</span>
                      <span className="font-semibold tabular-nums">
                        {inr(r.amount)}
                      </span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-2">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: r.color }}
                        initial={false}
                        animate={{ width: `${(r.amount / max) * 100}%` }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      {Math.round(r.share * 100)}% ·{" "}
                      {inr(Math.round(r.amount / days))} per day
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="AI optimisation"
            title="Ask for a cheaper trip, keep the same journey."
            description="VoyageAI re-prices the expensive parts first and shows exactly what changes."
          />
          <BudgetBreakdown className="mt-12" />
        </div>
      </section>
    </>
  );
}

function Stepper({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <p className="text-sm font-medium">{label}</p>
      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="grid size-10 place-items-center rounded-full border border-border bg-surface-2/70 text-lg transition-colors hover:border-cyan/50 hover:text-cyan"
        >
          −
        </button>
        <span className="font-display w-10 text-center text-xl font-semibold tabular-nums">
          {value}
        </span>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          onClick={() => onChange(Math.min(max, value + 1))}
          className="grid size-10 place-items-center rounded-full border border-border bg-surface-2/70 text-lg transition-colors hover:border-cyan/50 hover:text-cyan"
        >
          +
        </button>
      </div>
    </div>
  );
}
