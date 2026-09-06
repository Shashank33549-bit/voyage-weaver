import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import {
  BadgeCheck,
  CalendarDays,
  MapPin,
  PlaneTakeoff,
  Timer,
  Users,
  Wallet,
} from "lucide-react";
import { AuroraField } from "@/components/animations/rb-backgrounds";
import { SplitText } from "@/components/animations/text";
import { Reveal } from "@/components/animations/interactive";
import {
  Chip,
  HealthRing,
  SectionHeading,
  VButton,
} from "@/components/voyage/primitives";
import { ItineraryTimeline } from "@/components/voyage/ItineraryTimeline";
import { BudgetBreakdown } from "@/components/voyage/BudgetBreakdown";
import { ReadinessChecklist } from "@/components/voyage/ReadinessChecklist";
import { HealthPanel } from "@/components/voyage/HealthPanel";
import { LayoverTimeline } from "@/components/voyage/LayoverTimeline";
import { getTripJourney, trips } from "@/data/trip";
import { inr } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/trips/$tripId")({
  loader: ({ params }) => {
    const trip = trips.find((t) => t.id === params.tripId);
    if (!trip) throw notFound();
    return { trip };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Trip unavailable — VoyageAI" }, { name: "robots", content: "noindex" }],
      };
    }
    const t = `${loaderData.trip.title} Trip Dashboard — VoyageAI`;
    const d = `${loaderData.trip.durationDays} days in ${loaderData.trip.country}: itinerary, budget, flights, layovers, visa and readiness in one command centre.`;
    return {
      meta: [
        { title: t },
        { name: "description", content: d },
        { property: "og:title", content: t },
        { property: "og:description", content: d },
      ],
    };
  },
  component: TripDashboard,
});

const tabs = [
  { key: "itinerary", label: "Itinerary" },
  { key: "budget", label: "Budget" },
  { key: "flights", label: "Flights" },
  { key: "layovers", label: "Layovers" },
  { key: "visa", label: "Visa" },
  { key: "readiness", label: "Readiness" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

function TripDashboard() {
  const { trip } = Route.useLoaderData();
  const [tab, setTab] = useState<TabKey>("itinerary");
  const journey = getTripJourney(trip);

  return (
    <>
      <section className="relative isolate overflow-hidden px-4 pt-32 pb-10 sm:px-6 sm:pt-40">
        <img
          src={trip.image}
          alt=""
          width={1024}
          height={1280}
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-25"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{ backgroundImage: "var(--gradient-ink)" }}
        />
        <AuroraField className="-z-10" amplitude={0.8} blend={0.5} speed={0.5} />

        <div className="relative mx-auto max-w-7xl">
          <Link
            to="/trips"
            className="text-sm font-semibold text-cyan hover:text-foreground"
          >
            ← All trips
          </Link>
          <p className="eyebrow mt-6 flex items-center gap-2">
            <MapPin className="size-3" aria-hidden /> {trip.country}
          </p>
          <h1 className="mt-3 text-4xl leading-[1.05] font-semibold sm:text-5xl lg:text-6xl">
            <SplitText text={trip.title} />
          </h1>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1.6fr_0.9fr]">
            <div className="glass rounded-4xl p-6 sm:p-7">
              <p className="eyebrow">Trip overview</p>
              <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Fact icon={MapPin} label="Destination" value={trip.title} />
                <Fact icon={CalendarDays} label="Dates" value={trip.dates} />
                <Fact
                  icon={Timer}
                  label="Duration"
                  value={`${trip.durationDays} days`}
                />
                <Fact
                  icon={Users}
                  label="Travellers"
                  value={`${trip.travellers} adults`}
                />
              </dl>
              <div className="mt-6 flex flex-wrap gap-2 border-t border-border pt-5">
                <Chip>
                  <Wallet className="size-3" aria-hidden /> {inr(trip.budget)} budget
                </Chip>
                <Chip>
                   <PlaneTakeoff className="size-3" aria-hidden /> {journey.flights.length} flights · 1 layover
                </Chip>
                <Chip>
                   <BadgeCheck className="size-3" aria-hidden /> {journey.visa}
                </Chip>
              </div>
            </div>

            <div className="glass rounded-4xl flex flex-col items-center justify-center gap-3 p-6 text-center">
              <HealthRing value={trip.health} size={168} />
              <p className="text-sm text-muted-foreground">
                Trip health across routing, pacing, requirements and spend.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-8 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div
            role="tablist"
            aria-label="Trip sections"
            className="glass flex gap-1 overflow-x-auto rounded-full p-1.5"
          >
            {tabs.map((t) => (
              <button
                key={t.key}
                role="tab"
                aria-selected={tab === t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  "relative shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors",
                  tab === t.key
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tab === t.key && (
                  <motion.span
                    layoutId="trip-tab"
                    className="absolute inset-0 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          {tab === "itinerary" && <ItineraryTimeline />}
          {tab === "budget" && <BudgetBreakdown total={trip.budget} />}
          {tab === "flights" && (
            <div className="glass rounded-4xl p-6 sm:p-8">
              <p className="eyebrow">Flights</p>
              <ul className="mt-6 space-y-3">
                 {journey.flights.map((f) => (
                  <li
                    key={f.id}
                    className="grid gap-3 rounded-2xl border border-border bg-surface/60 p-5 sm:grid-cols-[auto_1fr_auto] sm:items-center"
                  >
                    <span className="font-display text-sm font-semibold text-cyan">
                      {f.code}
                    </span>
                    <span>
                      <span className="font-display block text-lg font-semibold">
                        {f.from} → {f.to}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {f.depart} – {f.arrive} · {f.duration} · {f.note}
                      </span>
                    </span>
                    <VButton variant="outline" size="sm">
                      Seat map
                    </VButton>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {tab === "layovers" && (
            <div className="glass rounded-4xl p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                   <p className="eyebrow">{journey.hubCity} · {journey.layoverHours} hour layover</p>
                  <h2 className="mt-1 text-xl font-semibold">
                     {journey.freeTime} available to explore
                  </h2>
                </div>
                <Link to="/layover">
                  <VButton variant="glass" size="sm">
                    Open layover intelligence
                  </VButton>
                </Link>
              </div>
              <LayoverTimeline className="mt-7" />
            </div>
          )}
          {tab === "visa" && (
            <div className="glass rounded-4xl p-6 sm:p-8">
              <p className="eyebrow">Travel requirements</p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                 {journey.visas.map((v) => (
                  <li
                    key={v.id}
                    className="rounded-2xl border border-border bg-surface/60 p-5"
                  >
                    <p className="font-display text-lg font-semibold">{v.country}</p>
                    <p
                      className={cn(
                        "mt-1 text-sm font-semibold",
                        v.tone === "pass"
                          ? "text-success"
                          : v.tone === "warn"
                            ? "text-warning"
                            : "text-destructive",
                      )}
                    >
                      {v.status}
                    </p>
                    <p className="mt-3 text-sm text-muted-foreground">{v.notes}</p>
                    <p className="mt-3 text-xs text-muted-foreground">
                      {v.processing} · {v.stay} · {v.fee}
                    </p>
                  </li>
                ))}
              </ul>
              <p className="mt-6 rounded-2xl border border-warning/30 bg-warning/8 p-4 text-xs leading-relaxed text-muted-foreground">
                Travel requirements can change. Always verify requirements with
                official government or embassy sources before travelling.
              </p>
            </div>
          )}
          {tab === "readiness" && <ReadinessChecklist />}
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Reality check"
            title="What still needs your attention"
          />
          <Reveal className="mt-10">
            <HealthPanel baseScore={trip.health} />
          </Reveal>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Map" title="Your route on the ground" />
          <Reveal className="mt-10">
            <div className="glass rounded-4xl relative h-80 overflow-hidden p-6 sm:h-96">
              <div
                aria-hidden
                className="grid-lines absolute inset-0 opacity-60"
              />
              <svg
                viewBox="0 0 800 320"
                className="absolute inset-0 h-full w-full"
                role="img"
                 aria-label={`Route from ${journey.origin} to ${journey.hub} to ${journey.arrival}`}
              >
                <motion.path
                  d="M80 220 C 220 90, 340 90, 420 160 S 620 230, 720 110"
                  fill="none"
                  stroke="var(--cyan)"
                  strokeWidth="2.5"
                  strokeDasharray="7 9"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 2.2, ease: "easeInOut" }}
                />
                {[
                   { x: 80, y: 220, label: journey.origin },
                   { x: 420, y: 160, label: journey.hub },
                   { x: 720, y: 110, label: journey.arrival },
                ].map((p) => (
                  <g key={p.label}>
                    <circle cx={p.x} cy={p.y} r="7" fill="var(--sunset)" />
                    <text
                      x={p.x}
                      y={p.y - 16}
                      textAnchor="middle"
                      fill="currentColor"
                      className="fill-foreground text-[13px] font-semibold"
                    >
                      {p.label}
                    </text>
                  </g>
                ))}
              </svg>
              <p className="absolute bottom-5 left-6 text-xs text-muted-foreground">
                Illustrative route map · live mapping connects later
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function Fact({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-surface/70 p-4">
      <dt className="flex items-center gap-1.5 text-[0.65rem] tracking-[0.14em] text-muted-foreground uppercase">
        <Icon className="size-3" aria-hidden /> {label}
      </dt>
      <dd className="mt-1.5 text-sm font-semibold">{value}</dd>
    </div>
  );
}
