"use client";

/**
 * Navigation is the React Bits PillNav — one premium nav for the whole app.
 * It ships the desktop pill rail, the hover circle animation and the mobile
 * sheet, so we only supply routing, brand colors and the primary CTA.
 */

import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import PillNav from "@/components/reactbits/PillNav";
import { VButton } from "@/components/voyage/primitives";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Discover", href: "/discover" },
  { label: "Plan Trip", href: "/planner" },
  { label: "My Trips", href: "/trips" },
  { label: "Layover", href: "/layover" },
  { label: "Visa", href: "/visa" },
  { label: "Budget", href: "/budget" },
  { label: "Profile", href: "/profile" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeHref =
    navItems.find(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
    )?.href ?? "/";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-[76px] transition-colors duration-500",
        scrolled
          ? "border-b border-border/60 bg-ink/70 backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <div className="relative mx-auto flex h-full max-w-7xl items-start justify-center px-3 sm:px-5">
        <PillNav
          logo="/voyage-mark.svg"
          logoAlt="VoyageAI"
          items={navItems}
          activeHref={activeHref}
          baseColor="#0e1626"
          pillColor="#63dbe8"
          hoveredPillTextColor="#e8f4ff"
          pillTextColor="#06121c"
          initialLoadAnimation={false}
          ease="power3.easeOut"
        />

        <div className="absolute right-5 top-[1em] hidden h-[42px] items-center lg:flex">
          <Link to="/planner" aria-label="Plan your journey">
            <VButton size="sm" magnetic>
              Plan Your Journey
            </VButton>
          </Link>
        </div>
      </div>
    </header>
  );
}
