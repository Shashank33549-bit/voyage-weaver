"use client";

import { lazy, Suspense, useState } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { useEffectBudget } from "@/hooks/use-device";
import { GLOBE_DESTINATIONS, type GlobeDestination } from "./globe-data";

export { GLOBE_DESTINATIONS };
export type { GlobeDestination };

const EarthGlobe3D = lazy(() => import("./EarthGlobe3D"));

function GlobeFallback() {
  return (
    <div className="grid h-full w-full place-items-center" aria-hidden>
      <div className="size-[55%] animate-pulse rounded-full bg-primary/15 shadow-[0_0_90px_color-mix(in_oklab,var(--primary)_30%,transparent)]" />
    </div>
  );
}

/**
 * Interactive destination picker built on a photographic Earth: real NASA
 * imagery, drifting clouds, clickable country markers and a flight arc from
 * Delhi to the chosen country. The country list beside it mirrors every
 * marker for keyboard and screen-reader use.
 */
export function DestinationGlobe({
  value,
  onSelect,
  className,
}: {
  value: string | null;
  onSelect: (destination: GlobeDestination) => void;
  className?: string;
}) {
  const { reduced } = useEffectBudget();
  const [hovered, setHovered] = useState<string | null>(null);
  const active = GLOBE_DESTINATIONS.find((d) => d.code === value) ?? null;

  return (
    <div className={cn("grid gap-4 sm:grid-cols-[1.1fr_1fr] sm:gap-5", className)}>
      <div className="relative overflow-hidden rounded-3xl border border-border bg-ink/60">
        <div
          className="h-[280px] w-full touch-none select-none sm:h-[360px]"
          role="img"
          aria-label="Rotating Earth with destination countries marked. Use the country list beside it to choose a destination."
        >
          <ClientOnly fallback={<GlobeFallback />}>
            <Suspense fallback={<GlobeFallback />}>
              <EarthGlobe3D
                value={value}
                reduced={reduced}
                onSelect={onSelect}
                onHover={setHovered}
              />
            </Suspense>
          </ClientOnly>
        </div>
        <p className="pointer-events-none absolute inset-x-4 bottom-3 text-center text-[0.65rem] tracking-[0.14em] text-muted-foreground uppercase">
          Drag to spin · tap a country to choose
        </p>
        {(active || hovered) && (
          <div className="glass pointer-events-none absolute top-3 left-3 rounded-2xl px-3 py-2">
            <p className="text-[0.6rem] tracking-[0.16em] text-muted-foreground uppercase">
              {active ? "Destination" : "Preview"}
            </p>
            <p className="font-display text-sm font-semibold">
              {(active ?? GLOBE_DESTINATIONS.find((d) => d.code === hovered))?.country}
              <span className="text-muted-foreground">
                {" "}
                · {(active ?? GLOBE_DESTINATIONS.find((d) => d.code === hovered))?.city}
              </span>
            </p>
          </div>
        )}
      </div>

      <div>
        <p className="text-[0.65rem] tracking-[0.16em] text-muted-foreground uppercase">
          Or pick a country
        </p>
        <ul
          className="mt-3 grid max-h-[320px] grid-cols-2 gap-2 overflow-y-auto pr-1"
          aria-label="Destination countries"
        >
          {GLOBE_DESTINATIONS.map((d) => (
            <li key={d.code}>
              <button
                type="button"
                onClick={() => onSelect(d)}
                onMouseEnter={() => setHovered(d.code)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(d.code)}
                onBlur={() => setHovered(null)}
                aria-pressed={value === d.code}
                className={cn(
                  "w-full rounded-2xl border px-3 py-2 text-left transition-all duration-300",
                  value === d.code
                    ? "border-sunset/50 bg-sunset/12"
                    : "border-border bg-surface/50 hover:border-cyan/35 hover:bg-surface-2/60",
                )}
              >
                <span className="block text-xs font-semibold">{d.country}</span>
                <span className="block text-[0.65rem] text-muted-foreground">
                  {d.city} · {d.airport}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
