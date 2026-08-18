import type { Village } from "@/sections/worldbox/village/types";
import { getManhattanDistance } from "@/sections/worldbox/utils/helper";

const VILLAGE_JOIN_DISTANCE = 5;

export function getClosestVillage(
  houseX: number,
  houseZ: number,
  villages: Village[],
): Village | null {
  let closestVillage: Village | null = null;
  let closestVillageDistance = Infinity;

  villages.forEach((village) => {
    const houseLocation: { x: number; z: number } = {
      x: houseX,
      z: houseZ,
    };
    const villageLocation: { x: number; z: number } = {
      x: village.centerX,
      z: village.centerZ,
    };
    const manhattanDistance = getManhattanDistance(
      houseLocation,
      villageLocation,
    );
    if (manhattanDistance < closestVillageDistance) {
      closestVillage = village;
      closestVillageDistance = manhattanDistance;
    }
  });

  if (closestVillageDistance <= VILLAGE_JOIN_DISTANCE) {
    return closestVillage;
  }

  return null;
}
