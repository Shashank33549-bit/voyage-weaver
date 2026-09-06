"use client";

/**
 * Destination discovery surface.
 *
 * Desktop with motion enabled → React Bits CircularGallery (WebGL, drag/scroll
 * driven arc of destination imagery). Everywhere else (touch, reduced motion,
 * low effect budget) → the existing accessible DestinationCarousel, so no
 * functionality is lost.
 */

import { Suspense } from "react";
import { RBCircularGallery } from "@/components/reactbits/rb-client";
import { DestinationCarousel } from "@/components/voyage/DestinationCarousel";
import { useEffectBudget } from "@/hooks/use-device";
import { cn } from "@/lib/utils";
import type { Destination } from "@/types";

export function DestinationGallery({
  items,
  className,
  label = "Destination gallery",
}: {
  items: Destination[];
  className?: string;
  label?: string;
}) {
  const { tier } = useEffectBudget();

  if (tier !== "heavy") {
    return (
      <DestinationCarousel items={items} className={className} label={label} />
    );
  }

  const galleryItems = items.map((d) => ({
    image: d.image,
    text: `${d.city} · ${d.country}`,
  }));

  return (
    <div className={cn("relative", className)}>
      <div
        className="h-[460px] w-full cursor-grab active:cursor-grabbing sm:h-[540px]"
        role="img"
        aria-label={`${label}: ${items.map((d) => `${d.city}, ${d.country}`).join("; ")}`}
      >
        <Suspense fallback={null}>
          <RBCircularGallery
            items={galleryItems}
            bend={2.4}
            textColor="#e8f4ff"
            borderRadius={0.06}
            scrollEase={0.05}
            font="600 26px 'Space Grotesk', sans-serif"
          />
        </Suspense>
      </div>
      <p className="mt-3 text-center text-xs tracking-[0.18em] text-muted-foreground uppercase">
        Drag or scroll to explore
      </p>
    </div>
  );
}
