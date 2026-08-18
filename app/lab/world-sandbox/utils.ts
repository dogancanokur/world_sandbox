import { WORLD_SIZE } from "./config";

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
// 0-1 arası geçiş
export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// 0 ile 1 arasındaki geçişi daha yumuşak yapar.
// Linear interpolation'daki sertliği azaltır.
export function smoothStep(t: number) {
  return t * t * (3 - 2 * t);
}

// Aynı x, z ve seed için her zaman aynı değeri üretir.
// Sonuç 0 ile 1 arasındadır.
export function randomFromCoordinates(x: number, z: number, seed: number) {
  const value = Math.sin(x * 19.23 + z * 27.06 + seed * 94.1994) * 654.1181;

  return value - Math.floor(value);
}

export function convertActualLocationToTileLocation(x: number, z: number) {
  const tileX = Math.round(WORLD_SIZE / 2 + x);
  const tileZ = Math.round(WORLD_SIZE / 2 + z);
  return { tileX, tileZ };
}

export function getRandomInt(max: number): number {
  return Math.floor(Math.random() * max);
}
