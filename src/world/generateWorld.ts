import { valueNoise } from "./noise.ts";
import { clamp } from "../utils.ts";
import { WORLD_SIZE } from "../config.ts";

export type TileType = "water" | "sand" | "grass" | "forest";

export type Tile = {
  x: number;
  z: number;
  type: TileType;
  hasBuilding: boolean;
  hasResource: boolean;
};

export function generateWorld(seed: number): Tile[] {
  const tiles: Tile[] = [];

  const center = WORLD_SIZE / 2;
  const maxDistance = WORLD_SIZE / 2;

  for (let x = 0; x < WORLD_SIZE; x++) {
    for (let z = 0; z < WORLD_SIZE; z++) {
      const dx = x - center;
      const dz = z - center;

      const distanceFromCenter = Math.sqrt(dx * dx + dz * dz);

      const normalizedDistance = distanceFromCenter / maxDistance;

      // Merkez yüksek, kenarlar düşük.
      const islandFalloff = clamp(1 - normalizedDistance, 0, 1);

      // Koordinatları küçültmemizin sebebi noise'u "zoomlamak".
      // 0.15 küçük ve geniş bölgeler oluşturur.
      // Daha büyük değerler daha parçalı terrain üretir.
      const noise = valueNoise(x * 0.15, z * 0.15, seed);

      // Noise 0-1 arasında.
      // Biraz merkeze ağırlık verip ikisini birleştiriyoruz.
      const terrainValue = islandFalloff * 0.8 + noise * 0.45;

      let type: TileType;

      if (terrainValue < 0.28) {
        type = "water";
      } else if (terrainValue < 0.38) {
        type = "sand";
      } else if (terrainValue < 0.7) {
        type = "grass";
      } else {
        type = "forest";
      }

      tiles.push({
        x,
        z,
        type,
        hasBuilding: false,
        hasResource: false,
      });
    }
  }

  return tiles;
}

export function getTileColor(type: TileType) {
  switch (type) {
    case "water":
      return "#3f83d1";

    case "sand":
      return "#d9c27c";

    case "forest":
      return "#1b4622";

    case "grass":
    default:
      return "#5d9f4e";
  }
}
