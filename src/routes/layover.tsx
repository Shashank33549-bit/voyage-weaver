import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  Clock3,
  Compass,
  Fingerprint,
  Landmark,
  PlaneLanding,
  PlaneTakeoff,
  ShieldCheck,
  Sparkles,
  Utensils,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/animations/interactive";
import { CountUp, DecryptedText, TextReveal } from "@/components/animations/text";
import { NoiseOverlay } from "@/components/animations/backgrounds";
import { RayField } from "@/components/animations/rb-backgrounds";
import { Tilt3D } from "@/components/animations/parallax";
import { BrandLoader } from "@/components/experience/BrandLoader";
import {
  Chip,
  ProgressBar,
  SectionHeading,
  VButton,
} from "@/components/voyage/primitives";
import { LayoverTimeline } from "@/components/voyage/LayoverTimeline";
import { cn } from "@/lib/utils";

const title = "Layover Intelligence — VoyageAI";
const description =
  "Turn dead airport hours into a real city visit. VoyageAI subtracts immigration, transit and safety buffers to show exactly how long you can explore.";

export const Route = createFileRoute("/layover")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LayoverPage,
});

interface Hub {
  code: string;
  city: string;
  country: string;
  immigration: number;
  exit: number;
  cityTravel: number;
  buffer: number;
  transitVisa: string;
  highlights: { icon: typeof Landmark; label: string; detail: string; minutes: number }[];
}

const hubs: Hub[] = [
  {
    code: "IST",
    city: "Istanbul",
    country: "Türkiye",
    immigration: 45,
    exit: 30,
    cityTravel: 45,
    buffer: 120,
    transitVisa: "E-visa needed to leave airside",
    highlights: [
      { icon: Landmark, label: "Sultanahmet loop", detail: "Blue Mosque + Hagia Sophia exteriors", minutes: 75 },
      { icon: Utensils, label: "Galata rooftop lunch", detail: "Bosphorus view, fast service", minutes: 60 },
      { icon: Compass, label: "Basilica Cistern", detail: "Timed entry, skip-line slot", minutes: 45 },
    ],
  },
  {
    code: "DXB",
    city: "Dubai",
    country: "UAE",
    immigration: 35,
    exit: 25,
    cityTravel: 35,
    buffer: 110,
    transitVisa: "Indian passport + US/UK/Schengen visa: visa on arrival",
    highlights: [
      { icon: Landmark, label: "Dubai Frame", detail: "Metro from Terminal 3", minutes: 60 },
      { icon: Utensils, label: "Al Seef dinner", detail: "Creekside, 20 min from metro", minutes: 70 },
      { icon: Compass, label: "Gold Souk walk", detail: "Compact and close to transit", minutes: 40 },
    ],
  },
  {
    code: "SIN",
    city: "Singapore",
    country: "Singapore",
    immigration: 25,
    exit: 20,
    cityTravel: 30,
    buffer: 100,
    transitVisa: "96-hour VFTF for eligible transits",
    highlights: [
      { icon: Landmark, label: "Gardens by the Bay", detail: "Supertree light show", minutes: 70 },
      { icon: Utensils, label: "Lau Pa Sat hawker", detail: "Satay street opens 19:00", minutes: 50 },
      { icon: Compass, label: "Jewel Rain Vortex", detail: "Inside the airport, zero risk", minutes: 35 },
    ],
  },
  {
    code: "DOH",
    city: "Doha",
    country: "Qatar",
    immigration: 40,
    exit: 25,
    cityTravel: 30,
    buffer: 115,
    transitVisa: "Free transit visa for 5–96 hour stops",
    highlights: [
      { icon: Landmark, label: "Museum of Islamic Art", detail: "Waterfront, quiet mornings", minutes: 70 },
      { icon: Utensils, label: "Souq Waqif mezze", detail: "Late-night friendly", minutes: 55 },
      { icon: Compass, label: "Corniche walk", detail: "Skyline at golden hour", minutes: 40 },
    ],
  },
];

const stageIcons = [PlaneLanding, Fingerprint, Compass, Sparkles, PlaneTakeoff, ShieldCheck];
const stageLabels = ["Land", "Immigration", "City", "Experience", "Return", "Flight"];

function minutesToText(m: number) {
  const h = Math.floor(m / 60);
  const min = m % 60;
  if (h <= 0) return `${min} min`;
  if (min === 0) return `${h} hours`;
  return `${h}h ${min}m`;
}

function LayoverPage() {
  const [hubCode, setHubCode] = useState("IST");
  const [totalHours, setTotalHours] = useState(9);
  const [nightArrival, setNightArrival] = useState(false);
  const [state, setState] = useState<"idle" | "analysing" | "done">("idle");
  const analysisTimer = useRef<number | null>(null);

  useEffect(() => () => {
    if (analysisTimer.current !== null) window.clearTimeout(analysisTimer.current);
  }, []);

  const hub = hubs.find((h) => h.code === hubCode) ?? hubs[0];

  const deductions = useMemo(
    () => [
      { label: "Immigration", minutes: hub.immigration, note: "E-gate eligible" },
      { label: "Airport exit", minutes: hub.exit, note: "Bags, terminal walk" },
      { label: "City travel", minutes: hub.cityTravel, note: "Metro, one way" },
      { label: "Return travel", minutes: hub.cityTravel, note: "Back to terminal" },
      {
        label: "Safety buffer",
        minutes: hub.buffer + (nightArrival ? 20 : 0),
        note: nightArrival ? "Night arrival, thinner transit" : "Security + boarding",
      },
    ],
    [hub, nightArrival],
  );

  const totalMinutes = totalHours * 60;
  const spent = deductions.reduce((sum, d) => sum + d.minutes, 0);
  const free = Math.max(0, totalMinutes - spent);
  const verdict =
    free >= 240
      ? { label: "City visit strongly recommended", tone: "success" as const }
      : free >= 120
        ? { label: "Short, focused visit possible", tone: "warning" as const }
        : { label: "Stay airside — too tight", tone: "destructive" as const };

  const fits = hub.highlights.filter((_, i) =>
    hub.highlights.slice(0, i + 1).reduce((s, h) => s + h.minutes, 0) <= free,
  );

  const analyse = () => {
    if (analysisTimer.current !== null) window.clearTimeout(analysisTimer.current);
    setState("analysing");
    analysisTimer.current = window.setTimeout(() => {
      setState("done");
      analysisTimer.current = null;
    }, 2200);
  };

  return (
    <>
      <PageHeader
        eyebrow="Layover Intelligence"
        title="Turn dead hours into a second destination."
        description="Most travellers waste a nine-hour stop in a food court. VoyageAI models immigration, transit, buffers and city distance to tell you honestly whether the city is reachable."
      >
        <div className="mt-8 flex flex-wrap gap-2">
          {hubs.map((h) => (
            <Chip
              key={h.code}
              active={hubCode === h.code}
              onClick={() => {
                setHubCode(h.code);
                setState("idle");
              }}
            >
              <span className="font-semibold">{h.code}</span>
              <span className="text-muted-foreground">{h.city}</span>
            </Chip>
          ))}
        </div>
      </PageHeader>

      {/* Journey visualisation */}
      <section className="relative isolate overflow-hidden px-4 pb-20 sm:px-6">
        {/* One React Bits field for this page — no stacked canvases */}
        <RayField className="-z-10" />

        <div className="relative mx-auto max-w-7xl">
          <Reveal>
            <div className="module module-glow overflow-hidden rounded-4xl p-6 sm:p-10">
              <NoiseOverlay />
              <div className="relative grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
                {/* Route arc */}
                <div>
                  <p className="eyebrow">Your routing</p>
                  <div className="mt-6 grid grid-cols-[auto_1fr] items-start gap-x-5">
                    <RouteNode code="DEL" city="Delhi" tone="sunset" />
                    <RouteLeg label="TK 717 · 6h 30m" />
                    <RouteNode
                      code={hub.code}
                      city={`${hub.city} · ${totalHours}h layover`}
                      tone="cyan"
                      pulse
                    />
                    <RouteLeg label={`${hub.transitVisa}`} accent />
                    <RouteNode code="HND" city="Tokyo" tone="primary" last />
                  </div>

                  <div className="mt-9 grid gap-4 sm:grid-cols-2">
                    <label className="module rounded-2xl p-4">
                      <span className="eyebrow flex items-center gap-2">
                        <Clock3 className="size-3.5" aria-hidden />
                        Layover length
                      </span>
                      <span className="mt-3 flex items-baseline gap-2">
                        <span className="font-display text-3xl font-semibold text-cyan">
                          {totalHours}
                        </span>
                        <span className="text-sm text-muted-foreground">hours</span>
                      </span>
                      <input
                        type="range"
                        min={3}
                        max={20}
                        step={1}
                        value={totalHours}
                        onChange={(e) => {
                          setTotalHours(Number(e.target.value));
                          setState("idle");
                        }}
                        aria-label="Layover length in hours"
                        className="mt-3 w-full accent-[var(--cyan)]"
                      />
                    </label>

                    <div className="module flex flex-col justify-between rounded-2xl p-4">
                      <span className="eyebrow">Arrival window</span>
                      <div className="mt-3 flex gap-2">
                        <Chip active={!nightArrival} onClick={() => setNightArrival(false)}>
                          Daytime
                        </Chip>
                        <Chip active={nightArrival} onClick={() => setNightArrival(true)}>
                          Late night
                        </Chip>
                      </div>
                      <p className="mt-3 text-xs text-muted-foreground">
                        Night arrivals add buffer for thinner metro frequency.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <VButton size="lg" magnetic onClick={analyse} className="w-full sm:w-auto">
                      Analyse this layover
                      <ArrowRight className="size-4" aria-hidden />
                    </VButton>
                  </div>
                </div>

                {/* Stage ladder */}
                <div className="relative">
                  <p className="eyebrow">Ground sequence</p>
                  <ol className="relative mt-6 space-y-3">
                    <span
                      aria-hidden
                      className="absolute top-4 bottom-4 left-[1.15rem] w-px bg-gradient-to-b from-cyan/70 via-primary/40 to-transparent"
                    />
                    {stageLabels.map((label, i) => {
                      const Icon = stageIcons[i];
                      return (
                        <motion.li
                          key={label}
                          initial={{ opacity: 0, x: -16 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: i * 0.07 }}
                          className="relative flex items-center gap-4"
                        >
                          <span className="relative z-1 grid size-9 shrink-0 place-items-center rounded-full border border-cyan/30 bg-surface text-cyan">
                            <Icon className="size-4" aria-hidden />
                          </span>
                          <span className="module flex-1 rounded-2xl px-4 py-2.5 text-sm font-medium">
                            {label}
                          </span>
                        </motion.li>
                      );
                    })}
                  </ol>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Analysis */}
      <section className="relative px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <AnimatePresence mode="wait">
            {state === "analysing" && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="module rounded-4xl"
              >
                <BrandLoader
                  label="Modelling your ground time"
                  lines={[
                    "Reading immigration wait times",
                    "Measuring terminal to metro",
                    "Adding a safety buffer",
                    "Matching city experiences",
                  ]}
                />
              </motion.div>
            )}

            {state === "done" && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="grid gap-6 lg:grid-cols-[1fr_1.1fr]"
              >
                {/* Time maths */}
                <div className="module rounded-4xl p-6 sm:p-8">
                  <p className="eyebrow">Time arithmetic</p>
                  <div className="mt-5 flex items-baseline gap-3">
                    <span className="font-display text-4xl font-semibold">
                      <CountUp to={totalHours} format={false} /> hours
                    </span>
                    <span className="text-sm text-muted-foreground">on the ground</span>
                  </div>

                  <ul className="mt-7 space-y-3">
                    {deductions.map((d, i) => (
                      <motion.li
                        key={d.label}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 + i * 0.12, duration: 0.5 }}
                        className="flex items-center justify-between gap-4 border-b border-border pb-3 last:border-0"
                      >
                        <span>
                          <span className="block text-sm font-medium">− {d.label}</span>
                          <span className="block text-xs text-muted-foreground">{d.note}</span>
                        </span>
                        <span className="font-display text-sm font-semibold text-sunset tabular-nums">
                          {minutesToText(d.minutes)}
                        </span>
                      </motion.li>
                    ))}
                  </ul>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.95, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="holo-border mt-8"
                  >
                    <span aria-hidden className="holo-border-glow rounded-3xl" />
                    <div className="module module-glow rounded-3xl p-6 text-center">
                      <p className="eyebrow">Available to explore</p>
                      <p className="mt-2 font-display text-4xl font-semibold text-cyan sm:text-5xl">
                        <CountUp to={Math.floor(free / 60)} format={false} />h{" "}
                        <CountUp to={free % 60} format={false} />m
                      </p>
                      <p
                        className={cn(
                          "mt-3 text-sm font-semibold",
                          verdict.tone === "success" && "text-success",
                          verdict.tone === "warning" && "text-warning",
                          verdict.tone === "destructive" && "text-destructive",
                        )}
                      >
                        <DecryptedText text={verdict.label} />
                      </p>
                      <ProgressBar
                        value={(free / totalMinutes) * 100}
                        tone={verdict.tone === "destructive" ? "destructive" : "cyan"}
                        className="mt-5"
                        label="Share of layover usable in the city"
                      />
                    </div>
                  </motion.div>
                </div>

                {/* City plan */}
                <div className="space-y-6">
                  <div className="module rounded-4xl p-6 sm:p-8">
                    <p className="eyebrow">What fits in {hub.city}</p>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      {hub.highlights.map((h) => {
                        const included = fits.includes(h);
                        return (
                          <Tilt3D key={h.label} max={8}>
                            <div
                              className={cn(
                                "module h-full rounded-3xl p-5",
                                included ? "module-glow" : "opacity-60",
                              )}
                            >
                              <span className="grid size-10 place-items-center rounded-2xl bg-cyan/12 text-cyan">
                                <h.icon className="size-4" aria-hidden />
                              </span>
                              <p className="mt-4 font-display text-sm font-semibold">
                                {h.label}
                              </p>
                              <p className="mt-1 text-xs text-muted-foreground">{h.detail}</p>
                              <p className="mt-3 text-xs font-semibold text-sunset">
                                {h.minutes} min ·{" "}
                                {included ? "fits your window" : "needs more time"}
                              </p>
                            </div>
                          </Tilt3D>
                        );
                      })}
                    </div>
                  </div>

                  <div className="module rounded-4xl p-6 sm:p-8">
                    <p className="eyebrow">Minute-by-minute plan</p>
                    <LayoverTimeline className="mt-6" />
                  </div>
                </div>
              </motion.div>
            )}

            {state === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="module rounded-4xl p-8 text-center sm:p-14"
              >
                <SectionHeading
                  align="center"
                  eyebrow="Ready when you are"
                  title="Set your layover, then let VoyageAI do the arithmetic."
                />
                <TextReveal
                  className="mx-auto mt-5 max-w-2xl text-base leading-relaxed"
                  text="We never tell you to leave the airport unless the numbers survive immigration queues, two metro rides and a two-hour safety buffer."
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}

function RouteNode({
  code,
  city,
  tone,
  pulse,
  last,
}: {
  code: string;
  city: string;
  tone: "cyan" | "sunset" | "primary";
  pulse?: boolean;
  last?: boolean;
}) {
  const toneCls = {
    cyan: "text-cyan border-cyan/40",
    sunset: "text-sunset border-sunset/40",
    primary: "text-primary border-primary/40",
  }[tone];

  return (
    <>
      <span
        className={cn(
          "grid size-12 shrink-0 place-items-center rounded-2xl border bg-surface font-display text-xs font-bold tracking-wider",
          toneCls,
          pulse && "animate-pulse-ring",
        )}
      >
        {code}
      </span>
      <span className={cn("pt-3", last ? "pb-0" : "")}>
        <span className="block font-display text-lg font-semibold">{city}</span>
      </span>
    </>
  );
}

function RouteLeg({ label, accent }: { label: string; accent?: boolean }) {
  return (
    <>
      <span aria-hidden className="flex justify-center py-2">
        <span
          className={cn(
            "block h-14 w-px",
            accent
              ? "bg-gradient-to-b from-sunset/70 to-cyan/40"
              : "bg-gradient-to-b from-cyan/50 to-primary/40",
          )}
        />
      </span>
      <span className="py-2 text-xs text-muted-foreground">{label}</span>
    </>
  );
}
