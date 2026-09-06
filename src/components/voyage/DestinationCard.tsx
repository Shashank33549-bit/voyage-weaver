import { CalendarDays, MapPin, Wallet } from "lucide-react";
import { SpotlightCard } from "@/components/animations/interactive";
import { Chip } from "@/components/voyage/primitives";
import { inrCompact } from "@/lib/format";
import type { Destination } from "@/types";

export function DestinationCard({
  destination,
  compact = false,
}: {
  destination: Destination;
  compact?: boolean;
}) {
  return (
    <SpotlightCard glare className="h-full">
      <article className="flex h-full flex-col">
        <div className="relative aspect-4/5 overflow-hidden">
          <img
            src={destination.image}
            alt={`${destination.city}, ${destination.country}`}
            loading="lazy"
            width={1024}
            height={1280}
            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-108"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ backgroundImage: "var(--gradient-ink)" }}
          />
          <div className="glass absolute top-4 right-4 rounded-full px-3 py-1.5 text-xs font-semibold text-cyan">
            {destination.match}% match
          </div>
          <div className="absolute bottom-4 left-5 right-5">
            <p className="flex items-center gap-1.5 text-[0.7rem] tracking-[0.16em] text-cyan uppercase">
              <MapPin className="size-3" aria-hidden /> {destination.country}
            </p>
            <h3 className="mt-1 text-xl font-semibold">{destination.city}</h3>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-5">
          {!compact && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {destination.blurb}
            </p>
          )}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl bg-surface/70 p-3">
              <p className="flex items-center gap-1.5 text-[0.65rem] tracking-[0.14em] text-muted-foreground uppercase">
                <Wallet className="size-3" aria-hidden /> From
              </p>
              <p className="mt-1 font-semibold">{inrCompact(destination.budget)}</p>
            </div>
            <div className="rounded-2xl bg-surface/70 p-3">
              <p className="flex items-center gap-1.5 text-[0.65rem] tracking-[0.14em] text-muted-foreground uppercase">
                <CalendarDays className="size-3" aria-hidden /> Ideal
              </p>
              <p className="mt-1 font-semibold">
                {destination.durationDays[0]}–{destination.durationDays[1]} days
              </p>
            </div>
          </div>
          <div className="mt-auto flex flex-wrap gap-2">
            <Chip>{destination.bestSeason}</Chip>
            {destination.tags.slice(0, 3).map((tag) => (
              <Chip key={tag}>{tag}</Chip>
            ))}
          </div>
        </div>
      </article>
    </SpotlightCard>
  );
}
