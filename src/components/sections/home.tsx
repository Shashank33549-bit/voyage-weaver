"use client";

import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  CloudSun,
  Coins,
  Map,
  PlaneTakeoff,
  Timer,
} from "lucide-react";
import { Aurora } from "@/components/animations/backgrounds";
import { VeilField } from "@/components/animations/rb-backgrounds";
import { CountUp, ShinyText, SplitText } from "@/components/animations/text";
import {
  AnimatedList,
  Fade,
  Reveal,
  SpotlightCard,
} from "@/components/animations/interactive";
import { EdgeBlur } from "@/components/animations/rb-backgrounds";
import { SectionHeading, VButton, Chip } from "@/components/voyage/primitives";
import { ItineraryTimeline } from "@/components/voyage/ItineraryTimeline";
import { BudgetBreakdown } from "@/components/voyage/BudgetBreakdown";
import { ReadinessChecklist } from "@/components/voyage/ReadinessChecklist";
import { HealthPanel } from "@/components/voyage/HealthPanel";
import { MatchmakerPanel } from "@/components/voyage/MatchmakerPanel";
import { LayoverTimeline } from "@/components/voyage/LayoverTimeline";
import { DestinationGallery } from "@/components/voyage/DestinationGallery";
import { destinations } from "@/data/destinations";

const bento = [
  {
    icon: PlaneTakeoff,
    title: "Flights",
    copy: "Fare shape across a 7-day window, seat maps and the cost of one day's flexibility.",
    span: "lg:col-span-2",
    accent: "primary",
    stat: "₹8,400 saved on average",
  },
  {
    icon: Timer,
    title: "Layovers",
    copy: "Every stop scored: can you leave the airport, and what fits in the gap.",
    span: "",
    accent: "sunset",
    stat: "4h 15m explorable",
  },
  {
    icon: BadgeCheck,
    title: "Visa Intelligence",
    copy: "Passport-aware requirements for destination and transit countries.",
    span: "",
    accent: "cyan",
    stat: "196 passports mapped",
  },
  {
    icon: Map,
    title: "AI Itinerary",
    copy: "Day plans that respect opening hours, transit time and your energy.",
    span: "lg:col-span-2",
    accent: "primary",
    stat: "Optimised in 2.4s",
  },
  {
    icon: Coins,
    title: "Budget",
    copy: "Category-level forecasting with one-tap savings that keep the trip intact.",
    span: "",
    accent: "cyan",
    stat: "₹30,500 optimisable",
  },
  {
    icon: CloudSun,
    title: "Travel Updates",
    copy: "Weather shifts, strike notices and closures that change your plan.",
    span: "",
    accent: "sunset",
    stat: "Checked hourly",
  },
];

const accentMap: Record<string, string> = {
  primary: "text-primary",
  cyan: "text-cyan",
  sunset: "text-sunset",
};

export function CommandCenter() {
  return (
    <section className="cinematic-section border-t border-border/40 px-4 py-24 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Travel command center"
          title={
            <>
              Everything Your Journey Needs.{" "}
              <span className="text-gradient">One Intelligent Place.</span>
            </>
          }
          description="Six systems that usually live in six browser tabs, working from the same plan."
        />

        <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {bento.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.06} className={item.span}>
              <SpotlightCard className="h-full rounded-none border-0 bg-background">
                <div className="flex min-h-60 h-full flex-col p-6 sm:p-7">
                  <span
                    className={`grid size-11 place-items-center rounded-2xl bg-surface-2/80 ${accentMap[item.accent]}`}
                  >
                    <item.icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.copy}
                  </p>
                  <p
                    className={`mt-6 text-xs font-semibold tracking-wide ${accentMap[item.accent]}`}
                  >
                    {item.stat}
                  </p>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LayoverStory() {
  const route = [
    { code: "DEL", city: "Delhi", note: "05:40 departure" },
    { code: "IST", city: "Istanbul", note: "7 hour layover" },
    { code: "CDG", city: "Paris", note: "20:15 arrival" },
  ];

  return (
    <section className="cinematic-section isolate border-t border-border/40 px-4 py-24 sm:px-6 sm:py-28">
      <Aurora intensity={0.4} className="-z-10" />
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Layover intelligence"
          title={
            <>
              Your Layover Doesn't{" "}
              <span className="text-sunset-gradient">Have to Be Wasted.</span>
            </>
          }
          description="VoyageAI models immigration, transfers and security buffers, then hands you the hours you actually have."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <div className="spatial-panel h-full rounded-lg p-6 sm:p-8">
              <ol className="relative space-y-8">
                <span
                  aria-hidden
                  className="absolute top-4 bottom-4 left-[1.4rem] w-px bg-gradient-to-b from-primary via-sunset to-cyan"
                />
                {route.map((leg, i) => (
                  <li key={leg.code} className="relative flex items-center gap-5">
                    <span
                      className={`relative z-1 grid size-11 shrink-0 place-items-center rounded-full text-xs font-bold ring-4 ring-background ${
                        i === 1
                          ? "bg-sunset text-sunset-foreground animate-pulse-ring"
                          : "bg-surface-2 text-cyan"
                      }`}
                    >
                      {leg.code}
                    </span>
                    <span>
                      <span className="font-display block text-lg font-semibold">
                        {leg.city}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {leg.note}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>

              <div className="mt-8 rounded-3xl border border-sunset/30 bg-sunset/8 p-5">
                <p className="eyebrow text-sunset">You have</p>
                <p className="font-display mt-1 text-3xl font-semibold">
                  <CountUp to={4} format={false} suffix="h" />{" "}
                  <CountUp to={20} format={false} suffix="m" /> to explore
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Istanbul is e-visa eligible for your passport, and the M11 metro
                  reaches Sultanahmet in 45 minutes.
                </p>
              </div>

              <Link to="/layover" className="mt-6 inline-block">
                <VButton variant="glass" size="md">
                  Analyze your layover <ArrowRight className="size-4" aria-hidden />
                </VButton>
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="spatial-panel h-full rounded-lg p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="eyebrow">Suggested layover plan</p>
                  <h3 className="mt-1 text-xl font-semibold">
                    Istanbul · 10:00 → 15:30
                  </h3>
                </div>
                <Chip active>🟢 Safe to explore</Chip>
              </div>
              <LayoverTimeline className="mt-7" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function MatchmakerSection() {
  return (
    <section className="cinematic-section border-t border-border/40 px-4 py-24 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Destination matchmaker"
          title={
            <>
              Not Sure <span className="text-gradient">Where to Go?</span>
            </>
          }
          description="Move six sliders. VoyageAI re-ranks the world against your travel personality in real time."
        />
        <div className="mt-14">
          <MatchmakerPanel showGallery={false} />
        </div>
        <Reveal className="mt-16">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <h3 className="text-2xl font-semibold">Destination gallery</h3>
            <Link
              to="/discover"
              className="text-sm font-semibold text-cyan hover:text-foreground"
            >
              Browse all destinations →
            </Link>
          </div>
          <DestinationGallery items={destinations} label="Destination gallery" />
        </Reveal>
      </div>
    </section>
  );
}

export function ItinerarySection() {
  return (
    <section className="cinematic-section isolate border-t border-border/40 px-4 py-24 sm:px-6 sm:py-28">
      <div
        aria-hidden
        className="grid-lines pointer-events-none absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(70%_50%_at_50%_50%,black,transparent)]"
      />
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="AI itinerary"
          title={
            <>
              Your Entire Journey.{" "}
              <span className="text-gradient">Perfectly Organized.</span>
            </>
          }
          description="Edit, reorder, remove or optimize any day. Costs and transit time recalculate as you go."
        />
        <Fade className="mt-14">
          <ItineraryTimeline />
        </Fade>
      </div>
    </section>
  );
}

export function RealitySection() {
  return (
    <section className="cinematic-section border-t border-border/40 px-4 py-24 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Trip reality check"
          title={
            <>
              Before You Travel,{" "}
              <span className="text-gradient">VoyageAI Checks Everything.</span>
            </>
          }
          description="A structural audit of your plan: connections, pacing, requirements and spend."
        />
        <Reveal className="mt-14" direction="horizontal" y={70}>
          <HealthPanel />
        </Reveal>
      </div>
    </section>
  );
}

export function BudgetSection() {
  return (
    <section className="cinematic-section isolate border-t border-border/40 px-4 py-24 sm:px-6 sm:py-28">
      <Aurora intensity={0.32} className="-z-10" />
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Budget intelligence"
          title={
            <>
              Know Exactly What{" "}
              <span className="text-gradient">Your Journey Costs.</span>
            </>
          }
          description="Every rupee mapped to a category — then ask VoyageAI to make the trip cheaper without gutting it."
        />
        <Reveal className="mt-14">
          <BudgetBreakdown />
        </Reveal>
        <EdgeBlur position="bottom" height="5rem" />
      </div>
    </section>
  );
}

export function ReadinessSection() {
  return (
    <section className="cinematic-section border-t border-border/40 px-4 py-24 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Travel readiness"
          title={
            <>
              Everything Packed, <span className="text-gradient">Except Doubt.</span>
            </>
          }
          description="The unglamorous list that decides whether a trip goes smoothly — tracked and always current."
        />
        <Fade className="mt-14" blur={false} delay={0.1}>
          <ReadinessChecklist />
        </Fade>
      </div>
    </section>
  );
}

const voyageStack = [
  "Travel intelligence",
  "Structured itinerary",
  "Layover analysis",
  "Budget optimization",
  "Trip validation",
  "Travel readiness",
  "Complete journey",
];

export function WhySection() {
  return (
    <section className="cinematic-section isolate border-t border-border/40 px-4 py-24 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          align="center"
          eyebrow="Why VoyageAI"
          title={
            <>
              Why Just Ask AI When You Can{" "}
              <span className="text-gradient">Build Your Journey?</span>
            </>
          }
        />

        <div className="mt-14 grid items-start gap-6 lg:grid-cols-[0.8fr_auto_1.2fr]">
          <Reveal>
            <div className="rounded-4xl border border-border bg-surface/50 p-7">
              <p className="eyebrow text-muted-foreground">A chatbot</p>
              <h3 className="mt-3 text-2xl font-semibold text-muted-foreground">
                Travel advice
              </h3>
              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                {[
                  "A wall of text you re-paste elsewhere",
                  "No structure, no dates, no costs",
                  "Forgets your budget by paragraph three",
                  "Can't validate anything it suggests",
                ].map((line) => (
                  <li key={line} className="flex gap-2">
                    <span aria-hidden>—</span>
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <div className="hidden lg:flex lg:h-full lg:items-center">
            <span className="font-display text-3xl text-cyan" aria-hidden>
              →
            </span>
          </div>

          <Reveal delay={0.12}>
            <div className="rounded-4xl relative overflow-hidden border border-cyan/25 bg-card/70 p-7">
              <div
                aria-hidden
                className="absolute inset-0 opacity-70"
                style={{
                  background:
                    "radial-gradient(110% 80% at 100% 0%, color-mix(in oklab, var(--cyan) 16%, transparent), transparent 60%)",
                }}
              />
              <div className="relative">
                <p className="eyebrow">VoyageAI</p>
                <h3 className="mt-3 text-2xl font-semibold">
                  <ShinyText>A complete journey</ShinyText>
                </h3>
                <AnimatedList className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  {voyageStack.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2.5 rounded-2xl bg-surface/70 px-4 py-3 text-sm font-medium"
                    >
                      <span aria-hidden className="text-success">
                        +
                      </span>
                      {item}
                    </div>
                  ))}
                </AnimatedList>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="cinematic-section isolate border-t border-border/40 px-4 py-28 sm:px-6 sm:py-36">
      <VeilField className="-z-10" />
      <div className="relative mx-auto max-w-3xl text-center">
        <p className="eyebrow">Your next journey</p>
        <h2 className="mt-5 text-4xl leading-[1.05] font-semibold sm:text-5xl lg:text-6xl">
          <SplitText text="Where Will Your Next Journey Take You?" />
        </h2>
        <Reveal delay={0.25}>
          <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
            Start with a sentence. Leave with a validated, priced, day-by-day
            journey you can actually take.
          </p>
        </Reveal>
        <Reveal delay={0.35}>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link to="/planner">
              <VButton size="lg" magnetic>
                Start Planning <ArrowRight className="size-4" aria-hidden />
              </VButton>
            </Link>
            <Link to="/matchmaker">
              <VButton size="lg" variant="glass">
                Find my match
              </VButton>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
