"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useEffectBudget } from "@/hooks/use-device";

/**
 * Cinematic inertial scrolling. Disabled entirely for reduced-motion users so
 * native scrolling stays instant and accessible.
 */
export function SmoothScroll() {
  const { reduced } = useEffectBudget();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      lerp: 0.11,
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onAnchor = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>(
        'a[href^="#"]',
      );
      if (!anchor) return;
      const id = anchor.getAttribute("href")?.slice(1);
      const el = id ? document.getElementById(id) : null;
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: -96 });
    };
    document.addEventListener("click", onAnchor);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onAnchor);
      lenis.destroy();
    };
  }, [reduced]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}
