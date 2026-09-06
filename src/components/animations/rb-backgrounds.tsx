"use client";

/**
 * Page background systems, powered by the official React Bits WebGL
 * backgrounds. Each page picks ONE of these as its primary environment;
 * everything else stays on the cheap CSS layers in `backgrounds.tsx`.
 *
 * All of them are dynamically imported and gated by the device effect
 * budget, so phones / reduced-motion users get a static gradient instead of
 * a live canvas.
 */

import {
  WebGLLayer,
  RBAurora,
  RBParticles,
  RBLightRays,
  RBThreads,
  RBDarkVeil,
  RBIridescence,
} from "@/components/reactbits/rb-client";
import RBGradualBlur from "@/components/reactbits/GradualBlur";
import { Aurora as CssAurora } from "@/components/animations/backgrounds";
import { usePrefersReducedMotion } from "@/hooks/use-device";
import { cn } from "@/lib/utils";


/** Brand palette resolved to literal colors — WebGL cannot read CSS vars. */
export const RB_COLORS = {
  deep: "#1b3ea8",
  primary: "#3d7bf5",
  cyan: "#63dbe8",
  sunset: "#f0994d",
  ink: "#0a0f1c",
};

/** Static fallback used whenever a canvas is not allowed. */
function StaticWash({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(120% 80% at 50% -10%, color-mix(in oklab, var(--primary) 26%, transparent), transparent 65%)",
        }}
      />
    </div>
  );
}

/** React Bits Aurora — the signature homepage sky behind the globe. */
export function AuroraField({
  className,
  amplitude = 0.9,
  blend = 0.55,
  speed = 0.55,
}: {
  className?: string;
  amplitude?: number;
  blend?: number;
  speed?: number;
}) {
  return (
    <WebGLLayer
      className={cn("opacity-70", className)}
      fallback={<CssAurora className={className} intensity={0.45} />}
    >
      <RBAurora
        colorStops={[RB_COLORS.deep, RB_COLORS.cyan, RB_COLORS.primary]}
        amplitude={amplitude}
        blend={blend}
        speed={speed}
      />
    </WebGLLayer>
  );
}

/** React Bits Particles — drifting spatial dust, used with the globe. */
export function ParticleField({
  className,
  count = 180,
  speed = 0.06,
}: {
  className?: string;
  count?: number;
  speed?: number;
}) {
  return (
    <WebGLLayer className={className} requireDesktop fallback={null}>
      <RBParticles
        particleCount={count}
        particleSpread={11}
        speed={speed}
        particleColors={[RB_COLORS.cyan, RB_COLORS.primary, "#ffffff"]}
        moveParticlesOnHover
        particleHoverFactor={0.6}
        alphaParticles
        particleBaseSize={62}
        sizeRandomness={0.8}
        cameraDistance={19}
        disableRotation={false}
      />
    </WebGLLayer>
  );
}

/** React Bits LightRays — volumetric shafts for narrative sections. */
export function RayField({
  className,
  origin = "top-center",
  color = RB_COLORS.cyan,
}: {
  className?: string;
  origin?: "top-center" | "top-left" | "top-right" | "left" | "right";
  color?: string;
}) {
  return (
    <WebGLLayer
      className={cn("opacity-60", className)}
      fallback={<StaticWash className={className} />}
    >
      <RBLightRays
        raysOrigin={origin}
        raysColor={color}
        raysSpeed={0.8}
        lightSpread={0.9}
        rayLength={1.4}
        fadeDistance={1.1}
        saturation={0.9}
        followMouse
        mouseInfluence={0.08}
        noiseAmount={0.06}
        distortion={0.04}
      />
    </WebGLLayer>
  );
}

/** React Bits Threads — fine reactive filaments for data-heavy pages. */
export function ThreadField({ className }: { className?: string }) {
  return (
    <WebGLLayer
      className={cn("opacity-45", className)}
      requireDesktop
      fallback={<StaticWash className={className} />}
    >
      <RBThreads color={[0.32, 0.72, 0.9]} amplitude={0.9} distance={0.18} enableMouseInteraction />
    </WebGLLayer>
  );
}

/** React Bits DarkVeil — deep warped field for immersive discovery. */
export function VeilField({ className }: { className?: string }) {
  return (
    <WebGLLayer
      className={cn("opacity-55", className)}
      fallback={<StaticWash className={className} />}
    >
      <RBDarkVeil
        hueShift={205}
        noiseIntensity={0.02}
        scanlineIntensity={0.05}
        speed={0.4}
        scanlineFrequency={1.6}
        warpAmount={0.6}
        resolutionScale={0.75}
      />
    </WebGLLayer>
  );
}

/** React Bits Iridescence — closing-moment sheen. */
export function IridescentField({ className }: { className?: string }) {
  return (
    <WebGLLayer
      className={cn("opacity-30", className)}
      requireDesktop
      fallback={<StaticWash className={className} />}
    >
      <RBIridescence color={[0.28, 0.52, 0.95]} speed={0.6} amplitude={0.08} mouseReact={false} />
    </WebGLLayer>
  );
}

/**
 * React Bits GradualBlur — softens a section edge so scenes dissolve into one
 * another instead of ending on a hard line. Cheap (CSS backdrop-filter), so it
 * only opts out for reduced motion where the extra depth is unnecessary.
 */
export function EdgeBlur({
  position = "bottom",
  height = "6rem",
  strength = 2,
  className,
}: {
  position?: "top" | "bottom" | "left" | "right";
  height?: string;
  strength?: number;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  if (reduced) return null;

  return (
    <RBGradualBlur
      target="parent"
      position={position}
      height={height}
      strength={strength}
      divCount={6}
      curve="bezier"
      exponential
      opacity={0.9}
      className={cn("pointer-events-none", className)}
    />
  );
}
