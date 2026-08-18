import { Building } from "../config";
import type { Tile } from "../world/generateWorld";

export function buildHouse(
  onBuildHouse: (x: number, z: number) => boolean,
  currentTile: Tile,
  woodInventoryRef: React.RefObject<number>,
) {
  //
  if (currentTile.hasBuilding) {
    console.log(
      `${currentTile.x}, ${currentTile.z} konumunda zaten bir ev var`,
    );
    return;
  }
  if (currentTile.hasResource) {
    return;
  }
  if (onBuildHouse(currentTile.x, currentTile.z)) {
    woodInventoryRef.current -= Building.house.cost;
  }
}
