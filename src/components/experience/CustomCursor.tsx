"use client";

/**
 * One cohesive cursor system for VoyageAI, built on React Bits:
 *   TargetCursor → framing reticle that locks onto `.cursor-target` elements
 *   ClickSpark   → single restrained click confirmation
 *
 * Desktop + fine pointer + motion enabled only. Touch devices and
 * reduced-motion users keep the native cursor and no canvas layer.
 */

import { lazy, Suspense, useEffect, type ReactNode } from "react";
import { useEffectBudget } from "@/hooks/use-device";

const TargetCursor = lazy(() => import("@/components/reactbits/TargetCursor"));
const ClickSpark = lazy(() => import("@/components/reactbits/ClickSpark"));

export function CustomCursor() {
  const { tier } = useEffectBudget();
  const enabled = tier === "heavy";

  useEffect(() => {
    if (!enabled) return undefined;
    document.documentElement.classList.add("has-custom-cursor");
    return () => document.documentElement.classList.remove("has-custom-cursor");
  }, [enabled]);

  if (!enabled) return null;

  return (
    <Suspense fallback={null}>
      <TargetCursor
        targetSelector=".cursor-target, a, button, [role='button']"
        spinDuration={6}
        hoverDuration={0.28}
        parallaxOn
        cursorColor="#e6f7fb"
        cursorColorOnTarget="#63dbe8"
      />
    </Suspense>
  );
}

/** Wraps the app so clicks emit a subtle React Bits spark. */
export function CursorSpark({ children }: { children: ReactNode }) {
  const { tier } = useEffectBudget();

  if (tier !== "heavy") return <>{children}</>;

  return (
    <Suspense fallback={<>{children}</>}>
      <ClickSpark
        sparkColor="#63dbe8"
        sparkSize={7}
        sparkRadius={18}
        sparkCount={7}
        duration={430}
        easing="ease-out"
      >
        {children}
      </ClickSpark>
    </Suspense>
  );
}
