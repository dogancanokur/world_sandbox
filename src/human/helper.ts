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
