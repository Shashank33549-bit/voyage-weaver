import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  BadgeCheck,
  CalendarClock,
  FileCheck2,
  Globe2,
  Info,
  PlaneTakeoff,
  ShieldCheck,
  Timer,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/animations/interactive";
import { CountUp, DecryptedText, TextReveal } from "@/components/animations/text";
import { NoiseOverlay } from "@/components/animations/backgrounds";
import { ThreadField } from "@/components/animations/rb-backgrounds";
import { Tilt3D } from "@/components/animations/parallax";
import { GlobeScene } from "@/components/experience/GlobeScene";
import { BrandLoader } from "@/components/experience/BrandLoader";
import { Chip, SectionHeading, StateIcon, VButton } from "@/components/voyage/primitives";
import { visaResults } from "@/data/trip";
import { cn } from "@/lib/utils";

const title = "Visa Intelligence — VoyageAI";
const description =
  "Check visa requirements, e-visa eligibility, visa on arrival, transit rules and passport validity — with verification status and sources you can trust.";

export const Route = createFileRoute("/visa")({
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
  component: VisaPage,
});

const passports = ["India", "United Kingdom", "UAE", "Singapore"];

type Requirement = {
  id: string;
  destination: string;
  type: "Visa required" | "E-visa" | "Visa on arrival" | "Visa free";
  tone: "pass" | "warn" | "fail";
  processing: string;
  stay: string;
  fee: string;
  transit: string;
  passportValidity: string;
  source: string;
  updated: string;
  notes: string;
};

const requirements: Requirement[] = [
  {
    id: "jp",
    destination: "Japan",
    type: "E-visa",
    tone: "pass",
    processing: "5–7 working days",
    stay: "Up to 90 days",
    fee: "No fee (single entry)",
    transit: "Airside transit visa free",
    passportValidity: "6 months beyond arrival",
    source: "Ministry of Foreign Affairs of Japan",
    updated: "Updated 2 days ago",
    notes:
      "Apply through the designated agency portal. Biometrics are not required for Indian passports on a tourist e-visa.",
  },
  {
    id: "tr",
    destination: "Türkiye",
    type: "E-visa",
    tone: "warn",
    processing: "Instant to 24 hours",
    stay: "Up to 30 days",
    fee: "≈ ₹4,400",
    transit: "Airside free · exiting the airport needs the e-visa",
    passportValidity: "6 months beyond arrival",
    source: "Republic of Türkiye e-Visa Service",
    updated: "Updated today",
    notes:
      "If you plan a city layover in Istanbul, buy the e-visa before departure — it cannot be issued at passport control.",
  },
  {
    id: "th",
    destination: "Thailand",
    type: "Visa on arrival",
    tone: "pass",
    processing: "At the counter",
    stay: "Up to 15 days",
    fee: "≈ ₹5,000",
    transit: "Transit without visa for 12 hours",
    passportValidity: "6 months beyond arrival",
    source: "Thai Immigration Bureau",
    updated: "Updated 5 days ago",
    notes:
      "Carry proof of onward travel, a hotel booking for night one and 10,000 THB per person in cash or card.",
  },
  {
    id: "eu",
    destination: "Schengen Area",
    type: "Visa required",
    tone: "fail",
    processing: "15–30 working days",
    stay: "90 days in any 180",
    fee: "≈ ₹8,000",
    transit: "Airport transit visa required for some nationalities",
    passportValidity: "3 months beyond departure",
    source: "European Commission — Visa Policy",
    updated: "Updated 1 week ago",
    notes:
      "Appointment slots are the real bottleneck. Book the appointment before you buy non-refundable tickets.",
  },
  {
    id: "ae",
    destination: "United Arab Emirates",
    type: "Visa on arrival",
    tone: "warn",
    processing: "At the counter",
    stay: "Up to 14 days",
    fee: "≈ ₹2,900",
    transit: "48-hour free transit visa available",
    passportValidity: "6 months beyond arrival",
    source: "UAE Federal Authority for Identity",
    updated: "Updated 3 days ago",
    notes:
      "Visa on arrival applies if you hold a valid US, UK or Schengen visa or residence permit.",
  },
  {
    id: "np",
    destination: "Nepal",
    type: "Visa free",
    tone: "pass",
    processing: "Not required",
    stay: "Unlimited for Indian nationals",
    fee: "None",
    transit: "Not applicable",
    passportValidity: "Valid photo ID accepted",
    source: "Department of Immigration, Nepal",
    updated: "Updated 2 weeks ago",
    notes: "Voter ID or passport is accepted at land and air entry points.",
  },
];

const typeTone: Record<Requirement["type"], string> = {
  "Visa free": "text-success border-success/35 bg-success/10",
  "E-visa": "text-cyan border-cyan/35 bg-cyan/10",
  "Visa on arrival": "text-warning border-warning/35 bg-warning/10",
  "Visa required": "text-destructive border-destructive/35 bg-destructive/10",
};

function VisaPage() {
  const [passport, setPassport] = useState("India");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>("jp");
  const [checking, setChecking] = useState(false);
  const checkTimer = useRef<number | null>(null);

  useEffect(() => () => {
    if (checkTimer.current !== null) window.clearTimeout(checkTimer.current);
  }, []);

  const filtered = useMemo(
    () =>
      requirements.filter((r) =>
        r.destination.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [query],
  );

  const baseActive = requirements.find((r) => r.id === selected) ?? requirements[0];
  const active = useMemo<Requirement>(() => {
    if (passport === "India") return baseActive;
    if (passport === "United Kingdom") {
      return {
        ...baseActive,
        type: baseActive.destination === "Schengen Area" ? "Visa free" : "Visa free",
        tone: "pass",
        processing: "Not required for short stays",
        fee: "None",
        notes: `British passport holders can generally visit ${baseActive.destination} for short tourism stays without arranging a visa in advance. Entry conditions still apply.`,
      };
    }
    if (passport === "Singapore") {
      return {
        ...baseActive,
        type: "Visa free",
        tone: "pass",
        processing: "Not required for short stays",
        fee: "None",
        notes: `Singapore passport holders receive visa-free short-stay access for this ${baseActive.destination} itinerary. Confirm permitted duration before departure.`,
      };
    }
    return {
      ...baseActive,
      type: baseActive.destination === "Schengen Area" ? "Visa required" : "Visa on arrival",
      tone: baseActive.destination === "Schengen Area" ? "fail" : "pass",
      processing: baseActive.destination === "Schengen Area" ? "15–30 working days" : "At the border",
      notes: `Requirements shown are adjusted for a UAE passport travelling to ${baseActive.destination}. Confirm the latest entry conditions before ticketing.`,
    };
  }, [baseActive, passport]);

  const runCheck = (id: string) => {
    if (checkTimer.current !== null) window.clearTimeout(checkTimer.current);
    setSelected(id);
    setChecking(true);
    checkTimer.current = window.setTimeout(() => {
      setChecking(false);
      checkTimer.current = null;
    }, 1400);
  };

  return (
    <>
      <PageHeader
        eyebrow="Visa Intelligence"
        title="Know your paperwork before you book."
        description="Visa rules break more trips than weather ever will. VoyageAI keeps requirements, transit rules, passport validity and processing times in one verified view."
      >
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <span className="text-xs tracking-[0.16em] text-muted-foreground uppercase">
            Passport
          </span>
          {passports.map((p) => (
            <Chip key={p} active={passport === p} onClick={() => setPassport(p)}>
              {p}
            </Chip>
          ))}
        </div>
      </PageHeader>

      {/* Globe + search */}
      <section className="relative isolate overflow-hidden px-4 pb-20 sm:px-6">
        <ThreadField className="-z-10" />
        <div className="relative mx-auto max-w-7xl">
          <div className="module module-glow overflow-hidden rounded-4xl">
            <NoiseOverlay />
            <div className="relative grid gap-0 lg:grid-cols-[1fr_1.05fr]">
              <div className="relative min-h-[300px] border-b border-border lg:min-h-[460px] lg:border-r lg:border-b-0">
                <div className="absolute inset-0">
                  <GlobeScene />
                </div>
                <div className="pointer-events-none absolute inset-x-6 bottom-6 flex flex-wrap gap-2">
                  {requirements.slice(0, 4).map((r) => (
                    <span
                      key={r.id}
                      className={cn(
                        "glass rounded-full border px-3 py-1 text-[0.65rem] font-semibold",
                        typeTone[r.type],
                      )}
                    >
                      {r.destination} · {r.type}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-6 sm:p-9">
                <p className="eyebrow flex items-center gap-2">
                  <Globe2 className="size-3.5" aria-hidden />
                  Check a destination
                </p>
                <label htmlFor="visa-search" className="sr-only">
                  Search destination
                </label>
                <input
                  id="visa-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search Japan, Thailand, Schengen…"
                  className="mt-4 h-12 w-full rounded-2xl border border-input bg-background/50 px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-cyan/60"
                />

                <ul className="mt-5 grid gap-2">
                  {filtered.map((r) => (
                    <li key={r.id}>
                      <button
                        type="button"
                        onClick={() => runCheck(r.id)}
                        aria-pressed={selected === r.id}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all duration-300",
                          selected === r.id
                            ? "border-cyan/45 bg-surface-2/70"
                            : "border-border bg-surface/50 hover:border-cyan/30 hover:bg-surface-2/50",
                        )}
                      >
                        <StateIcon state={r.tone} />
                        <span className="flex-1">
                          <span className="block text-sm font-semibold">
                            {r.destination}
                          </span>
                          <span className="block text-xs text-muted-foreground">
                            {r.processing} · {r.stay}
                          </span>
                        </span>
                        <span
                          className={cn(
                            "rounded-full border px-2.5 py-1 text-[0.65rem] font-semibold whitespace-nowrap",
                            typeTone[r.type],
                          )}
                        >
                          {r.type}
                        </span>
                      </button>
                    </li>
                  ))}
                  {filtered.length === 0 && (
                    <li className="rounded-2xl border border-border bg-surface/50 px-4 py-6 text-center text-sm text-muted-foreground">
                      No destination matches “{query}”. Try a country or region name.
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Result detail */}
      <section className="relative px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <AnimatePresence mode="wait">
            {checking ? (
              <motion.div
                key="checking"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="module rounded-4xl"
              >
                <BrandLoader
                  label="Verifying requirements"
                  lines={[
                    "Matching your passport",
                    "Reading official guidance",
                    "Checking transit rules",
                    "Confirming passport validity",
                  ]}
                />
              </motion.div>
            ) : (
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="grid gap-6 lg:grid-cols-[1.15fr_1fr]"
              >
                <div className="module rounded-4xl p-6 sm:p-9">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="eyebrow">{passport} passport → {active.destination}</p>
                      <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
                        {active.type}
                      </h2>
                    </div>
                    <span
                      className={cn(
                        "flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold",
                        typeTone[active.type],
                      )}
                    >
                      <StateIcon state={active.tone} />
                      {active.tone === "pass"
                        ? "Straightforward"
                        : active.tone === "warn"
                          ? "Conditions apply"
                          : "Plan well ahead"}
                    </span>
                  </div>

                  <dl className="mt-8 grid gap-4 sm:grid-cols-2">
                    <Fact icon={Timer} label="Processing time" value={active.processing} />
                    <Fact icon={CalendarClock} label="Permitted stay" value={active.stay} />
                    <Fact icon={FileCheck2} label="Government fee" value={active.fee} />
                    <Fact
                      icon={PlaneTakeoff}
                      label="Transit requirement"
                      value={active.transit}
                    />
                    <Fact
                      icon={ShieldCheck}
                      label="Passport validity"
                      value={active.passportValidity}
                    />
                    <Fact icon={BadgeCheck} label="Verification" value="Cross-checked" />
                  </dl>

                  <div className="mt-8 flex items-start gap-3 rounded-2xl border border-border bg-surface/50 p-4">
                    <Info className="mt-0.5 size-4 shrink-0 text-cyan" aria-hidden />
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {active.notes}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5 text-xs text-muted-foreground">
                    <span>
                      Source:{" "}
                      <span className="font-medium text-foreground">{active.source}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="size-1.5 animate-pulse-ring rounded-full bg-success" />
                      <DecryptedText text={active.updated} />
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  <Tilt3D max={7}>
                    <div className="module module-glow rounded-4xl p-6 sm:p-8">
                      <p className="eyebrow">Readiness score</p>
                      <p className="mt-3 font-display text-5xl font-semibold text-cyan">
                        <CountUp
                          to={active.tone === "pass" ? 92 : active.tone === "warn" ? 74 : 48}
                          format={false}
                        />
                        <span className="text-lg text-muted-foreground">/100</span>
                      </p>
                      <p className="mt-3 text-sm text-muted-foreground">
                        Based on processing time against your travel dates, document
                        completeness and appointment availability.
                      </p>
                    </div>
                  </Tilt3D>

                  <div className="module rounded-4xl p-6 sm:p-8">
                    <p className="eyebrow">Your document checklist</p>
                    <ul className="mt-5 space-y-3">
                      {[
                        { label: "Passport valid 6+ months", state: "pass" as const },
                        { label: "Return ticket booked", state: "pass" as const },
                        { label: "Accommodation proof", state: "warn" as const },
                        { label: "Bank statement (3 months)", state: "warn" as const },
                        {
                          label: "Appointment slot",
                          state: active.tone === "fail" ? ("fail" as const) : ("pass" as const),
                        },
                      ].map((item) => (
                        <li key={item.label} className="flex items-center gap-3">
                          <StateIcon state={item.state} />
                          <span className="text-sm">{item.label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Trip-level summary */}
      <section className="relative px-4 pb-28 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionHeading
              eyebrow="On your current trip"
              title="Every border on your Japan route, checked."
              description="VoyageAI re-verifies each requirement whenever your route or dates change, so a new layover never quietly breaks your paperwork."
            />
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {visaResults.map((v, i) => (
              <Reveal key={v.id} delay={i * 0.08}>
                <Tilt3D max={9} className="h-full">
                  <div className="module h-full rounded-3xl p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-display text-sm font-semibold">{v.country}</span>
                      <StateIcon state={v.tone} />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-cyan">{v.status}</p>
                    <dl className="mt-4 space-y-2 text-xs text-muted-foreground">
                      <div className="flex justify-between gap-2">
                        <dt>Processing</dt>
                        <dd className="text-foreground">{v.processing}</dd>
                      </div>
                      <div className="flex justify-between gap-2">
                        <dt>Stay</dt>
                        <dd className="text-foreground">{v.stay}</dd>
                      </div>
                      <div className="flex justify-between gap-2">
                        <dt>Fee</dt>
                        <dd className="text-foreground">{v.fee}</dd>
                      </div>
                    </dl>
                    <p className="mt-4 border-t border-border pt-3 text-xs leading-relaxed text-muted-foreground">
                      {v.notes}
                    </p>
                  </div>
                </Tilt3D>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2} className="mt-12 text-center">
            <TextReveal
              className="mx-auto max-w-2xl text-base leading-relaxed"
              text="Requirements shown here are illustrative and refreshed against official sources. Always confirm with the embassy before you travel."
            />
            <div className="mt-6 flex justify-center">
              <VButton size="lg" magnetic onClick={() => runCheck(active.id)}>
                Re-verify my documents
              </VButton>
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
  icon: typeof Timer;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface/45 p-4">
      <dt className="flex items-center gap-2 text-[0.65rem] tracking-[0.16em] text-muted-foreground uppercase">
        <Icon className="size-3.5 text-cyan" aria-hidden />
        {label}
      </dt>
      <dd className="mt-2 text-sm font-medium">{value}</dd>
    </div>
  );
}
