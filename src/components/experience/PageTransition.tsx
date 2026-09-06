"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useEffectBudget } from "@/hooks/use-device";

/** Fast, cinematic blur-fade between routes. */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { reduced } = useEffectBudget();

  if (reduced) return <>{children}</>;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 14, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
        transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
