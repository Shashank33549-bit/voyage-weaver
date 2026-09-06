"use client";

import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarRange,
  Clock3,
  MapPin,
  PlaneTakeoff,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import heroImage from "@/assets/hero-voyage.jpg";
import {
  GridHorizon,
  NoiseOverlay,
} from "@/components/animations/backgrounds";
import { AuroraField } from "@/components/animations/rb-backgrounds";

import {
  BlurText,
  DecryptedText,
  RotatingText,
  ShinyText,
  SplitText,
} from "@/components/animations/text";
import { Reveal } from "@/components/animations/interactive";
import { MouseDepth } from "@/components/animations/parallax";
import { GlobeScene } from "@/components/experience/GlobeScene";
import { Chip, VButton } from "@/components/voyage/primitives";
import { useEffectBudget } from "@/hooks/use-device";

const chips = [
  { icon: PlaneTakeoff, label: "From", value: "Delhi (DEL)" },
  { icon: MapPin, label: "Destination", value: "Open to ideas" },
  { icon: CalendarRange, label: "Dates", value: "14 – 25 Oct" },
  { icon: Clock3, label: "Duration", value: "10 days" },
  { icon: Wallet, label: "Budget", value: "₹1.5 L" },
  { icon: Users, label: "Travellers", value: "2 adults" },
];

const floatingModules = [
  {
    id: "layover",
    label: "Istanbul layover",
    value: "4h 15m free",
    tone: "text-sunset",
    className: "left-[2%] top-[16%] sm:left-[4%] lg:left-[6%]",
    depth: 26,
  },
  {
    id: "visa",
    label: "Japan e-visa",
    value: "Verified today",
    tone: "text-success",
    className: "right-[2%] top-[26%] sm:right-[5%] lg:right-[8%]",
    depth: 18,
  },
  {
    id: "budget",
    label: "Budget health",
    value: "Comfortable",
    tone: "text-cyan",
    className: "left-[6%] bottom-[14%] hidden sm:block lg:left-[10%]",
    depth: 32,
  },
];

export function Hero() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [activeChip, setActiveChip] = useState<string | null>("Budget");
  const { reduced } = useEffectBudget();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const globeY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const globeScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 90]);

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden px-4 pt-28 pb-16 sm:px-6 sm:pt-32"
    >
      {/* Layer 1 — deep background photography */}
      <motion.img
        src={heroImage}
        alt=""
        aria-hidden
        width={1920}
        height={1080}
        style={reduced ? undefined : { y: bgY }}
        className="absolute inset-0 -z-30 h-[115%] w-full object-cover opacity-18"
      />
      <div aria-hidden className="absolute inset-0 -z-30 bg-background/68" />

      {/* Layer 2 — atmosphere: ONE React Bits WebGL field, nothing stacked on it */}
      <AuroraField className="-z-20" amplitude={1.1} blend={0.55} speed={0.7} />
      <GridHorizon className="-z-20 opacity-30" />


      {/* Layer 3 — the travel sphere */}
      <motion.div
        aria-hidden
        style={reduced ? undefined : { y: globeY, scale: globeScale }}
        className="absolute top-[2%] right-[-28%] -z-10 h-[60vh] w-[110%] sm:top-[-2%] sm:right-[-20%] sm:h-[82vh] sm:w-[90%] lg:right-[-10%] lg:w-[72%]"
      >
        <GlobeScene />
      </motion.div>
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-64"
        style={{ backgroundImage: "var(--gradient-ink)" }}
      />
      <NoiseOverlay className="-z-10" />

      {/* Layer 4 — floating intelligence modules */}
      {floatingModules.map((mod) => (
        <MouseDepth
          key={mod.id}
          strength={mod.depth}
          className={`pointer-events-none absolute z-10 ${mod.className}`}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="animate-float-soft module rounded-2xl px-4 py-3 text-left"
          >
            <p className="text-[0.6rem] tracking-[0.18em] text-muted-foreground uppercase">
              {mod.label}
            </p>
            <p className={`font-display text-sm font-semibold ${mod.tone}`}>
              <DecryptedText text={mod.value} />
            </p>
          </motion.div>
        </MouseDepth>
      ))}

      {/* Layer 5 — content */}
      <motion.div
        style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative z-20 mx-auto w-full max-w-7xl pt-12 text-left sm:pt-16"
      >
        <Reveal>
          <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium">
            <Sparkles className="size-3.5 text-cyan" aria-hidden />
            <ShinyText>An operating system for travellers</ShinyText>
          </span>
        </Reveal>

        <h1 className="mt-8 max-w-4xl text-[2.75rem] leading-[0.98] font-semibold sm:text-6xl lg:text-[5.4rem]">
          <span className="block">
            <BlurText text="Your Journey Begins" />
          </span>
          <span className="text-gradient mt-1 block">
            <BlurText text="Before You Leave." delay={0.35} />
          </span>
        </h1>

        <Reveal delay={0.5}>
           <p className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Destinations, itineraries, layover windows, visa reality and budgets —
            constructed into one journey by VoyageAI before you pack a bag.
          </p>
        </Reveal>

        <Reveal delay={0.6}>
           <div className="holo-border mt-11 max-w-3xl">
            <span aria-hidden className="holo-border-glow rounded-4xl" />
            <div className="module module-glow rounded-4xl p-4 text-left sm:p-5">
              <label htmlFor="hero-prompt" className="eyebrow flex items-center gap-2 px-1">
                <span className="size-1.5 animate-pulse-ring rounded-full bg-cyan" />
                Tell VoyageAI what you want
              </label>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  id="hero-prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="I have 10 days and ₹1.5 lakh. Where should I go?"
                  className="h-12 w-full rounded-2xl border border-input bg-background/50 px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-cyan/60 sm:text-base"
                />
                <VButton
                  size="lg"
                  magnetic
                  className="shrink-0"
                  onClick={() => navigate({ to: "/planner" })}
                >
                  Plan My Journey
                  <ArrowRight className="size-4" aria-hidden />
                </VButton>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
                {chips.map((chip) => (
                  <Chip
                    key={chip.label}
                    active={activeChip === chip.label}
                    onClick={() => setActiveChip(chip.label)}
                  >
                    <chip.icon className="size-3.5" aria-hidden />
                    <span className="text-muted-foreground">{chip.label}</span>
                    <span className="font-semibold text-foreground">{chip.value}</span>
                  </Chip>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.72}>
           <p className="mt-9 text-sm text-muted-foreground">
            Built for{" "}
            <RotatingText
              className="font-semibold text-cyan"
              items={[
                "10-day Japan routes",
                "9-hour Istanbul layovers",
                "multi-city Europe rail",
                "₹1.5 lakh budgets",
                "visa-safe itineraries",
              ]}
            />
          </p>
        </Reveal>

        <Reveal delay={0.8}>
           <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/discover">
              <VButton variant="glass" size="md" magnetic>
                Explore destinations
              </VButton>
            </Link>
            <Link to="/trips/$tripId" params={{ tripId: "sample-trip" }}>
              <VButton variant="ghost" size="md">
                See a live trip dashboard
              </VButton>
            </Link>
          </div>
        </Reveal>
      </motion.div>

      <Reveal delay={1} className="relative z-20 mx-auto mt-14 hidden sm:block">
        <span className="flex flex-col items-center gap-2 text-[0.6rem] tracking-[0.28em] text-muted-foreground uppercase">
          <SplitText text="Scroll to board" />
          <span aria-hidden className="h-10 w-px overflow-hidden bg-border">
            <span className="animate-scan block h-3 w-px bg-cyan" />
          </span>
        </span>
      </Reveal>
    </section>
  );
}
