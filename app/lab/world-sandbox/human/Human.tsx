import { Building, WORLD_INITIAL, WORLD_SIZE } from "../config";
import { useRef } from "react";
import type { Mesh } from "three";
import { type RootState, useFrame } from "@react-three/fiber";
import type { Tile } from "../world/generateWorld";
import {
  getClosestNeighborToDestination,
  getClosestResource,
  getCurrentTileOfActor,
  getWalkableNeighbors,
} from "./pathfinding";
import type { ResourceNode } from "../resource/types";
import { clamp } from "../utils";
import { getClosestBuildableTile } from "../house/helper";
import { buildHouse } from "./action";

// ----------------------------------------------------------------------

export type Human = {
  id: number;
  x: number;
  z: number;
  satiety: number;
  woodInventory: number;
};

type HumanMeshProps = {
  human: Human;
  tiles: Tile[];
  foodResources: ResourceNode[];
  woodResources: ResourceNode[];
  onBuildHouse: (x: number, y: number) => boolean;
};

export default function HumanMesh({
  human,
  tiles,
  foodResources,
  woodResources,
  onBuildHouse,
}: HumanMeshProps) {
  // Three.js mesh'ini React render'ından bağımsız değiştirebilmek için ref tutuyoruz.
  const meshRef = useRef<Mesh>(null);

  // Runtime simulation state. Değiştiğinde React render tetiklenmez.
  const satietyRef = useRef(human.satiety);
  const woodInventoryRef = useRef(human.woodInventory);

  const timerRef = useRef(0);
  const logTimerRef = useRef(0);

  const lastCollectedWoodTimerRef = useRef(0);

  // targetRef world coordinate tutuyor.
  const targetRef = useRef({
    x: human.x - WORLD_SIZE / 2,
    z: human.z - WORLD_SIZE / 2,
  });

  const onFrameUpdate = (_state: RootState, delta: number) => {
    const mesh = meshRef.current;

    if (!mesh) {
      return;
    }

    logTimerRef.current += delta;
    if (logTimerRef.current > 1) {
      console.log(
        "satiety: " +
          Math.round(satietyRef.current) +
          " wood: " +
          woodInventoryRef.current,
        " lastCollectedWoodTimerRef: " + lastCollectedWoodTimerRef.current,
        " timer: " + timerRef.current,
      );
      logTimerRef.current = 0;
    }
    timerRef.current += delta;

    const hungerRate = 2;
    const hungerThreshold = 50;
    const speed = WORLD_INITIAL.human.speed;

    // delta sayesinde hunger FPS'ten bağımsız azalıyor.
    satietyRef.current = clamp(satietyRef.current - delta * hungerRate, 0, 100);

    const target = targetRef.current;

    // targetRef world coordinate olduğu için mesh.position ile aynı sistemde.
    const dx = target.x - mesh.position.x;
    const dz = target.z - mesh.position.z;

    const distance = Math.sqrt(dx * dx + dz * dz);

    /*
     * Henüz target'a ulaşmadıysak yalnızca hareket ediyoruz.
     * AI kararı her frame değil, tile'a ulaştığımız zaman verilecek.
     */
    // move to destination
    if (distance >= 0.1) {
      const directionX = dx / distance;
      const directionZ = dz / distance;

      // Hedefi geçmemesi için kalan mesafeyle clamp ediyoruz.
      const moveDistance = Math.min(speed * delta, distance);

      mesh.position.x += directionX * moveDistance;
      mesh.position.z += directionZ * moveDistance;

      return;
    }

    /*
     * Buradan sonrası "decision point".
     * Human bir tile'a ulaştığında yeni karar veriyoruz.
     */

    mesh.position.x = target.x;
    mesh.position.z = target.z;

    const currentTile = getCurrentTileOfActor(
      tiles,
      mesh.position.x,
      mesh.position.z,
    );

    if (!currentTile) {
      return;
    }

    const isHungry = satietyRef.current <= hungerThreshold;

    let nextTile: Tile | null = null;
    const neighbors = getWalkableNeighbors(tiles, currentTile);

    if (isHungry) {
      const closestFoodResource = getClosestResource(
        currentTile,
        foodResources,
      );
      if (closestFoodResource) {
        if (
          currentTile.x === closestFoodResource.x &&
          currentTile.z === closestFoodResource.z
        ) {
          console.log("yummy yummy");
          if (closestFoodResource.amount > 0) {
            closestFoodResource.amount -= 1;
            satietyRef.current = 100;
          }
        }

        if (neighbors.length === 0) {
          return;
        }
        nextTile = getClosestNeighborToDestination(neighbors, {
          x: closestFoodResource.x,
          z: closestFoodResource.z,
        });
      }
      //
    } else if (woodInventoryRef.current < Building.house.cost) {
      const closestWoodResource = getClosestResource(
        currentTile,
        woodResources,
      );
      if (closestWoodResource) {
        if (
          currentTile.x === closestWoodResource.x &&
          currentTile.z === closestWoodResource.z
        ) {
          if (
            closestWoodResource.amount > 0 &&
            timerRef.current - lastCollectedWoodTimerRef.current >= 1
          ) {
            console.log("collect woods");
            closestWoodResource.amount -= 1;
            woodInventoryRef.current += 1;
            lastCollectedWoodTimerRef.current = timerRef.current;
          }
          return;
        }

        if (neighbors.length === 0) {
          return;
        }
        nextTile = getClosestNeighborToDestination(neighbors, {
          x: closestWoodResource.x,
          z: closestWoodResource.z,
        });
      }
    } else if (woodInventoryRef.current >= Building.house.cost) {
      const closestBuildableTile = getClosestBuildableTile(currentTile, tiles);
      if (closestBuildableTile) {
        if (
          currentTile.x !== closestBuildableTile.x ||
          currentTile.z !== closestBuildableTile.z
        ) {
          if (neighbors.length === 0) {
            return;
          }
          nextTile = getClosestNeighborToDestination(neighbors, {
            x: closestBuildableTile.x,
            z: closestBuildableTile.z,
          });
        }
        if (
          currentTile.x === closestBuildableTile.x &&
          currentTile.z === closestBuildableTile.z
        ) {
          buildHouse(onBuildHouse, currentTile, woodInventoryRef);
        }
      }
    }

    if (!nextTile) {
      const randomIndex = Math.floor(Math.random() * neighbors.length);
      nextTile = neighbors[randomIndex];
    }

    targetRef.current = {
      x: nextTile.x - WORLD_SIZE / 2,
      z: nextTile.z - WORLD_SIZE / 2,
    };
  };

  // R3F game loop.
  useFrame(onFrameUpdate);

  return (
    <mesh
      ref={meshRef}
      position={[human.x - WORLD_SIZE / 2, 0.3, human.z - WORLD_SIZE / 2]}
    >
      <boxGeometry args={[0.25, 0.5, 0.25]} />
      <meshStandardMaterial color="#e05a47" />
    </mesh>
  );
}
