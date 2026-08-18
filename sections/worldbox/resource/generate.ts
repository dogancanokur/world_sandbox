import type { ResourceNode, ResourceType } from "./types";
import type { Tile } from "../world/generateWorld";
import { randomFromCoordinates } from "../utils/utils";

export function generateResources(
  tiles: Tile[],
  count: number,
  seed: number,
  resourceType: ResourceType,
  amount: number,
): ResourceNode[] {
  //
  const availableTiles = tiles.filter((tile) => {
    let tileType = "";
    if (resourceType === "food") tileType = "grass";
    else if (resourceType === "wood") tileType = "forest";
    return tile.type === tileType;
  });

  const shuffledTiles = [...availableTiles].sort((a, b) => {
    const randomA = randomFromCoordinates(a.x, a.z, seed + 200);
    const randomB = randomFromCoordinates(b.x, b.z, seed + 200);
    return randomA - randomB;
  });

  return shuffledTiles.slice(0, count).map((tile, index) => {
    tile.hasResource = true;
    return {
      id: index,
      type: resourceType,
      x: tile.x,
      z: tile.z,
      amount: amount,
    };
  });
}
