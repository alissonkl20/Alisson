"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useVisibilityChange } from "@/shared/hooks/useVisibilityChange";
import {
  pointOnCubic,
  type DataFlowSceneLayout,
  type FlowPath,
} from "../lib/dataFlowLayout";
import {
  flowParticleFragment,
  flowParticleVertex,
} from "../shaders/flowParticleShader";
import { useDataFlowTheme } from "../context/DataFlowThemeProvider";

const TRAIL_LEN = 5;

interface Particle {
  pathIndex: number;
  t: number;
  speed: number;
  size: number;
  /** Buffer circular — evita trail.shift() O(n) por frame. */
  trailX: Float32Array;
  trailY: Float32Array;
  trailLen: number;
  trailHead: number;
}

interface FlowParticlesProps {
  active: boolean;
  layout: DataFlowSceneLayout;
  reducedMotion: boolean;
}

function hexToVec3(hex: string): THREE.Vector3 {
  const c = hex.replace("#", "");
  const n = parseInt(c, 16);
  return new THREE.Vector3(
    ((n >> 16) & 255) / 255,
    ((n >> 8) & 255) / 255,
    (n & 255) / 255,
  );
}

/* Three.js/R3F: mutação de buffers e câmera fora do ciclo React é intencional. */
/* eslint-disable react-hooks/refs, react-hooks/immutability */
function FlowField({ active, layout, reducedMotion }: FlowParticlesProps) {
  const { width, height, paths } = layout;
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const particlesRef = useRef<Particle[]>([]);
  const pathsRef = useRef<FlowPath[]>(paths);
  const visible = useVisibilityChange();
  const { config, theme } = useDataFlowTheme();
  const { camera } = useThree();

  const pointsPerParticle = TRAIL_LEN + 1;
  const totalPoints = config.particleCount * pointsPerParticle;
  const particleInitKey = `${config.particleCount}:${paths.length}`;
  const particleInitKeyRef = useRef("");

  if (particleInitKeyRef.current !== particleInitKey) {
    particleInitKeyRef.current = particleInitKey;
    const pathCount = Math.max(1, paths.length);
    particlesRef.current = Array.from(
      { length: config.particleCount },
      (_, i) => ({
        pathIndex: i % pathCount,
        t: (i % pathCount) / pathCount,
        speed: 0.14 + (i % 5) * 0.04,
        size: 1.4 + (i % 4) * 0.6,
        trailX: new Float32Array(TRAIL_LEN),
        trailY: new Float32Array(TRAIL_LEN),
        trailLen: 0,
        trailHead: 0,
      }),
    );
  }

  const buffers = useMemo(() => {
    return {
      positions: new Float32Array(totalPoints * 3),
      alphas: new Float32Array(totalPoints),
      sizes: new Float32Array(totalPoints),
    };
  }, [totalPoints]);

  useEffect(() => {
    pathsRef.current = paths;
  }, [paths]);

  useEffect(() => {
    const cam = camera as THREE.OrthographicCamera;
    cam.left = -width / 2;
    cam.right = width / 2;
    cam.top = height / 2;
    cam.bottom = -height / 2;
    cam.position.set(0, 0, 500);
    cam.updateProjectionMatrix();
  }, [camera, width, height]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(buffers.positions, 3));
    geo.setAttribute("aAlpha", new THREE.BufferAttribute(buffers.alphas, 1));
    geo.setAttribute("aSize", new THREE.BufferAttribute(buffers.sizes, 1));
    return geo;
  }, [buffers]);

  useFrame((_, delta) => {
    if (!pointsRef.current || !materialRef.current || !visible || !active) return;

    const pathList = pathsRef.current;
    const particles = particlesRef.current;
    const { positions, alphas, sizes } = buffers;
    const spd = reducedMotion ? 0 : delta * config.speed;

    for (let pi = 0; pi < particles.length; pi++) {
      const p = particles[pi];
      if (!p?.trailX || !p.trailY) continue;
      const path = pathList[p.pathIndex];
      const base = pi * pointsPerParticle;
      if (!path) continue;

      if (spd > 0) {
        const curveBoost = Math.abs(Math.sin(p.t * Math.PI));
        p.t += p.speed * spd * (0.75 + curveBoost * 0.45);
        if (p.t > 1) {
          p.t = 0;
          p.trailLen = 0;
          p.trailHead = 0;
        }
      }

      const head = pointOnCubic(p.t, path);
      const hx = head.x - width / 2;
      const hy = height / 2 - head.y;

      p.trailX[p.trailHead] = hx;
      p.trailY[p.trailHead] = hy;
      p.trailHead = (p.trailHead + 1) % TRAIL_LEN;
      if (p.trailLen < TRAIL_LEN) p.trailLen += 1;

      for (let ti = 0; ti < TRAIL_LEN; ti++) {
        const idx = base + ti;
        if (ti < p.trailLen) {
          const trailIdx =
            (p.trailHead - p.trailLen + ti + TRAIL_LEN) % TRAIL_LEN;
          positions[idx * 3] = p.trailX[trailIdx]!;
          positions[idx * 3 + 1] = p.trailY[trailIdx]!;
          positions[idx * 3 + 2] = 0;
          alphas[idx] = ((ti + 1) / TRAIL_LEN) * 0.5;
          sizes[idx] = p.size * (0.35 + ti * 0.1);
        } else {
          alphas[idx] = 0;
        }
      }

      const headIdx = base + TRAIL_LEN;
      positions[headIdx * 3] = hx;
      positions[headIdx * 3 + 1] = hy;
      positions[headIdx * 3 + 2] = 0;
      alphas[headIdx] = 0.7 + Math.abs(Math.sin(p.t * Math.PI)) * 0.3;
      sizes[headIdx] = p.size * (1.1 + Math.abs(Math.sin(p.t * Math.PI)) * 0.35);
    }

    geometry.attributes.position.needsUpdate = true;
    (geometry.attributes.aAlpha as THREE.BufferAttribute).needsUpdate = true;
    (geometry.attributes.aSize as THREE.BufferAttribute).needsUpdate = true;
    materialRef.current.uniforms.uColor.value = hexToVec3(theme.particle);
  });

  return (
    <points ref={pointsRef} frustumCulled={false} geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={flowParticleVertex}
        fragmentShader={flowParticleFragment}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{ uColor: { value: hexToVec3(theme.particle) } }}
      />
    </points>
  );
}

export function DataFlowParticles(props: FlowParticlesProps) {
  const { width, height } = props.layout;
  if (width <= 0 || height <= 0) return null;

  return (
    <Canvas
      className="data-flow-canvas"
      orthographic
      dpr={[1, 1.5]}
      frameloop={props.active ? "always" : "never"}
      camera={{
        position: [0, 0, 500],
        near: 0.1,
        far: 2000,
      }}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
      }}
    >
      <FlowField {...props} />
    </Canvas>
  );
}
