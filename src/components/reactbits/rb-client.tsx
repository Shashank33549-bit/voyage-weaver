"use client";

/**
 * Client gate + lazy loaders for the heavy (WebGL / GSAP) React Bits
 * components. Every WebGL background is dynamically imported so it never
 * enters the SSR bundle, and it only mounts when the device effect budget
 * allows it. This keeps at most one canvas background alive per page.
 */

import { Suspense, lazy, type ComponentType } from "react";
import { useEffectBudget } from "@/hooks/use-device";
import { cn } from "@/lib/utils";

const AuroraRB = lazy(() => import("./Aurora"));
const ParticlesRB = lazy(() => import("./Particles"));
const LightRaysRB = lazy(() => import("./LightRays"));
const ThreadsRB = lazy(() => import("./Threads"));
const DarkVeilRB = lazy(() => import("./DarkVeil"));
const IridescenceRB = lazy(() => import("./Iridescence"));
const CircularGalleryRB = lazy(() => import("./CircularGallery"));

/** Wraps a canvas effect in an absolutely-positioned, non-interactive layer. */
function EffectLayer({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <Suspense fallback={null}>{children}</Suspense>
    </div>
  );
}

/**
 * Renders a WebGL React Bits background only on capable devices with motion
 * enabled. Anything else gets the (cheap) fallback passed in.
 */
export function WebGLLayer({
  className,
  children,
  fallback = null,
  requireDesktop = false,
}: {
  className?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireDesktop?: boolean;
}) {
  const { tier, desktop } = useEffectBudget();
  const allowed = tier !== "still" && (!requireDesktop || desktop);
  if (!allowed) return <>{fallback}</>;
  return <EffectLayer className={className}>{children}</EffectLayer>;
}

export const RBAurora = AuroraRB as ComponentType<
  React.ComponentProps<typeof AuroraRB>
>;
export const RBParticles = ParticlesRB;
export const RBLightRays = LightRaysRB;
export const RBThreads = ThreadsRB;
export const RBDarkVeil = DarkVeilRB;
export const RBIridescence = IridescenceRB;
export const RBCircularGallery = CircularGalleryRB;
