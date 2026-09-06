import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/animations/interactive";
import { Chip, SectionHeading } from "@/components/voyage/primitives";
import { DestinationCard } from "@/components/voyage/DestinationCard";
import { DestinationCarousel } from "@/components/voyage/DestinationCarousel";
import { DestinationGallery } from "@/components/voyage/DestinationGallery";
import {
  collections,
  destinations,
  regions,
  seasons,
  travelStyles,
} from "@/data/destinations";
import { inrCompact } from "@/lib/format";

const title = "Discover Destinations — VoyageAI";
const description =
  "Search and filter destinations by budget, duration, travel style, region and best season, with match scores and sample costs.";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: DiscoverPage,
});

const budgetBands = [
  { label: "Under ₹1L", max: 100000, min: 0 },
  { label: "₹1L – ₹2L", min: 100000, max: 200000 },
  { label: "₹2L +", min: 200000, max: Infinity },
];

const durationBands = [
  { label: "Up to 7 days", max: 7 },
  { label: "8 – 10 days", max: 10 },
  { label: "11+ days", max: 99 },
];

function DiscoverPage() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<string | null>(null);
  const [style, setStyle] = useState<string | null>(null);
  const [season, setSeason] = useState<string | null>(null);
  const [band, setBand] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return destinations.filter((d) => {
      const q = query.trim().toLowerCase();
      if (q && !`${d.city} ${d.country} ${d.tags.join(" ")}`.toLowerCase().includes(q))
        return false;
      if (region && d.region !== region) return false;
      if (style && !d.tags.some((tag) => tag === style)) return false;
      if (season && d.bestSeason !== season) return false;
      if (band) {
        const b = budgetBands.find((x) => x.label === band);
        if (!b) return true;
        if (d.budget < b.min || d.budget > b.max) return false;
      }
      if (duration) {
        const b = durationBands.find((x) => x.label === duration);
        if (!b) return true;
        if (d.durationDays[0] > b.max) return false;
      }
      return true;
    });
  }, [query, region, style, season, band, duration]);

  const activeFilters = [region, style, season, band, duration].filter(Boolean).length;

  const clear = () => {
    setRegion(null);
    setStyle(null);
    setSeason(null);
    setBand(null);
    setDuration(null);
    setQuery("");
  };

  return (
    <>
      <PageHeader
        eyebrow="Discover"
        title="Find the place that fits the trip you want."
        description="Every destination carries a match score, a realistic cost band and the duration that actually works — not a generic top-ten list."
      >
        <div className="glass-strong mt-9 rounded-4xl p-4 sm:p-6">
          <label htmlFor="dest-search" className="eyebrow block">
            Search destinations
          </label>
          <div className="mt-3 flex items-center gap-3 rounded-2xl border border-input bg-background/60 px-4">
            <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            <input
              id="dest-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try “food”, “Vietnam”, “nature”…"
              className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          <div className="mt-5 grid gap-4">
            <FilterRow label="Budget">
              {budgetBands.map((b) => (
                <Chip
                  key={b.label}
                  active={band === b.label}
                  onClick={() => setBand(band === b.label ? null : b.label)}
                >
                  {b.label}
                </Chip>
              ))}
            </FilterRow>
            <FilterRow label="Duration">
              {durationBands.map((b) => (
                <Chip
                  key={b.label}
                  active={duration === b.label}
                  onClick={() => setDuration(duration === b.label ? null : b.label)}
                >
                  {b.label}
                </Chip>
              ))}
            </FilterRow>
            <FilterRow label="Travel style">
              {travelStyles.map((s) => (
                <Chip
                  key={s}
                  active={style === s}
                  onClick={() => setStyle(style === s ? null : s)}
                >
                  {s}
                </Chip>
              ))}
            </FilterRow>
            <FilterRow label="Region">
              {regions.map((r) => (
                <Chip
                  key={r}
                  active={region === r}
                  onClick={() => setRegion(region === r ? null : r)}
                >
                  {r}
                </Chip>
              ))}
            </FilterRow>
            <FilterRow label="Best season">
              {seasons.map((s) => (
                <Chip
                  key={s}
                  active={season === s}
                  onClick={() => setSeason(season === s ? null : s)}
                >
                  {s}
                </Chip>
              ))}
            </FilterRow>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-sm">
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
              destinations · {activeFilters} filters active
            </p>
            {activeFilters > 0 && (
              <button
                onClick={clear}
                className="text-sm font-semibold text-cyan hover:text-foreground"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </PageHeader>

      <section className="px-4 pb-8 sm:px-6">
        <div className="mx-auto max-w-7xl">
          {filtered.length === 0 ? (
            <div className="rounded-4xl border border-dashed border-border p-14 text-center">
              <h2 className="text-xl font-semibold">Nothing matches yet</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Loosen a filter — budget and season are the usual culprits.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((d, i) => (
                <Reveal key={d.id} delay={i * 0.05}>
                  <DestinationCard destination={d} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {collections.map((collection, ci) => {
        const items = destinations.filter((d) =>
          d.collections.includes(collection.key),
        );
        if (items.length === 0) return null;
        return (
          <section key={collection.key} className="px-4 py-14 sm:px-6">
            <div className="mx-auto max-w-7xl">
              <SectionHeading
                eyebrow={collection.note}
                title={collection.label}
                className="mb-2"
              />
              <p className="mt-3 text-sm text-muted-foreground">
                {items.length} destinations · from{" "}
                {inrCompact(Math.min(...items.map((i) => i.budget)))}
              </p>
              {/* The first collection gets the immersive React Bits gallery;
                  the rest stay on the compact carousel so only one canvas
                  ever runs on this page. */}
              {ci === 0 ? (
                <DestinationGallery
                  className="mt-8"
                  items={items}
                  label={collection.label}
                />
              ) : (
                <DestinationCarousel
                  className="mt-8"
                  items={items}
                  label={collection.label}
                />
              )}
            </div>
          </section>
        );
      })}
    </>
  );
}

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <span className="w-28 shrink-0 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
