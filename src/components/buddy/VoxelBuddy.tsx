"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { buildBuddyVoxels, loadImageData, type BuddyVoxels, type VoxelSet } from "@/lib/voxels";

/** Where the pointer is, from -1 to 1 on each axis, and when it last moved. */
type Pointer = { x: number; y: number; at: number };

/** Screen points (in CSS pixels) just beside Buddy's head, left and right, for speech bubbles. */
export type HeadAnchors = { left: { x: number; y: number }; right: { x: number; y: number } };

function Voxels({ set }: { set: VoxelSet }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    set.matrices.forEach((m, i) => {
      mesh.setMatrixAt(i, m);
      mesh.setColorAt(i, set.colors[i]);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [set]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, set.matrices.length]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshLambertMaterial />
    </instancedMesh>
  );
}

function Buddy({
  voxels,
  pointer,
  onHeadMove,
}: {
  voxels: BuddyVoxels;
  pointer: React.RefObject<Pointer>;
  onHeadMove?: (a: HeadAnchors) => void;
}) {
  const body = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const headInner = useRef<THREE.Group>(null);
  // the head's left and right edges, about level with the eyes
  const edges = useMemo(() => {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const m of voxels.head.matrices) {
      const x = m.elements[12], y = m.elements[13];
      minX = Math.min(minX, x); maxX = Math.max(maxX, x);
      minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    }
    const y = minY + (maxY - minY) * 0.7;
    return { left: new THREE.Vector3(minX - 4, y, 0), right: new THREE.Vector3(maxX + 4, y, 0) };
  }, [voxels]);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const state = useRef({ yaw: 0, pitch: 0, turn: 0 });
  const reduce = useRef(false);
  useEffect(() => {
    reduce.current = matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useFrame(({ clock, camera, size }) => {
    const t = clock.getElapsedTime();
    const p = pointer.current;
    const idle = performance.now() - p.at > 3500;
    // when the mouse is still, Buddy looks around on his own
    const gx = idle ? Math.sin(t * 0.6) * 0.55 : p.x;
    const gy = idle ? Math.sin(t * 0.9) * 0.15 - 0.05 : p.y;
    const k = reduce.current ? 1 : 0.09;
    const s = state.current;
    s.yaw += (gx * 0.95 - s.yaw) * k;
    s.pitch += (gy * 0.5 - s.pitch) * k;
    s.turn += (gx * 0.22 - s.turn) * k * 0.6;
    if (head.current) head.current.rotation.set(s.pitch, s.yaw, -s.yaw * 0.08);
    if (body.current) {
      body.current.rotation.y = s.turn;
      body.current.position.y = Math.sin(t * 2) * 1.2;
    }
    const inner = headInner.current;
    if (onHeadMove && inner) {
      inner.updateWorldMatrix(true, false);
      const toScreen = (v: THREE.Vector3) => {
        tmp.copy(v).applyMatrix4(inner.matrixWorld).project(camera);
        return { x: ((tmp.x + 1) / 2) * size.width, y: ((1 - tmp.y) / 2) * size.height };
      };
      onHeadMove({ left: toScreen(edges.left), right: toScreen(edges.right) });
    }
  });

  return (
    <group ref={body}>
      <Voxels set={voxels.body} />
      <group ref={head} position={[0, voxels.pivotY, 0]}>
        <group ref={headInner} position={[0, -voxels.pivotY, 0]}>
          <Voxels set={voxels.head} />
        </group>
      </group>
    </group>
  );
}

/** Pulls the camera back on tall (phone) screens so Buddy always fits. */
function Framing() {
  const { camera, size } = useThree();
  useEffect(() => {
    const tall = size.height > size.width;
    camera.position.set(0, 110, tall ? 700 : 600);
    camera.lookAt(0, tall ? 78 : 84, 0);
  }, [camera, size]);
  return null;
}

export default function VoxelBuddy({
  src = "/buddy/stand.png",
  onHeadMove,
}: {
  src?: string;
  onHeadMove?: (a: HeadAnchors) => void;
}) {
  const [voxels, setVoxels] = useState<BuddyVoxels | null>(null);
  const pointer = useRef<Pointer>({ x: 0, y: 0, at: 0 });

  useEffect(() => {
    let live = true;
    loadImageData(src).then((d) => live && setVoxels(buildBuddyVoxels(d)));
    return () => {
      live = false;
    };
  }, [src]);

  useEffect(() => {
    const aim = (x: number, y: number) => {
      pointer.current = { x: (x / innerWidth) * 2 - 1, y: (y / innerHeight) * 2 - 1, at: performance.now() };
    };
    const move = (e: PointerEvent) => aim(e.clientX, e.clientY);
    const touch = (e: TouchEvent) => e.touches[0] && aim(e.touches[0].clientX, e.touches[0].clientY);
    addEventListener("pointermove", move);
    addEventListener("touchmove", touch, { passive: true });
    return () => {
      removeEventListener("pointermove", move);
      removeEventListener("touchmove", touch);
    };
  }, []);

  return (
    <Canvas
      flat
      dpr={[1, 2]}
      camera={{ fov: 30, near: 1, far: 2000, position: [0, 110, 600] }}
      aria-label="Buddy, a 3D pixel character that follows your cursor"
    >
      <Framing />
      <hemisphereLight args={[0xffffff, 0x3a342c, Math.PI]} />
      <directionalLight color={0xffffff} intensity={0.55 * Math.PI} position={[-120, 160, 220]} />
      <directionalLight color={0xffc21a} intensity={0.4 * Math.PI} position={[160, 60, -200]} />
      <mesh rotation-x={-Math.PI / 2}>
        <circleGeometry args={[70, 48]} />
        <meshBasicMaterial color={0xffc21a} transparent opacity={0.1} />
      </mesh>
      {voxels && <Buddy voxels={voxels} pointer={pointer} onHeadMove={onHeadMove} />}
    </Canvas>
  );
}
