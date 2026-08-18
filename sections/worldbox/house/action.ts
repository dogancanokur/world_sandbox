import { Building } from "../config";
import type { Tile } from "../world/generateWorld";
import { House } from "@/sections/worldbox/house/types";
import { getClosestVillage } from "@/sections/worldbox/village/helper";
import type { Village } from "@/sections/worldbox/village/types";

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

export function getOnBuildHouse(
  tiles: Tile[],
  houses: House[],
  setHouses: (value: ((prevState: House[]) => House[]) | House[]) => void,
  villages: Village[],
  setVillages: (
    value: ((prevState: Village[]) => Village[]) | Village[],
  ) => void,
) {
  return function (x: number, z: number): boolean {
    const foundTile = tiles.find((tile) => tile.x === x && tile.z === z);

    if (
      foundTile &&
      foundTile.type === "grass" &&
      !foundTile.hasBuilding &&
      !foundTile.hasResource
    ) {
      const newHouse: House = {
        id: houses.length,
        x,
        z,
      };

      setHouses((prevState) => [...prevState, newHouse]);
      foundTile.hasBuilding = true;

      const closestVillage = getClosestVillage(x, z, villages);

      if (closestVillage) {
        setVillages((prevState) =>
          prevState.map((village) =>
            village.id === closestVillage.id
              ? {
                  ...village,
                  houseIds: [...village.houseIds, newHouse.id],
                }
              : village,
          ),
        );
      } else {
        const newVillage: Village = {
          id: villages.length,
          houseIds: [newHouse.id],
          centerX: newHouse.x,
          centerZ: newHouse.z,
        };

        setVillages((prevState) => [...prevState, newVillage]);
      }

      return true;
    }

    return false;
  };
}
