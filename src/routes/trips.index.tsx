import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/animations/interactive";
import { Chip, VButton } from "@/components/voyage/primitives";
import { TripCard } from "@/components/voyage/TripCard";
import { trips } from "@/data/trip";
import type { TripStatus } from "@/types";

const title = "My Trips — VoyageAI";
const description =
  "Upcoming, past and draft journeys with trip health, readiness, budgets and durations at a glance.";

export const Route = createFileRoute("/trips/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: TripsPage,
});

const tabs: { key: TripStatus; label: string }[] = [
  { key: "upcoming", label: "Upcoming" },
  { key: "past", label: "Past" },
  { key: "draft", label: "Drafts" },
];

function TripsPage() {
  const [tab, setTab] = useState<TripStatus>("upcoming");
  const visible = trips.filter((t) => t.status === tab);

  return (
    <>
      <PageHeader
        eyebrow="My trips"
        title="Every journey, in one place."
        description="Health scores and readiness travel with each trip, so you always know which one needs attention next."
      >
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {tabs.map((t) => (
            <Chip key={t.key} active={tab === t.key} onClick={() => setTab(t.key)}>
              {t.label} · {trips.filter((x) => x.status === t.key).length}
            </Chip>
          ))}
          <Link to="/planner" className="ml-auto">
            <VButton magnetic>Plan a new journey</VButton>
          </Link>
        </div>
      </PageHeader>

      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-7xl">
          {visible.length === 0 ? (
            <div className="rounded-4xl border border-dashed border-border p-14 text-center">
              <h2 className="text-xl font-semibold">Nothing here yet</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Start a journey and it will appear in this tab.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((trip, i) => (
                <Reveal key={trip.id} delay={i * 0.06}>
                  <TripCard trip={trip} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
