import type { Tile } from "../world/generateWorld.ts";
import { randomFromCoordinates } from "../utils.ts";
import type { Human } from "./Human.tsx";
import { isWalkableTile } from "../world/worldUtils.ts";
// ----------------------------------------------------------------------

export default function generateHumans(
  tiles: Tile[],
  count: number,
  seed: number,
): Human[] {
  // İnsanları suya veya kuma doğurmak istemiyoruz.
  const availableTiles = tiles.filter(isWalkableTile);

  // Tile'ları seed'e bağlı olarak karıştırıyoruz.
  // Aynı seed her zaman aynı insan başlangıçlarını verir.
  const shuffledTiles = [...availableTiles].sort((a, b) => {
    const randomA = randomFromCoordinates(a.x, a.z, seed + 100);

    const randomB = randomFromCoordinates(b.x, b.z, seed + 100);

    return randomA - randomB;
  });

  // İstediğimiz kadar uygun tile alıyoruz.
  return shuffledTiles.slice(0, count).map((tile, index) => ({
    id: index,
    x: tile.x,
    z: tile.z,
    satiety: 100,
    woodInventory: 0,
  }));
}
