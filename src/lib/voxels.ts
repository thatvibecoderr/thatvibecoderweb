import * as THREE from "three";

/** One instanced mesh worth of cubes. */
export type VoxelSet = { matrices: THREE.Matrix4[]; colors: THREE.Color[] };

export type BuddyVoxels = {
  head: VoxelSet;
  body: VoxelSet;
  /** Height of the neck pivot above the feet, in world units. */
  pivotY: number;
};

type RGB = [number, number, number];

export async function loadImageData(src: string): Promise<ImageData> {
  const img = new Image();
  img.src = src;
  await img.decode();
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, img.width, img.height);
}

const lum = (c: RGB) => 0.3 * c[0] + 0.59 * c[1] + 0.11 * c[2];
const noise = (i: number) => {
  const v = Math.sin(i * 12.9898) * 43758.5453;
  return v - Math.floor(v);
};

/**
 * Turns the pixel sprite into cubes. Each opaque pixel becomes a front half
 * (the sprite's colour) and a back half (hair on the head, jacket on the
 * torso), so Buddy looks right from behind. Pixels far from the outline are
 * deeper, which rounds the figure out.
 *
 * Row numbers are in sprite pixels: rows above `neckRow` belong to the head.
 */
export function buildBuddyVoxels(data: ImageData, neckRow = 50): BuddyVoxels {
  const { width: W, height: H } = data;
  const col: (RGB | null)[] = new Array(W * H).fill(null);
  for (let i = 0; i < W * H; i++) {
    const p = i * 4;
    if (data.data[p + 3] > 128) col[i] = [data.data[p], data.data[p + 1], data.data[p + 2]];
  }

  // distance from the outline, for depth
  const dist = new Float32Array(W * H).fill(1e9);
  const queue: number[] = [];
  col.forEach((c, i) => {
    if (!c) {
      dist[i] = 0;
      queue.push(i);
    }
  });
  for (let q = 0; q < queue.length; q++) {
    const i = queue[q];
    const x = i % W;
    const y = (i / W) | 0;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const X = x + dx;
      const Y = y + dy;
      if (X < 0 || Y < 0 || X >= W || Y >= H) continue;
      const j = Y * W + X;
      if (dist[j] > dist[i] + 1) {
        dist[j] = dist[i] + 1;
        queue.push(j);
      }
    }
  }

  const average = (y0: number, y1: number, keep: (c: RGB, x: number) => boolean): RGB => {
    let r = 0, g = 0, b = 0, n = 0;
    for (let y = y0; y < y1; y++)
      for (let x = 0; x < W; x++) {
        const c = col[y * W + x];
        if (c && keep(c, x)) { r += c[0]; g += c[1]; b += c[2]; n++; }
      }
    return n ? [r / n, g / n, b / n] : [30, 25, 22];
  };
  const HAIR = average(2, 16, (c) => lum(c) < 70);
  const JACKET = average(70, 110, (c, x) => lum(c) < 60 && (x < W * 0.3 || x > W * 0.7));
  const cx = W / 2;
  const scale = (c: RGB, k: number): RGB => [c[0] * k, c[1] * k, c[2] * k];

  const backColour = (x: number, y: number, i: number): RGB => {
    const front = col[i]!;
    if (y < neckRow) return scale(HAIR, 0.82 + noise(i) * 0.32 - (noise(i + 7) > 0.86 ? 0.25 : 0));
    if (y < neckRow + 6) return Math.abs(x - cx) < W * 0.12 ? scale(front, 0.8 + noise(i) * 0.15) : scale(HAIR, 0.9);
    if (y < 150) return scale(JACKET, 1.1 + noise(i) * 0.15 - (Math.abs(x - cx) < 0.6 ? 0.3 : 0));
    return front; // jeans and shoes look the same from behind
  };

  const make = (y0: number, y1: number): VoxelSet => {
    const set: VoxelSet = { matrices: [], colors: [] };
    for (let y = y0; y < y1; y++)
      for (let x = 0; x < W; x++) {
        const i = y * W + x;
        const front = col[i];
        if (!front) continue;
        const depth = Math.min(2 + dist[i] * 1.6, 22);
        const px = x - cx + 0.5;
        const py = H - y - 0.5;
        for (const [z, c] of [[depth / 4, front], [-depth / 4, backColour(x, y, i)]] as [number, RGB][]) {
          set.matrices.push(new THREE.Matrix4().makeScale(1, 1, depth / 2).setPosition(px, py, z));
          set.colors.push(new THREE.Color().setRGB(c[0] / 255, c[1] / 255, c[2] / 255, THREE.SRGBColorSpace));
        }
      }
    return set;
  };

  return { head: make(0, neckRow), body: make(neckRow, H), pivotY: H - neckRow };
}
