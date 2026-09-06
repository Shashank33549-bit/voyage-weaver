"use client";

/**
 * Interaction layer. Each export delegates to an official React Bits
 * component (vendored in `@/components/reactbits`) while keeping the
 * app-facing API stable.
 *
 * Hierarchy of card treatments used across the product:
 *   SpotlightCard  → default surface (React Bits SpotlightCard)
 *   glare          → featured surface (+ React Bits GlareHover)
 *   FeatureCard    → hero-level surface (React Bits ElectricBorder)
 *   TiltCard       → media-led surface (React Bits TiltedCard motion)
 */

import { type ReactNode } from "react";
import RBSpotlightCard from "@/components/reactbits/SpotlightCard";
import RBGlareHover from "@/components/reactbits/GlareHover";
import RBMagnet from "@/components/reactbits/Magnet";
import RBAnimatedContent from "@/components/reactbits/AnimatedContent";
import RBFadeContent from "@/components/reactbits/FadeContent";
import RBElectricBorder from "@/components/reactbits/ElectricBorder";
import RBAnimatedList from "@/components/reactbits/AnimatedList";
import { useEffectBudget, usePrefersReducedMotion } from "@/hooks/use-device";
import { cn } from "@/lib/utils";

/** React Bits AnimatedContent — the standard scroll-triggered reveal. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 26,
  direction = "vertical",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  direction?: "vertical" | "horizontal";
}) {
  const reduced = usePrefersReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <RBAnimatedContent
      className={className}
      distance={y}
      direction={direction}
      duration={0.8}
      ease="power3.out"
      initialOpacity={0}
      animateOpacity
      scale={1}
      threshold={0.15}
      delay={delay}
    >
      {children}
    </RBAnimatedContent>
  );
}

/** React Bits FadeContent — quiet reveal for serious content (visa, legal). */
export function Fade({
  children,
  className,
  delay = 0,
  blur = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  blur?: boolean;
}) {
  const reduced = usePrefersReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <RBFadeContent
      className={className}
      blur={blur}
      duration={900}
      delay={delay * 1000}
      threshold={0.15}
      initialOpacity={0}
    >
      {children}
    </RBFadeContent>
  );
}

/** React Bits SpotlightCard (optionally wrapped in GlareHover). */
export function SpotlightCard({
  children,
  className,
  glare = false,
}: {
  children: ReactNode;
  className?: string;
  tilt?: boolean;
  glare?: boolean;
}) {
  const { tier } = useEffectBudget();

  const card = (
    <RBSpotlightCard
      className={cn(
        "h-full border-border! bg-card/70! p-0! transition-[transform,box-shadow,border-color] duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-elevated",
        className,
      )}
      spotlightColor="rgba(99, 219, 232, 0.18)"
    >
      {children}
    </RBSpotlightCard>
  );

  if (!glare || tier !== "heavy") return card;

  return (
    <RBGlareHover
      width="100%"
      height="100%"
      background="transparent"
      borderColor="transparent"
      borderRadius="1.5rem"
      glareColor="#ffffff"
      glareOpacity={0.18}
      glareAngle={-38}
      glareSize={220}
      transitionDuration={900}
      className="border-0! bg-transparent!"
      style={{ display: "block" }}
    >
      {card}
    </RBGlareHover>
  );
}

/** React Bits ElectricBorder — reserved for one hero-level surface per page. */
export function FeatureCard({
  children,
  className,
  color = "#63dbe8",
}: {
  children: ReactNode;
  className?: string;
  color?: string;
}) {
  const { tier } = useEffectBudget();

  if (tier !== "heavy") {
    return (
      <div className={cn("rounded-3xl border border-cyan/30 bg-card/70", className)}>
        {children}
      </div>
    );
  }

  return (
    <RBElectricBorder
      color={color}
      speed={0.7}
      chaos={0.4}
      borderRadius={24}
      className={className}
    >
      <div className="h-full rounded-3xl bg-card/70">{children}</div>
    </RBElectricBorder>
  );
}

/** React Bits Magnet — cursor-attracted wrapper for primary actions. */
export function Magnetic({
  children,
  className,
  strength = 14,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const { tier } = useEffectBudget();

  return (
    <RBMagnet
      padding={70}
      disabled={tier !== "heavy"}
      magnetStrength={Math.max(3, 60 / strength)}
      wrapperClassName={cn("inline-block", className)}
      activeTransition="transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
      inactiveTransition="transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)"
    >
      {children}
    </RBMagnet>
  );
}

/** Staggered entrance built from React Bits AnimatedContent. */
export function AnimatedList({
  children,
  className,
  stagger = 0.07,
}: {
  children: ReactNode[];
  className?: string;
  stagger?: number;
}) {
  const reduced = usePrefersReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <div className={className}>
      {children.map((child, i) => (
        <RBAnimatedContent
          key={i}
          distance={18}
          direction="vertical"
          duration={0.6}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          threshold={0.12}
          delay={i * stagger}
        >
          {child}
        </RBAnimatedContent>
      ))}
    </div>
  );
}

/** React Bits AnimatedList — scrollable, keyboard-navigable option list. */
export function SelectableList({
  items,
  onSelect,
  className,
  itemClassName,
}: {
  items: string[];
  onSelect?: (item: string, index: number) => void;
  className?: string;
  itemClassName?: string;
}) {
  return (
    <RBAnimatedList
      items={items}
      onItemSelect={onSelect}
      showGradients
      enableArrowNavigation
      displayScrollbar={false}
      className={className}
      itemClassName={cn(
        "bg-surface-2/70! border border-border rounded-2xl",
        itemClassName,
      )}
    />
  );
}
