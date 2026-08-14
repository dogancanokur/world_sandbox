import type { Tile } from "../world/generateWorld.ts";
import { getManhattanDistance } from "../world/helper.ts";

export function getClosestBuildableTile(
  currentTile: Tile,
  tiles: Tile[],
): Tile | null {
  let closestBuildableTile = null;
  let distance = Infinity;
  tiles.forEach((tile) => {
    if (tile.type === "grass" && !tile.hasBuilding) {
      const manhattanDistance = getManhattanDistance(tile, currentTile);
      if (manhattanDistance < distance) {
        closestBuildableTile = tile;
        distance = manhattanDistance;
      }
    }
  });
  return closestBuildableTile;
}
