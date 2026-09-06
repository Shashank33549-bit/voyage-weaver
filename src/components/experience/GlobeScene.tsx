"use client";

import { lazy, Suspense } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { useEffectBudget } from "@/hooks/use-device";

const WorldGlobe3D = lazy(() => import("./WorldGlobe3D"));

function GlobeFallback() {
  return (
    <div className="relative grid h-full w-full place-items-center" aria-hidden>
      <div className="absolute size-[58%] rounded-full border border-cyan/20 bg-primary/10 shadow-[0_0_100px_color-mix(in_oklab,var(--primary)_25%,transparent)]" />
      <div className="absolute size-[66%] rounded-full border border-cyan/15" />
      <div className="absolute w-[72%] rotate-12 orbital-line" />
    </div>
  );
}

export function GlobeScene({ className }: { className?: string }) {
  const { reduced } = useEffectBudget();
  return (
    <div className={cn("h-full w-full", className)} aria-hidden>
      <ClientOnly fallback={<GlobeFallback />}>
        <Suspense fallback={<GlobeFallback />}>
          <WorldGlobe3D reduced={reduced} />
        </Suspense>
      </ClientOnly>
    </div>
  );
}