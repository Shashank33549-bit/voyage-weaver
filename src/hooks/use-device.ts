"use client";

import { useEffect, useState } from "react";

/** True after hydration — safe gate for browser-only rendering. */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}

/** Respects prefers-reduced-motion, updating live. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/** True for fine pointers (mouse/trackpad) — gates cursor + hover effects. */
export function useFinePointer() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setFine(mq.matches);
    const onChange = () => setFine(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return fine;
}

/** True when the viewport is desktop-sized — used to scale effect budgets. */
export function useIsDesktop(minWidth = 1024) {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${minWidth}px)`);
    setDesktop(mq.matches);
    const onChange = () => setDesktop(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [minWidth]);
  return desktop;
}

/**
 * Single source of truth for how expensive the experience is allowed to be.
 * heavy   → full 3D scene, cursor trail, particles
 * light   → simplified visuals, no cursor layer
 * still   → reduced motion, static composition
 */
export function useEffectBudget() {
  const hydrated = useHydrated();
  const reduced = usePrefersReducedMotion();
  const fine = useFinePointer();
  const desktop = useIsDesktop();

  if (!hydrated) return { tier: "still" as const, reduced: true, fine: false, desktop: false };
  if (reduced) return { tier: "still" as const, reduced, fine, desktop };
  if (fine && desktop) return { tier: "heavy" as const, reduced, fine, desktop };
  return { tier: "light" as const, reduced, fine, desktop };
}
