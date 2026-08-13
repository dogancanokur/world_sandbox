import type { ResourceNode } from "../resource/types.ts";
import type { Tile } from "../world/generateWorld.ts";

export function getClosestResource(
  currentTile: Tile,
  resources: ResourceNode[],
): ResourceNode | null {
  //
  let closestDistance = Infinity;
  let closestFoodResource: ResourceNode | null = null;

  for (const resource of resources) {
    if (resource.amount <= 0) continue;
    const manhattanDistance =
      Math.abs(currentTile.z - resource.z) +
      Math.abs(currentTile.x - resource.x);
    if (closestDistance > manhattanDistance) {
      closestDistance = manhattanDistance;
      closestFoodResource = resource;
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