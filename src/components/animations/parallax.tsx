"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useEffectBudget } from "@/hooks/use-device";

/** Moves content at a different speed to the page for layered depth. */
export function Parallax({
  children,
  className,
  distance = 80,
  scale = false,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
  scale?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { reduced } = useEffectBudget();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [distance, -distance]), {
    stiffness: 90,
    damping: 26,
    mass: 0.4,
  });
  const s = useTransform(scrollYProgress, [0, 0.5, 1], [1.06, 1, 1.06]);

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={cn("relative", className)}>
      <motion.div style={{ y, scale: scale ? s : 1 }} className="will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}

/** Image inside an overflow-clipped frame that drifts and scales on scroll. */
export function ParallaxImage({
  src,
  alt,
  className,
  imgClassName,
  distance = 60,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  distance?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { reduced } = useEffectBudget();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-distance, distance]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        style={reduced ? undefined : { y }}
        className={cn(
          "h-[118%] w-full -translate-y-[8%] object-cover will-change-transform",
          imgClassName,
        )}
      />
    </div>
  );
}

/** Fades + lifts content as it scrolls through the viewport. */
export function ScrollFade({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { reduced } = useEffectBudget();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.22, 0.78, 1], [0.2, 1, 1, 0.2]);
  const scale = useTransform(scrollYProgress, [0, 0.25, 0.8, 1], [0.96, 1, 1, 0.97]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={reduced ? undefined : { opacity, scale }}>{children}</motion.div>
    </div>
  );
}

/**
 * Real CSS 3D tilt with layered depth — children can opt into extra pop with
 * `data-depth="1"` (or 2/3) to sit above the card plane.
 */
export function Tilt3D({
  children,
  className,
  max = 10,
  glare = true,
  spotlight = true,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
  spotlight?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { tier } = useEffectBudget();
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [active, setActive] = useState(false);
  const interactive = tier === "heavy";

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const rx = ((pos.y - 50) / 50) * max;
  const ry = ((50 - pos.x) / 50) * max;

  return (
    <div
      className={cn("[perspective:1200px]", className)}
      onPointerMove={onMove}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => {
        setActive(false);
        setPos({ x: 50, y: 50 });
      }}
    >
      <div
        ref={ref}
        className="relative h-full transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [transform-style:preserve-3d]"
        style={{
          transform: active
            ? `rotateX(${-rx}deg) rotateY(${-ry}deg) translateZ(14px)`
            : "rotateX(0deg) rotateY(0deg) translateZ(0)",
        }}
      >
        {children}
        {spotlight && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500"
            style={{
              opacity: active ? 1 : 0,
              background: `radial-gradient(460px circle at ${pos.x}% ${pos.y}%, color-mix(in oklab, var(--cyan) 15%, transparent), transparent 68%)`,
            }}
          />
        )}
        {glare && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] mix-blend-overlay transition-opacity duration-500"
            style={{
              opacity: active ? 0.7 : 0,
              background: `linear-gradient(${100 + ry * 3}deg, transparent 38%, oklch(1 0 0 / 0.28) ${pos.x / 2 + 24}%, transparent 62%)`,
            }}
          />
        )}
      </div>
    </div>
  );
}

/** Wraps floating decorations that drift with the pointer for hero depth. */
export function MouseDepth({
  children,
  className,
  strength = 22,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const { tier } = useEffectBudget();
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (tier !== "heavy") return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setOffset({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * strength,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * strength,
    });
  };

  return (
    <div
      ref={ref}
      className={cn("relative", className)}
      onPointerMove={onMove}
      onPointerLeave={() => setOffset({ x: 0, y: 0 })}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition: "transform 500ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {children}
    </div>
  );
}
