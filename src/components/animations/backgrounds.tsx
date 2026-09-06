"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** Soft drifting aurora blooms behind a section. */
export function Aurora({
  className,
  intensity = 1,
}: {
  className?: string;
  intensity?: number;
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div
        className="animate-aurora absolute -top-1/3 left-[-10%] h-[80vh] w-[70vw] rounded-full blur-[110px]"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, color-mix(in oklab, var(--primary) 60%, transparent), transparent 65%)",
          opacity: 0.55 * intensity,
        }}
      />
      <div
        className="animate-aurora absolute -top-1/4 right-[-15%] h-[70vh] w-[60vw] rounded-full blur-[120px]"
        style={{
          background:
            "radial-gradient(circle at 60% 40%, color-mix(in oklab, var(--cyan) 55%, transparent), transparent 68%)",
          opacity: 0.4 * intensity,
          animationDelay: "-8s",
        }}
      />
      <div
        className="animate-aurora absolute bottom-[-30%] left-[25%] h-[60vh] w-[55vw] rounded-full blur-[130px]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, color-mix(in oklab, var(--sunset) 45%, transparent), transparent 70%)",
          opacity: 0.26 * intensity,
          animationDelay: "-14s",
        }}
      />
    </div>
  );
}

/** Lightweight canvas particle field (stars / drifting dust). */
export function Particles({
  className,
  count = 70,
  speed = 0.12,
}: {
  className?: string;
  count?: number;
  speed?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const dots = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      a: Math.random() * 0.5 + 0.15,
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        d.x += d.vx / w;
        d.y += d.vy / h;
        if (d.x < 0) d.x = 1;
        if (d.x > 1) d.x = 0;
        if (d.y < 0) d.y = 1;
        if (d.y > 1) d.y = 0;
        ctx.beginPath();
        ctx.arc(d.x * w, d.y * h, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(190, 228, 255, ${d.a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [count, speed]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    />
  );
}

/** Slow iridescent sheen — used sparingly for closing sections. */
export function Iridescence({ className }: { className?: string }) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const loop = () => {
      setT((v) => (v + 0.15) % 360);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const style = useMemo(
    () => ({
      background: `conic-gradient(from ${t}deg at 50% 50%, color-mix(in oklab, var(--primary) 45%, transparent), color-mix(in oklab, var(--cyan) 40%, transparent), color-mix(in oklab, var(--sunset) 35%, transparent), color-mix(in oklab, var(--primary) 45%, transparent))`,
    }),
    [t],
  );

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div className="absolute inset-[-40%] opacity-25 blur-[120px]" style={style} />
    </div>
  );
}

/** Volumetric light rays sweeping from a vanishing point. */
export function LightRays({
  className,
  origin = "top",
}: {
  className?: string;
  origin?: "top" | "bottom";
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className="animate-ray absolute h-[160%] w-[16vw] blur-[42px]"
          style={{
            top: origin === "top" ? "-40%" : "-20%",
            left: `${6 + i * 14}%`,
            background:
              i % 2 === 0
                ? "linear-gradient(180deg, color-mix(in oklab, var(--cyan) 26%, transparent), transparent 70%)"
                : "linear-gradient(180deg, color-mix(in oklab, var(--primary) 30%, transparent), transparent 72%)",
            transform: `rotate(${origin === "top" ? 14 : -14}deg)`,
            opacity: 0.32,
            animationDelay: `${i * -2.6}s`,
          }}
        />
      ))}
    </div>
  );
}

/** Fine film grain — kills the flat "template" look on large glass areas. */
export function NoiseOverlay({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("noise pointer-events-none absolute inset-0 opacity-[0.05]", className)}
    />
  );
}

/** Perspective grid receding to a horizon — futuristic floor plane. */
export function GridHorizon({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div className="absolute inset-x-[-30%] bottom-[-10%] h-[62%] [perspective:520px]">
        <div
          className="grid-lines h-full w-full origin-bottom"
          style={{
            transform: "rotateX(72deg)",
            maskImage: "linear-gradient(to top, black, transparent 78%)",
            WebkitMaskImage: "linear-gradient(to top, black, transparent 78%)",
          }}
        />
      </div>
    </div>
  );
}

/** Slow liquid blob field — organic motion for feature sections. */
export function LiquidField({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div
        className="animate-liquid absolute top-[10%] left-[8%] size-[36vw] rounded-[45%_55%_60%_40%] blur-[80px]"
        style={{
          background:
            "linear-gradient(140deg, color-mix(in oklab, var(--primary) 42%, transparent), color-mix(in oklab, var(--cyan) 26%, transparent))",
          opacity: 0.34,
        }}
      />
      <div
        className="animate-liquid absolute right-[6%] bottom-[6%] size-[30vw] rounded-[60%_40%_45%_55%] blur-[90px]"
        style={{
          background:
            "linear-gradient(200deg, color-mix(in oklab, var(--sunset) 38%, transparent), color-mix(in oklab, var(--primary) 24%, transparent))",
          opacity: 0.26,
          animationDelay: "-9s",
        }}
      />
    </div>
  );
}
