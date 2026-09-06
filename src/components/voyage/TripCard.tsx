import { Link } from "@tanstack/react-router";
import { CalendarDays, Users } from "lucide-react";
import { SpotlightCard } from "@/components/animations/interactive";
import { ProgressBar } from "@/components/voyage/primitives";
import { inr } from "@/lib/format";
import type { Trip } from "@/types";

export function TripCard({ trip }: { trip: Trip }) {
  const isSample = trip.id === "sample-trip";

  return (
    <SpotlightCard className="h-full">
      <article className="flex h-full flex-col">
        <div className="relative h-44 overflow-hidden">
          <img
            src={trip.image}
            alt={`${trip.title}, ${trip.country}`}
            loading="lazy"
            width={1024}
            height={1280}
            className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-108"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ backgroundImage: "var(--gradient-ink)" }}
          />
          <div className="absolute bottom-4 left-5">
            <p className="text-[0.68rem] tracking-[0.16em] text-cyan uppercase">
              {trip.country}
            </p>
            <h3 className="text-xl font-semibold">{trip.title}</h3>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-5">
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-3.5" aria-hidden /> {trip.dates}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="size-3.5" aria-hidden /> {trip.travellers} travellers
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-surface/70 p-3">
              <p className="text-[0.65rem] tracking-[0.14em] text-muted-foreground uppercase">
                Duration
              </p>
              <p className="mt-1 font-semibold">{trip.durationDays} days</p>
            </div>
            <div className="rounded-2xl bg-surface/70 p-3">
              <p className="text-[0.65rem] tracking-[0.14em] text-muted-foreground uppercase">
                Budget
              </p>
              <p className="mt-1 font-semibold">{inr(trip.budget)}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Trip health</span>
                <span className="font-semibold tabular-nums">{trip.health} / 100</span>
              </div>
              <ProgressBar
                className="mt-1.5 h-1.5"
                value={trip.health}
                tone={trip.health >= 85 ? "success" : "warning"}
                label={`${trip.title} trip health`}
              />
            </div>
            <div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Readiness</span>
                <span className="font-semibold tabular-nums">{trip.readiness}%</span>
              </div>
              <ProgressBar
                className="mt-1.5 h-1.5"
                value={trip.readiness}
                tone="cyan"
                label={`${trip.title} readiness`}
              />
            </div>
          </div>

          <div className="mt-auto pt-2">
            {isSample ? (
              <Link
                to="/trips/$tripId"
                params={{ tripId: "sample-trip" }}
                className="inline-flex text-sm font-semibold text-cyan transition-colors hover:text-foreground"
              >
                Open trip dashboard →
              </Link>
            ) : (
              <Link
                to="/trips/$tripId"
                params={{ tripId: trip.id }}
                className="inline-flex text-sm font-semibold text-muted-foreground transition-colors hover:text-cyan"
              >
                View trip →
              </Link>
            )}
          </div>
        </div>
      </article>
    </SpotlightCard>
  );
}
