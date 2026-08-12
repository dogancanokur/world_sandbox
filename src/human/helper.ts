import type { ResourceNode } from "../resource/types.ts";
import type { Tile } from "../world/generateWorld.ts";

export function getClosestFoodResource(
  currentTile: Tile,
  foodResources: ResourceNode[],
): ResourceNode | null {
  //
  let closestDistance = Infinity;
  let closestFoodResource: ResourceNode | null = null;

  for (const foodResource of foodResources) {
    if (foodResource.amount <= 0) continue;
    const manhattanDistance =
      Math.abs(currentTile.z - foodResource.z) +
      Math.abs(currentTile.x - foodResource.x);
    if (closestDistance > manhattanDistance) {
      closestDistance = manhattanDistance;
      closestFoodResource = foodResource;
    }
  }

  return closestFoodResource;
}

export function getClosestNeighborToResource(
  neighbors: Tile[],
  resource: ResourceNode,
): Tile | null {
  //
  let closestDistance = Infinity;
  let closestNeighbor: Tile | null = null;
  for (const tile of neighbors) {
    const manhattanDistance =
      Math.abs(tile.x - resource.x) + Math.abs(tile.z - resource.z);
    if (closestDistance > manhattanDistance) {
      closestDistance = manhattanDistance;
      closestNeighbor = tile;
    }
  }
  return closestNeighbor;
}
