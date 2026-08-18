import { lerp, randomFromCoordinates, smoothStep } from "../utils/utils";

export function valueNoise(x: number, z: number, seed: number) {
  // Hangi grid karesinin içinde olduğumuzu buluyoruz.
  const x0 = Math.floor(x);
  const z0 = Math.floor(z);

  const x1 = x0 + 1;
  const z1 = z0 + 1;

  // Hücre içindeki pozisyonumuz.
  // Örneğin x = 4.3 ise localX = 0.3
  const localX = x - x0;
  const localZ = z - z0;

  // Geçişleri yumuşatıyoruz.
  const smoothX = smoothStep(localX);
  const smoothZ = smoothStep(localZ);

  // Etrafımızdaki dört köşenin random değerleri.
  const topLeft = randomFromCoordinates(x0, z0, seed);

  const topRight = randomFromCoordinates(x1, z0, seed);

  const bottomLeft = randomFromCoordinates(x0, z1, seed);

  const bottomRight = randomFromCoordinates(x1, z1, seed);

  // Önce yatay eksende blend ediyoruz.
  const top = lerp(topLeft, topRight, smoothX);

  const bottom = lerp(bottomLeft, bottomRight, smoothX);

  // Sonra iki yatay sonucu dikey olarak blend ediyoruz.
  return lerp(top, bottom, smoothZ);
}
