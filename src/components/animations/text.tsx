"use client";

/**
 * Typography motion layer.
 *
 * Every export here now delegates to the official React Bits component
 * (vendored in `@/components/reactbits`) while keeping the app-facing API
 * stable, so the whole product picks up React Bits motion without touching
 * every call site. Reduced-motion always falls back to plain text.
 */

import { type ReactNode } from "react";
import RBSplitText from "@/components/reactbits/SplitText";
import RBBlurText from "@/components/reactbits/BlurText";
import RBShinyText from "@/components/reactbits/ShinyText";
import RBCountUp from "@/components/reactbits/CountUp";
import RBDecryptedText from "@/components/reactbits/DecryptedText";
import RBRotatingText from "@/components/reactbits/RotatingText";
import RBTrueFocus from "@/components/reactbits/TrueFocus";
import RBScrollReveal from "@/components/reactbits/ScrollReveal";
import { usePrefersReducedMotion, useHydrated } from "@/hooks/use-device";
import { cn } from "@/lib/utils";

type Tag = "span" | "h1" | "h2" | "h3" | "p";

/** React Bits SplitText — word-level entrance for headings and labels. */
export function SplitText({
  text,
  className,
  delay = 0,
  stagger = 0.055,
  as = "span",
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: Tag;
}) {
  const reduced = usePrefersReducedMotion();
  const hydrated = useHydrated();
  if (reduced || !hydrated) return <span className={className}>{text}</span>;

  return (
    <RBSplitText
      text={text}
      tag={as}
      className={cn("inline-block", className)}
      splitType="words"
      delay={Math.round(stagger * 1000) + Math.round(delay * 1000) / 12}
      duration={0.9}
      ease="power3.out"
      from={{ opacity: 0, yPercent: 110, rotate: 2 }}
      to={{ opacity: 1, yPercent: 0, rotate: 0 }}
      threshold={0.15}
      rootMargin="-40px"
      textAlign="inherit"
    />
  );
}

/**
 * React Bits SplitText tuned as a cinematic blur reveal — the signature
 * headline treatment (character level, blur + depth).
 */
export function BlurText({
  text,
  className,
  delay = 0,
  as = "span",
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: Tag;
}) {
  const reduced = usePrefersReducedMotion();
  const hydrated = useHydrated();
  if (reduced || !hydrated) return <span className={className}>{text}</span>;

  return (
    <RBSplitText
      text={text}
      tag={as}
      className={cn("inline-block", className)}
      splitType="chars"
      delay={28}
      duration={1.05}
      ease="power4.out"
      from={{ opacity: 0, y: 26, filter: "blur(12px)", rotateX: 40 }}
      to={{ opacity: 1, y: 0, filter: "blur(0px)", rotateX: 0 }}
      threshold={0.1}
      rootMargin={delay > 0 ? "-20px" : "-40px"}
      textAlign="inherit"
    />
  );
}

/** React Bits ShinyText — sweeping highlight for eyebrow copy. */
export function ShinyText({
  children,
  className,
  speed = 5,
}: {
  children: ReactNode;
  className?: string;
  speed?: number;
}) {
  const reduced = usePrefersReducedMotion();
  const text = typeof children === "string" ? children : "";
  if (!text || reduced) return <span className={className}>{children}</span>;

  return (
    <RBShinyText
      text={text}
      speed={speed}
      className={className}
      color="color-mix(in oklab, var(--foreground) 62%, transparent)"
      shineColor="var(--cyan)"
    />
  );
}

/** React Bits RotatingText — phrase carousel with staggered characters. */
export function RotatingText({
  items,
  interval = 2400,
  className,
}: {
  items: string[];
  interval?: number;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const hydrated = useHydrated();
  if (reduced || !hydrated) return <span className={className}>{items[0]}</span>;

  return (
    <RBRotatingText
      texts={items}
      auto
      loop
      rotationInterval={interval}
      staggerDuration={0.018}
      staggerFrom="first"
      splitBy="characters"
      mainClassName={cn("inline-flex overflow-hidden align-bottom", className)}
      splitLevelClassName="overflow-hidden"
      transition={{ type: "spring", damping: 26, stiffness: 320 }}
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "-110%", opacity: 0 }}
    />
  );
}

/** React Bits CountUp — spring-driven numeric reveal. */
export function CountUp({
  to,
  duration = 1600,
  prefix = "",
  suffix = "",
  decimals = 0,
  format = true,
  className,
}: {
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  format?: boolean;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const hydrated = useHydrated();
  const seconds = duration > 30 ? duration / 1000 : duration;
  const value = Number(to.toFixed(decimals));

  if (reduced || !hydrated) {
    return (
      <span className={cn("tabular-nums", className)}>
        {prefix}
        {format ? value.toLocaleString("en-IN") : value.toFixed(decimals)}
        {suffix}
      </span>
    );
  }

  return (
    <span className={cn("tabular-nums", className)}>
      {prefix}
      <RBCountUp to={value} duration={seconds} separator={format ? "," : ""} />
      {suffix}
    </span>
  );
}

/** React Bits DecryptedText — scrambled readout for data and status labels. */
export function DecryptedText({
  text,
  className,
  speed = 38,
}: {
  text: string;
  className?: string;
  speed?: number;
}) {
  const reduced = usePrefersReducedMotion();
  const hydrated = useHydrated();
  if (reduced || !hydrated) return <span className={className}>{text}</span>;

  return (
    <RBDecryptedText
      text={text}
      speed={speed}
      animateOn="view"
      sequential
      revealDirection="start"
      useOriginalCharsOnly={false}
      parentClassName={cn("tabular-nums", className)}
      encryptedClassName="text-muted-foreground/70"
    />
  );
}

/** React Bits BlurText — paragraph copy that resolves word by word. */
export function TextReveal({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const hydrated = useHydrated();
  if (reduced || !hydrated)
    return <p className={cn("text-muted-foreground", className)}>{text}</p>;

  return (
    <RBBlurText
      text={text}
      animateBy="words"
      direction="bottom"
      delay={26}
      stepDuration={0.3}
      className={cn("text-muted-foreground", className)}
    />
  );
}

/** React Bits ScrollReveal — long-form statement that resolves on scroll. */
export function ScrollReveal({
  children,
  containerClassName,
  textClassName,
}: {
  children: string;
  containerClassName?: string;
  textClassName?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const hydrated = useHydrated();
  if (reduced || !hydrated)
    return <p className={cn(containerClassName, textClassName)}>{children}</p>;

  return (
    <RBScrollReveal
      containerClassName={containerClassName}
      textClassName={textClassName}
      enableBlur
      baseOpacity={0.12}
      baseRotation={2}
      blurStrength={5}
    >
      {children}
    </RBScrollReveal>
  );
}

/** React Bits TrueFocus — attention pass across a short phrase. */
export function TrueFocus({
  sentence,
  className,
}: {
  sentence: string;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const hydrated = useHydrated();
  if (reduced || !hydrated) return <span className={className}>{sentence}</span>;

  return (
    <span className={className}>
      <RBTrueFocus
        sentence={sentence}
        blurAmount={4}
        borderColor="var(--cyan)"
        glowColor="color-mix(in oklab, var(--cyan) 60%, transparent)"
        animationDuration={0.6}
        pauseBetweenAnimations={1.2}
      />
    </span>
  );
}
