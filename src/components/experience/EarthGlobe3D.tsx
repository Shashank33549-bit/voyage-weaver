"use client";

import { Html, Line, OrbitControls, Stars, useTexture } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import {
  GLOBE_DESTINATIONS,
  GLOBE_ORIGIN,
  type GlobeDestination,
} from "./globe-data";

const R = 2;

function toVector(lat: number, lon: number, radius = R) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon + 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

/** Soft blue rim of atmosphere around the planet. */
function Atmosphere() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: { uColor: { value: new THREE.Color("#5fc9ff") } },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vView;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vView = -mv.xyz;
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: `
          uniform vec3 uColor;
          varying vec3 vNormal;
          varying vec3 vView;
          void main() {
            float rim = 1.0 - abs(dot(normalize(vNormal), normalize(vView)));
            float glow = pow(clamp(rim, 0.0, 1.0), 5.0) * 0.85;
            gl_FragColor = vec4(uColor * glow, glow);
          }
        `,
      }),
    [],
  );

  return (
    <mesh material={material} scale={1.05}>
      <sphereGeometry args={[R, 48, 48]} />
    </mesh>
  );
}

/** Photographic Earth: NASA colour map with terrain relief and drifting clouds. */
function Earth({ reduced }: { reduced: boolean }) {
  const [day, normal, specular, clouds] = useTexture([
    "/textures/earth_atmos_2048.jpg",
    "/textures/earth_normal_2048.jpg",
    "/textures/earth_specular_2048.jpg",
    "/textures/earth_clouds_1024.png",
  ]);
  day.colorSpace = THREE.SRGBColorSpace;
  clouds.colorSpace = THREE.SRGBColorSpace;

  const cloudRef = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (!reduced && cloudRef.current) cloudRef.current.rotation.y += delta * 0.012;
  });

  return (
    <group>
      <mesh>
        <sphereGeometry args={[R, 96, 96]} />
        <meshPhongMaterial
          map={day}
          normalMap={normal}
          normalScale={new THREE.Vector2(0.7, 0.7)}
          specularMap={specular}
          specular={new THREE.Color("#3a5470")}
          shininess={16}
        />
      </mesh>
      <mesh ref={cloudRef} scale={1.012}>
        <sphereGeometry args={[R, 64, 64]} />
        <meshPhongMaterial
          map={clouds}
          transparent
          opacity={0.38}
          depthWrite={false}
        />
      </mesh>
      <Atmosphere />
    </group>
  );
}

function Marker({
  destination,
  active,
  onSelect,
  onHover,
}: {
  destination: GlobeDestination;
  active: boolean;
  onSelect: (d: GlobeDestination) => void;
  onHover: (code: string | null) => void;
}) {
  const [hover, setHover] = useState(false);
  const ringRef = useRef<THREE.Mesh>(null);
  const position = useMemo(
    () => toVector(destination.lat, destination.lon, R * 1.005),
    [destination],
  );
  const quaternion = useMemo(
    () =>
      new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        position.clone().normalize(),
      ),
    [position],
  );

  useFrame(({ clock }) => {
    if (!ringRef.current) return;
    const pulse = active ? 1 + Math.sin(clock.elapsedTime * 2.4) * 0.22 : 1;
    ringRef.current.scale.setScalar(pulse);
  });

  const highlight = active || hover;

  return (
    <group position={position} quaternion={quaternion}>
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          setHover(true);
          onHover(destination.code);
        }}
        onPointerOut={() => {
          setHover(false);
          onHover(null);
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(destination);
        }}
      >
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshBasicMaterial
          color={active ? "#ffc98a" : highlight ? "#bff0ff" : "#63dbe8"}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={ringRef} position={[0, 0, 0.005]}>
        <ringGeometry args={[0.075, 0.095, 32]} />
        <meshBasicMaterial
          color={active ? "#ffb26b" : "#63dbe8"}
          transparent
          opacity={highlight ? 0.9 : 0.35}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
      {highlight && (
        <Html center distanceFactor={7} position={[0, 0, 0.18]} zIndexRange={[10, 0]}>
          <span className="pointer-events-none rounded-full border border-cyan/30 bg-ink/80 px-2 py-1 text-[0.6rem] font-semibold whitespace-nowrap text-foreground">
            {destination.country}
          </span>
        </Html>
      )}
    </group>
  );
}

/** Great-circle flight arc from the home airport to the chosen destination. */
function RouteArc({ destination, reduced }: { destination: GlobeDestination; reduced: boolean }) {
  const pulse = useRef<THREE.Mesh>(null);
  const curve = useMemo(() => {
    const start = toVector(GLOBE_ORIGIN.lat, GLOBE_ORIGIN.lon, R * 1.01);
    const end = toVector(destination.lat, destination.lon, R * 1.01);
    const mid = start
      .clone()
      .add(end)
      .normalize()
      .multiplyScalar(R * (1.18 + start.angleTo(end) * 0.12));
    return new THREE.QuadraticBezierCurve3(start, mid, end);
  }, [destination]);
  const points = useMemo(() => curve.getPoints(96), [curve]);

  useFrame(({ clock }) => {
    if (reduced || !pulse.current) return;
    pulse.current.position.copy(curve.getPoint((clock.elapsedTime * 0.16) % 1));
  });

  return (
    <group>
      <Line points={points} color="#ffc08a" lineWidth={1.2} transparent opacity={0.85} />
      <mesh ref={pulse}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshBasicMaterial color="#fff1d6" toneMapped={false} />
      </mesh>
    </group>
  );
}

/** Swings the globe around so the chosen country faces the viewer. */
function FlyToSelection({
  target,
  controls,
  reduced,
}: {
  target: THREE.Vector3 | null;
  controls: React.RefObject<OrbitControlsImpl | null>;
  reduced: boolean;
}) {
  const last = useRef<THREE.Vector3 | null>(null);
  const settle = useRef(0);

  useFrame((_, delta) => {
    const c = controls.current;
    if (!c) return;
    if (target && target !== last.current) {
      last.current = target;
      settle.current = 2.6;
    }
    if (!target || settle.current <= 0) return;
    settle.current -= delta;
    // Hold the idle spin while the globe swings to the selection.
    c.autoRotate = false;
    if (settle.current <= 0) c.autoRotate = !reduced;

    const wantAzimuth = Math.atan2(target.x, target.z);
    const wantPolar = THREE.MathUtils.clamp(
      Math.acos(THREE.MathUtils.clamp(target.y / target.length(), -1, 1)) - 0.12,
      Math.PI * 0.2,
      Math.PI * 0.8,
    );
    const k = 1 - Math.exp(-2.6 * delta);
    let deltaAz = wantAzimuth - c.getAzimuthalAngle();
    deltaAz = Math.atan2(Math.sin(deltaAz), Math.cos(deltaAz));
    c.setAzimuthalAngle(c.getAzimuthalAngle() + deltaAz * k);
    c.setPolarAngle(c.getPolarAngle() + (wantPolar - c.getPolarAngle()) * k);
  });

  return null;
}

export default function EarthGlobe3D({
  value,
  reduced,
  onSelect,
  onHover,
}: {
  value: string | null;
  reduced: boolean;
  onSelect: (d: GlobeDestination) => void;
  onHover: (code: string | null) => void;
}) {
  const active = GLOBE_DESTINATIONS.find((d) => d.code === value) ?? null;
  const controls = useRef<OrbitControlsImpl>(null);
  const focus = useMemo(
    () => (active ? toVector(active.lat, active.lon) : null),
    [active],
  );

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 1.4, 5.6], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.55} />
      <hemisphereLight args={["#8fd6ff", "#0a0f1c", 0.35]} />
      <directionalLight position={[5, 3, 5]} intensity={2.1} color="#fff6e8" />
      <Stars radius={60} depth={30} count={900} factor={3} fade speed={reduced ? 0 : 0.4} />

      <Earth reduced={reduced} />

      {/* Home airport */}
      <mesh position={toVector(GLOBE_ORIGIN.lat, GLOBE_ORIGIN.lon, R * 1.005)}>
        <sphereGeometry args={[0.05, 14, 14]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>

      {GLOBE_DESTINATIONS.map((d) => (
        <Marker
          key={d.code}
          destination={d}
          active={d.code === value}
          onSelect={onSelect}
          onHover={onHover}
        />
      ))}

      <FlyToSelection target={focus} controls={controls} reduced={reduced} />

      {active && <RouteArc destination={active} reduced={reduced} />}

      <OrbitControls
        ref={controls}
        enablePan={false}
        enableZoom={false}
        autoRotate={!reduced}
        autoRotateSpeed={0.35}
        rotateSpeed={0.5}
        minPolarAngle={Math.PI * 0.18}
        maxPolarAngle={Math.PI * 0.82}
      />
    </Canvas>
  );
}
