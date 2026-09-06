"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { DestinationCard } from "@/components/voyage/DestinationCard";
import type { Destination } from "@/types";

export function DestinationCarousel({
  items,
  className,
  label = "Destinations",
}: {
  items: Destination[];
  className?: string;
  label?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <div className={cn("relative", className)}>
      <div className="mb-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          aria-label={`Scroll ${label} left`}
          className="grid size-10 place-items-center rounded-full border border-border bg-surface/70 text-muted-foreground transition-colors hover:border-cyan/50 hover:text-cyan"
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          aria-label={`Scroll ${label} right`}
          className="grid size-10 place-items-center rounded-full border border-border bg-surface/70 text-muted-foreground transition-colors hover:border-cyan/50 hover:text-cyan"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
      <div
        ref={trackRef}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:-mx-6 sm:px-6 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((d) => (
          <div
            key={d.id}
            className="w-[78vw] shrink-0 snap-start sm:w-[46vw] lg:w-[27vw] xl:w-[22rem]"
          >
            <DestinationCard destination={d} compact />
          </div>
        ))}
      </div>
    </div>
  );
}
