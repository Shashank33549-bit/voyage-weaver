import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, Settings2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal, SpotlightCard } from "@/components/animations/interactive";
import { CountUp } from "@/components/animations/text";
import { Chip, ProgressBar, SectionHeading, VButton } from "@/components/voyage/primitives";
import { TripCard } from "@/components/voyage/TripCard";
import { destinations } from "@/data/destinations";
import { travellerStats, trips } from "@/data/trip";
import { inrCompact } from "@/lib/format";

const title = "Traveller Profile — VoyageAI";
const description =
  "Travel preferences, favourite styles, budget comfort, saved destinations, trips and lifetime travel statistics.";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: ProfilePage,
});

const allStyles = [
  "Food",
  "Culture",
  "Adventure",
  "Nature",
  "Nightlife",
  "Beach",
  "Luxury",
  "Slow travel",
];

const budgetBands = ["Backpacker", "Value", "Comfort", "Premium"];

function ProfilePage() {
  const [styles, setStyles] = useState(["Food", "Culture", "Adventure"]);
  const [bandIndex, setBandIndex] = useState(2);
  const [favourites, setFavourites] = useState(["vietnam", "tokyo"]);

  const toggleStyle = (s: string) =>
    setStyles((prev) =>
      prev.includes(s) ? prev.filter((p) => p !== s) : [...prev, s],
    );

  const toggleFav = (id: string) =>
    setFavourites((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );

  return (
    <>
      <PageHeader
        eyebrow="Profile"
        title="Aarav Shashank"
        description="Delhi-based · 12 countries planned · prefers food-led routes with one slow day in every three."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/planner">
            <VButton magnetic>Plan a new journey</VButton>
          </Link>
          <VButton variant="glass">
            <Settings2 className="size-4" aria-hidden /> Preferences
          </VButton>
        </div>
      </PageHeader>

      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {travellerStats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.06}>
              <div className="glass rounded-3xl p-6 text-center">
                <p className="font-display text-4xl font-semibold text-cyan">
                  <CountUp to={stat.value} format={false} />
                </p>
                <p className="mt-2 text-xs tracking-[0.16em] text-muted-foreground uppercase">
                  {stat.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="glass rounded-4xl h-full p-6 sm:p-8">
              <p className="eyebrow">Travel preferences</p>
              <h2 className="mt-2 text-2xl font-semibold">Favourite travel styles</h2>
              <div className="mt-5 flex flex-wrap gap-2">
                {allStyles.map((s) => (
                  <Chip
                    key={s}
                    active={styles.includes(s)}
                    onClick={() => toggleStyle(s)}
                  >
                    {s}
                  </Chip>
                ))}
              </div>

              <div className="mt-8">
                <div className="flex items-baseline justify-between">
                  <p className="text-sm font-medium">Budget preference</p>
                  <p className="text-sm font-semibold text-cyan">
                    {budgetBands[bandIndex]}
                  </p>
                </div>
                <input
                  type="range"
                  min={0}
                  max={3}
                  step={1}
                  value={bandIndex}
                  aria-label="Budget preference"
                  onChange={(e) => setBandIndex(Number(e.target.value))}
                  className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-surface-2 [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan"
                />
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  {budgetBands.map((b) => (
                    <span key={b}>{b}</span>
                  ))}
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <PrefBar label="Pace" value={62} note="Balanced, one slow day in three" />
                <PrefBar label="Planning depth" value={88} note="Wants every day mapped" />
                <PrefBar label="Risk appetite" value={41} note="Prefers safe connections" />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="glass rounded-4xl h-full p-6 sm:p-8">
              <p className="eyebrow">Saved</p>
              <h2 className="mt-2 text-2xl font-semibold">Favourite destinations</h2>
              <ul className="mt-5 space-y-3">
                {destinations.map((d) => {
                  const fav = favourites.includes(d.id);
                  return (
                    <li key={d.id}>
                      <button
                        onClick={() => toggleFav(d.id)}
                        aria-pressed={fav}
                        className="flex w-full items-center gap-4 rounded-2xl border border-border bg-surface/60 p-3 text-left transition-colors hover:border-cyan/40"
                      >
                        <img
                          src={d.image}
                          alt=""
                          loading="lazy"
                          width={80}
                          height={80}
                          className="size-14 shrink-0 rounded-xl object-cover"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold">
                            {d.city}
                          </span>
                          <span className="block text-xs text-muted-foreground">
                            {d.country} · from {inrCompact(d.budget)}
                          </span>
                        </span>
                        <Heart
                          className={
                            fav
                              ? "size-5 shrink-0 fill-sunset text-sunset"
                              : "size-5 shrink-0 text-muted-foreground"
                          }
                          aria-hidden
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Saved trips" title="Journeys in your account" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {trips.slice(0, 3).map((trip, i) => (
              <Reveal key={trip.id} delay={i * 0.06}>
                <TripCard trip={trip} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function PrefBar({
  label,
  value,
  note,
}: {
  label: string;
  value: number;
  note: string;
}) {
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">{note}</span>
      </div>
      <ProgressBar className="mt-2 h-1.5" value={value} tone="primary" label={label} />
    </div>
  );
}
