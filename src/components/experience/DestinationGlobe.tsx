"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useEffectBudget } from "@/hooks/use-device";

export interface GlobeDestination {
  code: string;
  country: string;
  city: string;
  airport: string;
  lat: number;
  lon: number;
}

/** Selectable destination countries plotted on the globe. */
export const GLOBE_DESTINATIONS: GlobeDestination[] = [
  { code: "JP", country: "Japan", city: "Tokyo", airport: "HND", lat: 35.6, lon: 139.7 },
  { code: "TR", country: "Türkiye", city: "Istanbul", airport: "IST", lat: 41.0, lon: 28.9 },
  { code: "AE", country: "UAE", city: "Dubai", airport: "DXB", lat: 25.2, lon: 55.3 },
  { code: "SG", country: "Singapore", city: "Singapore", airport: "SIN", lat: 1.35, lon: 103.8 },
  { code: "ID", country: "Indonesia", city: "Bali", airport: "DPS", lat: -8.4, lon: 115.2 },
  { code: "FR", country: "France", city: "Paris", airport: "CDG", lat: 48.85, lon: 2.35 },
  { code: "IT", country: "Italy", city: "Rome", airport: "FCO", lat: 41.9, lon: 12.5 },
  { code: "IS", country: "Iceland", city: "Reykjavík", airport: "KEF", lat: 64.1, lon: -21.9 },
  { code: "US", country: "United States", city: "New York", airport: "JFK", lat: 40.7, lon: -74.0 },
  { code: "PE", country: "Peru", city: "Cusco", airport: "CUZ", lat: -13.5, lon: -71.9 },
  { code: "ZA", country: "South Africa", city: "Cape Town", airport: "CPT", lat: -33.9, lon: 18.4 },
  { code: "AU", country: "Australia", city: "Sydney", airport: "SYD", lat: -33.9, lon: 151.2 },
  { code: "TH", country: "Thailand", city: "Bangkok", airport: "BKK", lat: 13.8, lon: 100.5 },
  { code: "NP", country: "Nepal", city: "Kathmandu", airport: "KTM", lat: 27.7, lon: 85.3 },
];

const ORIGIN = { lat: 28.6, lon: 77.2 };

type V3 = { x: number; y: number; z: number };

function toVec(lat: number, lon: number): V3 {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return {
    x: -Math.sin(phi) * Math.cos(theta),
    y: Math.cos(phi),
    z: Math.sin(phi) * Math.sin(theta),
  };
}

function rotate(v: V3, yaw: number, pitch: number): V3 {
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const x1 = v.x * cy - v.z * sy;
  const z1 = v.x * sy + v.z * cy;
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  return { x: x1, y: v.y * cp - z1 * sp, z: v.y * sp + z1 * cp };
}

function slerp(a: V3, b: V3, t: number, lift: number): V3 {
  const dot = Math.max(-1, Math.min(1, a.x * b.x + a.y * b.y + a.z * b.z));
  const omega = Math.acos(dot);
  const sin = Math.sin(omega) || 1e-6;
  const w1 = Math.sin((1 - t) * omega) / sin;
  const w2 = Math.sin(t * omega) / sin;
  const arc = 1 + Math.sin(Math.PI * t) * lift;
  return {
    x: (a.x * w1 + b.x * w2) * arc,
    y: (a.y * w1 + b.y * w2) * arc,
    z: (a.z * w1 + b.z * w2) * arc,
  };
}

/**
 * Interactive destination globe: a slowly rotating point-cloud planet with
 * clickable country markers. Drag to spin it, click a marker to choose the
 * destination. A keyboard-accessible country list mirrors every marker.
 */
export function DestinationGlobe({
  value,
  onSelect,
  className,
}: {
  value: string | null;
  onSelect: (destination: GlobeDestination) => void;
  className?: string;
}) {
  const { tier, reduced, desktop } = useEffectBudget();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  // Refs so the animation loop reads the latest state without restarting.
  const valueRef = useRef(value);
  const hoveredRef = useRef(hovered);
  const selectRef = useRef(onSelect);
  valueRef.current = value;
  hoveredRef.current = hovered;
  selectRef.current = onSelect;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dotCount = tier === "heavy" ? 1300 : desktop ? 820 : 480;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

    const cloud: V3[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < dotCount; i++) {
      const y = 1 - (i / (dotCount - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * i;
      cloud.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r });
    }

    const originVec = toVec(ORIGIN.lat, ORIGIN.lon);
    const destVecs = GLOBE_DESTINATIONS.map((d) => toVec(d.lat, d.lon));

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

    // interaction state
    let yaw = -1.1;
    let pitch = -0.28;
    let spin = reduced ? 0 : 0.0016;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let t = 0;
    // screen positions of markers, refreshed each frame for hit-testing
    const screen: { x: number; y: number; z: number; i: number }[] = [];

    const hitTest = (mx: number, my: number) => {
      let best: { i: number; d: number } | null = null;
      for (const s of screen) {
        if (s.z <= 0.02) continue;
        const d = Math.hypot(s.x - mx, s.y - my);
        if (d < 22 && (!best || d < best.d)) best = { i: s.i, d };
      }
      return best ? GLOBE_DESTINATIONS[best.i] : null;
    };

    const localPos = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    };

    let moved = 0;
    const onMove = (e: PointerEvent) => {
      const { x, y } = localPos(e);
      if (dragging) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        moved += Math.abs(dx) + Math.abs(dy);
        yaw += dx * 0.006;
        pitch = Math.max(-0.9, Math.min(0.9, pitch + dy * 0.004));
        lastX = e.clientX;
        lastY = e.clientY;
        spin = reduced ? 0 : 0.0016;
      }
      const hit = hitTest(x, y);
      canvas.style.cursor = hit ? "pointer" : dragging ? "grabbing" : "grab";
      setHovered(hit ? hit.code : null);
    };

    const onUp = (e: PointerEvent) => {
      const wasDrag = moved > 6;
      dragging = false;
      moved = 0;
      canvas.style.cursor = "grab";
      if (wasDrag) return;
      const { x, y } = localPos(e);
      const hit = hitTest(x, y);
      if (hit) selectRef.current(hit);
    };

    const onLeave = () => {
      dragging = false;
      setHovered(null);
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointerleave", onLeave);

    let raf = 0;
    const draw = () => {
      const R = Math.min(w, h) * 0.42;
      const cx = w / 2;
      const cy = h / 2;
      if (!dragging) yaw += spin;

      ctx.clearRect(0, 0, w, h);

      const atmo = ctx.createRadialGradient(cx, cy, R * 0.6, cx, cy, R * 1.6);
      atmo.addColorStop(0, "rgba(70, 130, 255, 0.22)");
      atmo.addColorStop(0.55, "rgba(60, 190, 255, 0.09)");
      atmo.addColorStop(1, "rgba(10, 20, 50, 0)");
      ctx.fillStyle = atmo;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.6, 0, Math.PI * 2);
      ctx.fill();

      const core = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.35, R * 0.1, cx, cy, R);
      core.addColorStop(0, "rgba(32, 56, 112, 0.9)");
      core.addColorStop(1, "rgba(8, 13, 32, 0.96)");
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalCompositeOperation = "lighter";

      for (const p of cloud) {
        const v = rotate(p, yaw, pitch);
        if (v.z < -0.05) continue;
        const depth = (v.z + 1) / 2;
        const scale = 1 / (1.9 - v.z * 0.55);
        const x = cx + v.x * R * scale;
        const y = cy + v.y * R * scale;
        ctx.fillStyle = `rgba(${140 + depth * 60}, ${205 + depth * 40}, 255, ${0.1 + depth * 0.45})`;
        ctx.beginPath();
        ctx.arc(x, y, 0.5 + depth * 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // route arc from origin to the chosen destination
      const activeIdx = GLOBE_DESTINATIONS.findIndex((d) => d.code === valueRef.current);
      if (activeIdx >= 0) {
        const target = destVecs[activeIdx];
        ctx.beginPath();
        let started = false;
        for (let s = 0; s <= 48; s++) {
          const v = rotate(slerp(originVec, target, s / 48, 0.26), yaw, pitch);
          if (v.z < -0.15) {
            started = false;
            continue;
          }
          const x = cx + v.x * R;
          const y = cy + v.y * R;
          if (!started) {
            ctx.moveTo(x, y);
            started = true;
          } else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = "rgba(255, 190, 130, 0.6)";
        ctx.lineWidth = 1.4;
        ctx.stroke();

        const prog = ((t * 0.005) % 1 + 1) % 1;
        const pv = rotate(slerp(originVec, target, prog, 0.26), yaw, pitch);
        if (pv.z > -0.1) {
          const px = cx + pv.x * R;
          const py = cy + pv.y * R;
          const g = ctx.createRadialGradient(px, py, 0, px, py, 15);
          g.addColorStop(0, "rgba(255, 245, 220, 0.95)");
          g.addColorStop(0.35, "rgba(255, 190, 120, 0.5)");
          g.addColorStop(1, "rgba(255, 160, 90, 0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(px, py, 15, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalCompositeOperation = "source-over";

      // origin marker
      const ov = rotate(originVec, yaw, pitch);
      if (ov.z > 0) {
        const x = cx + ov.x * R;
        const y = cy + ov.y * R;
        ctx.fillStyle = "rgba(255, 205, 150, 0.95)";
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
        if (w > 420) {
          ctx.font = "600 10px ui-sans-serif, system-ui";
          ctx.fillStyle = "rgba(255, 220, 180, 0.8)";
          ctx.fillText("You are here", x + 8, y - 6);
        }
      }

      // destination markers
      screen.length = 0;
      destVecs.forEach((dv, i) => {
        const v = rotate(dv, yaw, pitch);
        const x = cx + v.x * R;
        const y = cy + v.y * R;
        screen.push({ x, y, z: v.z, i });
        if (v.z <= 0) return;

        const dest = GLOBE_DESTINATIONS[i];
        const isActive = dest.code === valueRef.current;
        const isHover = dest.code === hoveredRef.current;
        const fade = Math.min(1, v.z * 3);

        if (isActive || isHover) {
          const halo = 9 + Math.sin(t * 0.06 + i) * 2.5;
          ctx.strokeStyle = isActive
            ? `rgba(255, 190, 130, ${0.75 * fade})`
            : `rgba(150, 230, 255, ${0.6 * fade})`;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.arc(x, y, halo, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.fillStyle = isActive
          ? `rgba(255, 200, 140, ${0.95 * fade})`
          : `rgba(160, 240, 255, ${(isHover ? 0.95 : 0.6) * fade})`;
        ctx.beginPath();
        ctx.arc(x, y, isActive ? 4 : 2.6, 0, Math.PI * 2);
        ctx.fill();

        if ((isActive || isHover || v.z > 0.55) && w > 380) {
          ctx.font = `${isActive || isHover ? "700" : "500"} 10px ui-sans-serif, system-ui`;
          ctx.fillStyle = isActive
            ? `rgba(255, 226, 195, ${fade})`
            : `rgba(215, 240, 255, ${(isHover ? 0.95 : 0.6) * fade})`;
          ctx.fillText(dest.country, x + 9, y - 7);
        }
      });

      if (!reduced) t += 1;
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [tier, reduced, desktop]);

  const active = GLOBE_DESTINATIONS.find((d) => d.code === value) ?? null;

  return (
    <div className={cn("grid gap-4 sm:grid-cols-[1.1fr_1fr] sm:gap-5", className)}>
      <div className="relative overflow-hidden rounded-3xl border border-border bg-surface/40">
        <canvas
          ref={canvasRef}
          className="h-[280px] w-full touch-none select-none sm:h-[360px]"
          style={{ cursor: "grab" }}
          role="img"
          aria-label="Rotating globe of destination countries. Use the country list beside it to choose a destination."
        />
        <p className="pointer-events-none absolute inset-x-4 bottom-3 text-center text-[0.65rem] tracking-[0.14em] text-muted-foreground uppercase">
          Drag to spin · tap a country to choose
        </p>
        {active && (
          <div className="glass pointer-events-none absolute top-3 left-3 rounded-2xl px-3 py-2">
            <p className="text-[0.6rem] tracking-[0.16em] text-muted-foreground uppercase">
              Destination
            </p>
            <p className="font-display text-sm font-semibold">
              {active.country}
              <span className="text-muted-foreground"> · {active.city}</span>
            </p>
          </div>
        )}
      </div>

      <div>
        <p className="text-[0.65rem] tracking-[0.16em] text-muted-foreground uppercase">
          Or pick a country
        </p>
        <ul
          className="mt-3 grid max-h-[320px] grid-cols-2 gap-2 overflow-y-auto pr-1"
          aria-label="Destination countries"
        >
          {GLOBE_DESTINATIONS.map((d) => (
            <li key={d.code}>
              <button
                type="button"
                onClick={() => onSelect(d)}
                onMouseEnter={() => setHovered(d.code)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(d.code)}
                onBlur={() => setHovered(null)}
                aria-pressed={value === d.code}
                className={cn(
                  "w-full rounded-2xl border px-3 py-2 text-left transition-all duration-300",
                  value === d.code
                    ? "border-sunset/50 bg-sunset/12"
                    : "border-border bg-surface/50 hover:border-cyan/35 hover:bg-surface-2/60",
                )}
              >
                <span className="block text-xs font-semibold">{d.country}</span>
                <span className="block text-[0.65rem] text-muted-foreground">
                  {d.city} · {d.airport}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
