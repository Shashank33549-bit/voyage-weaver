import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Loader2, Sparkles, Check } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/animations/interactive";
import { CountUp } from "@/components/animations/text";
import {
  Chip,
  ProgressBar,
  SectionHeading,
  StateIcon,
  VButton,
} from "@/components/voyage/primitives";
import { ItineraryTimeline } from "@/components/voyage/ItineraryTimeline";
import { DestinationCard } from "@/components/voyage/DestinationCard";
import { DestinationGlobe } from "@/components/experience/DestinationGlobe";
import { destinations, travelStyles } from "@/data/destinations";
import { inr } from "@/lib/format";
import { cn } from "@/lib/utils";

const title = "AI Travel Planner — VoyageAI";
const description =
  "A travel command interface: set route, dates, budget, pace and interests, then watch VoyageAI build a validated day-by-day journey.";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: PlannerPage,
});

const steps = ["Route", "Shape", "Taste", "Journey"] as const;

const pipeline = [
  "Understanding your travel preferences",
  "Finding destinations",
  "Analyzing routes",
  "Checking travel requirements",
  "Optimizing itinerary",
  "Finalizing journey",
];

const paces = ["Slow", "Balanced", "Packed"] as const;
const styles = ["Value", "Comfort", "Premium"] as const;

function PlannerPage() {
  const [step, setStep] = useState(0);
  const [from, setFrom] = useState("Delhi (DEL)");
  const [to, setTo] = useState("Tokyo (HND)");
  const [destCode, setDestCode] = useState<string | null>("JP");
  const [dates, setDates] = useState("2026-10-14");
  const [days, setDays] = useState(12);
  const [budget, setBudget] = useState(200000);
  const [currency, setCurrency] = useState("INR");
  const [travellers, setTravellers] = useState(2);
  const [interests, setInterests] = useState<string[]>(["Culture", "Food"]);
  const [pace, setPace] = useState<(typeof paces)[number]>("Balanced");
  const [style, setStyle] = useState<(typeof styles)[number]>("Comfort");
  const [dream, setDream] = useState("");

  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(-1);
  const done = progress >= pipeline.length;
  const chosenDestination = useMemo(() => {
    const city = to.replace(/\s*\([^)]*\)\s*$/, "").trim().toLowerCase();
    return destinations.find(
      (destination) =>
        destination.city.toLowerCase() === city ||
        destination.country.toLowerCase() === city,
    ) ?? destinations[0];
  }, [to]);
  const projectedSpend = Math.min(
    budget,
    Math.round(
      (chosenDestination.budget / ((chosenDestination.durationDays[0] + chosenDestination.durationDays[1]) / 2)) *
        days *
        Math.max(1, travellers * 0.82),
    ),
  );
  const healthScore = Math.max(62, Math.min(98, Math.round(92 + ((budget - projectedSpend) / Math.max(budget, 1)) * 15)));
  const generatedItinerary = useMemo(
    () => [
      {
        id: `${chosenDestination.id}-day-1`,
        day: 1,
        city: chosenDestination.city,
        headline: `${chosenDestination.city}, calibrated to your pace`,
        activities: [
          { id: `${chosenDestination.id}-arrival`, time: "09:00", title: `Arrival orientation in ${chosenDestination.city}`, detail: `A low-friction first look shaped around ${interests[0] ?? "local culture"}.`, cost: Math.round(projectedSpend * 0.012), travelMinutes: 20, transport: "Airport rail", category: "Transit" as const },
          { id: `${chosenDestination.id}-culture`, time: "11:30", title: `${interests[0] ?? "Culture"} district walk`, detail: `A ${pace.toLowerCase()} route through a high-match neighbourhood.`, cost: Math.round(projectedSpend * 0.008), travelMinutes: 12, transport: "Walk", category: "Culture" as const },
          { id: `${chosenDestination.id}-food`, time: "18:30", title: "Local table reservation", detail: `${style} dining chosen within the current trip budget.`, cost: Math.round(projectedSpend * 0.015), travelMinutes: 15, transport: "Metro", category: "Food" as const },
        ],
      },
    ],
    [chosenDestination, interests, pace, projectedSpend, style],
  );

  useEffect(() => {
    if (!running || done) return;
    const id = setTimeout(() => setProgress((p) => p + 1), 750);
    return () => clearTimeout(id);
  }, [running, progress, done]);

  const generate = () => {
    setRunning(true);
    setProgress(0);
    setStep(3);
  };

  const toggleInterest = (i: string) =>
    setInterests((prev) =>
      prev.includes(i) ? prev.filter((p) => p !== i) : [...prev, i],
    );

  return (
    <>
      <PageHeader
        eyebrow="AI travel planner"
        title="A command interface for your journey."
        description="Not a chat window. Set the shape of the trip, add a sentence about the trip you want, and VoyageAI assembles the rest."
      />

      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="glass-strong rounded-4xl p-4 sm:p-8">
            <ol className="flex flex-wrap gap-2" aria-label="Planning steps">
              {steps.map((label, i) => (
                <li key={label}>
                  <button
                    onClick={() => setStep(i)}
                    aria-current={step === i ? "step" : undefined}
                    className={cn(
                      "flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-colors",
                      step === i
                        ? "border-cyan/60 bg-cyan/12 text-cyan"
                        : i < step
                          ? "border-success/40 bg-success/10 text-success"
                          : "border-border bg-surface/60 text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <span className="tabular-nums">{i + 1}</span>
                    {label}
                    {i < step && <Check className="size-3" aria-hidden />}
                  </button>
                </li>
              ))}
            </ol>

            <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div>
                {step === 0 && (
                  <Panel title="Where are you going?">
                    <div className="sm:col-span-2">
                      <p className="mb-3 text-xs font-medium text-muted-foreground">
                        Choose your destination country on the globe
                      </p>
                      <DestinationGlobe
                        value={destCode}
                        onSelect={(d) => {
                          setDestCode(d.code);
                          setTo(`${d.city} (${d.airport})`);
                        }}
                      />
                    </div>
                    <Field label="From">
                      <input
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        className="input-base"
                      />
                    </Field>
                    <Field label="Destination">
                      <input
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="input-base"
                      />
                    </Field>
                    <Field label="Start date">
                      <input
                        type="date"
                        value={dates}
                        onChange={(e) => setDates(e.target.value)}
                        className="input-base"
                      />
                    </Field>
                    <Field label="Travellers">
                      <input
                        type="number"
                        min={1}
                        max={9}
                        value={travellers}
                        onChange={(e) => setTravellers(Number(e.target.value))}
                        className="input-base"
                      />
                    </Field>
                  </Panel>
                )}

                {step === 1 && (
                  <Panel title="What shape should it take?">
                    <Field label={`Number of days — ${days}`}>
                      <input
                        type="range"
                        min={3}
                        max={24}
                        value={days}
                        onChange={(e) => setDays(Number(e.target.value))}
                        className="range-base"
                      />
                    </Field>
                    <Field label={`Budget — ${inr(budget)}`}>
                      <input
                        type="range"
                        min={40000}
                        max={600000}
                        step={5000}
                        value={budget}
                        onChange={(e) => setBudget(Number(e.target.value))}
                        className="range-base"
                      />
                    </Field>
                    <Field label="Currency">
                      <div className="flex flex-wrap gap-2">
                        {["INR", "USD", "EUR", "JPY"].map((c) => (
                          <Chip
                            key={c}
                            active={currency === c}
                            onClick={() => setCurrency(c)}
                          >
                            {c}
                          </Chip>
                        ))}
                      </div>
                    </Field>
                    <Field label="Travel pace">
                      <div className="flex flex-wrap gap-2">
                        {paces.map((p) => (
                          <Chip key={p} active={pace === p} onClick={() => setPace(p)}>
                            {p}
                          </Chip>
                        ))}
                      </div>
                    </Field>
                  </Panel>
                )}

                {step === 2 && (
                  <Panel title="What do you actually enjoy?">
                    <Field label="Interests">
                      <div className="flex flex-wrap gap-2">
                        {travelStyles.map((s) => (
                          <Chip
                            key={s}
                            active={interests.includes(s)}
                            onClick={() => toggleInterest(s)}
                          >
                            {s}
                          </Chip>
                        ))}
                      </div>
                    </Field>
                    <Field label="Travel style">
                      <div className="flex flex-wrap gap-2">
                        {styles.map((s) => (
                          <Chip
                            key={s}
                            active={style === s}
                            onClick={() => setStyle(s)}
                          >
                            {s}
                          </Chip>
                        ))}
                      </div>
                    </Field>
                    <Field label="Describe your dream trip">
                      <textarea
                        value={dream}
                        onChange={(e) => setDream(e.target.value)}
                        rows={4}
                        placeholder="I have 10 days and ₹2 lakh. I want history, food and nightlife."
                        className="input-base h-auto py-3 leading-relaxed"
                      />
                    </Field>
                  </Panel>
                )}

                {step === 3 && (
                  <Panel title="Building your journey">
                    <ul className="space-y-2.5">
                      {pipeline.map((label, i) => {
                        const state =
                          progress > i
                            ? "done"
                            : progress === i
                              ? "active"
                              : "queued";
                        return (
                          <li
                            key={label}
                            className={cn(
                              "flex items-center gap-3 rounded-2xl border p-4 text-sm transition-colors",
                              state === "done"
                                ? "border-success/35 bg-success/8"
                                : state === "active"
                                  ? "border-cyan/40 bg-cyan/8"
                                  : "border-border bg-surface/50 text-muted-foreground",
                            )}
                          >
                            {state === "done" ? (
                              <StateIcon state="pass" />
                            ) : state === "active" ? (
                              <Loader2
                                className="size-5 animate-spin text-cyan"
                                aria-hidden
                              />
                            ) : (
                              <span
                                aria-hidden
                                className="size-5 rounded-full border border-border"
                              />
                            )}
                            <span className="flex-1 font-medium">{label}</span>
                            <span className="text-xs">
                              {state === "done"
                                ? "Complete"
                                : state === "active"
                                  ? "Loading…"
                                  : "Queued"}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                    <ProgressBar
                      className="mt-5"
                      value={
                        ((Math.max(progress, 0) + (done ? 1 : 0)) / pipeline.length) *
                        100
                      }
                      tone="cyan"
                      label="Planning progress"
                    />
                  </Panel>
                )}

                <div className="mt-6 flex flex-wrap gap-3">
                  {step > 0 && (
                    <VButton variant="glass" onClick={() => setStep(step - 1)}>
                      Back
                    </VButton>
                  )}
                  {step < 2 && (
                    <VButton onClick={() => setStep(step + 1)} magnetic>
                      Continue <ArrowRight className="size-4" aria-hidden />
                    </VButton>
                  )}
                  {step === 2 && (
                    <VButton onClick={generate} magnetic>
                      <Sparkles className="size-4" aria-hidden /> Generate my journey
                    </VButton>
                  )}
                  {step === 3 && !running && (
                    <VButton onClick={generate}>Run again</VButton>
                  )}
                </div>
              </div>

              <aside className="glass rounded-3xl h-fit p-6">
                <p className="eyebrow">Trip brief</p>
                <dl className="mt-4 space-y-3 text-sm">
                  <Summary label="Route" value={`${from} → ${to}`} />
                  <Summary label="Start" value={dates} />
                  <Summary label="Duration" value={`${days} days`} />
                  <Summary label="Travellers" value={String(travellers)} />
                  <Summary label="Budget" value={`${inr(budget)} (${currency})`} />
                  <Summary label="Pace" value={pace} />
                  <Summary label="Style" value={style} />
                  <Summary
                    label="Interests"
                    value={interests.length ? interests.join(", ") : "Open"}
                  />
                </dl>
                {dream && (
                  <p className="mt-4 rounded-2xl bg-surface/70 p-3 text-xs leading-relaxed text-muted-foreground">
                    “{dream}”
                  </p>
                )}
              </aside>
            </div>
          </div>
        </div>
      </section>

      {done && (
        <>
          <section className="px-4 pb-16 sm:px-6">
            <div className="mx-auto max-w-7xl">
              <SectionHeading
                eyebrow="Journey ready"
                 title={`Your ${days}-day ${chosenDestination.country} journey`}
                description="Costed, validated and editable. Change anything — the plan recalculates."
              />
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                   { label: "Projected spend", value: inr(projectedSpend) },
                   { label: "Trip health", value: `${healthScore} / 100` },
                   { label: "Primary base", value: chosenDestination.city },
                ].map((s) => (
                  <div key={s.label} className="glass rounded-3xl p-6">
                    <p className="eyebrow">{s.label}</p>
                    <p className="font-display mt-2 text-2xl font-semibold">
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>
              <Reveal className="mt-8">
                 <ItineraryTimeline days={generatedItinerary} />
              </Reveal>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/trips/$tripId" params={{ tripId: "sample-trip" }}>
                  <VButton magnetic>
                    Open the full trip dashboard{" "}
                    <ArrowRight className="size-4" aria-hidden />
                  </VButton>
                </Link>
                <Link to="/budget">
                  <VButton variant="glass">Tune the budget</VButton>
                </Link>
              </div>
            </div>
          </section>

          <section className="px-4 pb-24 sm:px-6">
            <div className="mx-auto max-w-7xl">
              <SectionHeading
                eyebrow="Also considered"
                title="Three routes VoyageAI ranked below yours"
              />
              <p className="mt-3 text-sm text-muted-foreground">
                Match against your brief:{" "}
                <span className="font-semibold text-cyan">
                  <CountUp to={94} format={false} suffix="%" />
                </span>
              </p>
              <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                 {destinations.filter((d) => d.id !== chosenDestination.id).slice(0, 3).map((d, i) => (
                  <Reveal key={d.id} delay={i * 0.06}>
                    <DestinationCard destination={d} compact />
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      key={title}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-3xl border border-border bg-surface/50 p-6"
    >
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">{children}</div>
    </motion.div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block sm:col-span-2 [&:has(input[type=text]),&:has(input[type=date]),&:has(input[type=number])]:sm:col-span-1">
      <span className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
        {label}
      </span>
      <span className="mt-2 block">{children}</span>
    </label>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border pb-2">
      <dt className="text-xs tracking-wide text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="text-right text-sm font-semibold">{value}</dd>
    </div>
  );
}
