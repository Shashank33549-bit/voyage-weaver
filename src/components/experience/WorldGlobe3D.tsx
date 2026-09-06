"use client";

import { Line, OrbitControls, PointMaterial, Points } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type Coordinate = [number, number];

const destinations: Coordinate[] = [
  [28.6, 77.2],
  [41, 28.9],
  [35.6, 139.7],
  [48.85, 2.35],
  [-8.4, 115.2],
  [40.7, -74],
  [25.2, 55.3],
  [1.35, 103.8],
];

const routes: [number, number][] = [
  [0, 1],
  [1, 2],
  [0, 6],
  [3, 5],
  [6, 7],
  [7, 4],
];

function coordinateToVector([lat, lon]: Coordinate, radius = 2.42) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon + 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function FlightArc({ from, to, offset }: { from: Coordinate; to: Coordinate; offset: number }) {
  const pulseRef = useRef<THREE.Mesh>(null);
  const curve = useMemo(() => {
    const start = coordinateToVector(from);
    const end = coordinateToVector(to);
    const middle = start.clone().add(end).normalize().multiplyScalar(3.2);
    return new THREE.QuadraticBezierCurve3(start, middle, end);
  }, [from, to]);
  const points = useMemo(() => curve.getPoints(72), [curve]);

  useFrame(({ clock }) => {
    const pulse = pulseRef.current;
    if (!pulse) return;
    pulse.position.copy(curve.getPoint((clock.elapsedTime * 0.075 + offset) % 1));
  });

  return (
    <group>
      <Line points={points} color="#78d9ff" transparent opacity={0.34} lineWidth={0.7} />
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.035, 10, 10]} />
        <meshBasicMaterial color="#ffd59c" toneMapped={false} />
        <pointLight color="#ffbd72" intensity={0.45} distance={0.8} />
      </mesh>
    </group>
  );
}

function Globe({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const pointer = useThree((state) => state.pointer);
  const dots = useMemo(() => {
    const count = 1700;
    const positions = new Float32Array(count * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i += 1) {
      const y = 1 - (i / (count - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = golden * i;
      positions[i * 3] = Math.cos(theta) * radius * 2.46;
      positions[i * 3 + 1] = y * 2.46;
      positions[i * 3 + 2] = Math.sin(theta) * radius * 2.46;
    }
    return positions;
  }, []);

  useFrame((_, rawDelta) => {
    const globe = group.current;
    if (!globe || reduced) return;
    const delta = Math.min(rawDelta, 0.05);
    globe.rotation.y += delta * 0.025;
    globe.rotation.y = THREE.MathUtils.damp(globe.rotation.y, pointer.x * 0.16, 2.2, delta);
    globe.rotation.x = THREE.MathUtils.damp(globe.rotation.x, -0.18 + pointer.y * 0.08, 2.2, delta);
  });

  return (
    <group ref={group} rotation={[-0.18, -0.2, -0.08]}>
      <mesh>
        <sphereGeometry args={[2.42, 64, 64]} />
        <meshPhysicalMaterial
          color="#071226"
          roughness={0.35}
          metalness={0.34}
          clearcoat={0.7}
          transparent
          opacity={0.94}
        />
      </mesh>
      <mesh scale={1.018}>
        <sphereGeometry args={[2.42, 28, 28]} />
        <meshBasicMaterial color="#438bcb" wireframe transparent opacity={0.075} />
      </mesh>
      <mesh scale={1.065}>
        <sphereGeometry args={[2.42, 64, 64]} />
        <meshBasicMaterial color="#67d8ff" side={THREE.BackSide} transparent opacity={0.045} />
      </mesh>
      <Points positions={dots} stride={3}>
        <PointMaterial transparent color="#a5e8ff" size={0.012} opacity={0.5} depthWrite={false} />
      </Points>
      {routes.map(([from, to], index) => (
        <FlightArc
          key={`${from}-${to}`}
          from={destinations[from]}
          to={destinations[to]}
          offset={index / routes.length}
        />
      ))}
      {destinations.map((coordinate, index) => (
        <mesh key={index} position={coordinateToVector(coordinate, 2.47)}>
          <sphereGeometry args={[0.038, 10, 10]} />
          <meshBasicMaterial color={index === 0 ? "#ffbd72" : "#8be7ff"} toneMapped={false} />
        </mesh>
      ))}
      <mesh rotation={[0.42, 0.1, 0.22]}>
        <torusGeometry args={[3.02, 0.006, 6, 180]} />
        <meshBasicMaterial color="#78d9ff" transparent opacity={0.18} />
      </mesh>
      <mesh rotation={[-0.62, 0.38, -0.12]}>
        <torusGeometry args={[3.25, 0.005, 6, 180]} />
        <meshBasicMaterial color="#ffbd72" transparent opacity={0.1} />
      </mesh>
    </group>
  );
}

function Stars() {
  const positions = useMemo(() => {
    const count = 420;
    const values = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const seed = i * 12.9898;
      const angle = (seed * 0.618) % (Math.PI * 2);
      const radius = 6 + ((i * 47) % 100) / 18;
      values[i * 3] = Math.cos(angle) * radius;
      values[i * 3 + 1] = (((i * 83) % 200) / 100 - 1) * 5;
      values[i * 3 + 2] = -2 - ((i * 31) % 100) / 12;
    }
    return values;
  }, []);
  return (
    <Points positions={positions} stride={3}>
      <PointMaterial transparent color="#a8cbec" size={0.018} opacity={0.32} depthWrite={false} />
    </Points>
  );
}

export default function WorldGlobe3D({ reduced = false }: { reduced?: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.25, 7.8], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={reduced ? "demand" : "always"}
    >
      <ambientLight intensity={0.55} color="#a7cfff" />
      <directionalLight position={[4, 3, 6]} intensity={2.5} color="#d9f4ff" />
      <pointLight position={[-4, -1, 3]} intensity={18} color="#276cff" distance={12} />
      <pointLight position={[3, -2, 2]} intensity={9} color="#ff9e5e" distance={9} />
      <Stars />
      <Globe reduced={reduced} />
      <OrbitControls enabled={false} />
    </Canvas>
  );
}