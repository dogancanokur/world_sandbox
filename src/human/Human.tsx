import { WORLD_INITIAL_HUMAN_SPEED, WORLD_SIZE } from "../config.ts";
import { useRef } from "react";
import type { Mesh } from "three";
import { type RootState, useFrame } from "@react-three/fiber";
import type { Tile } from "../world/generateWorld.ts";
import { getCurrentTileOfActor, getWalkableNeighbors } from "./pathfinding.ts";
import type { ResourceNode } from "../resource/types.ts";
import { clamp } from "../utils.ts";
import {
  getClosestFoodResource,
  getClosestNeighborToResource,
} from "./helper.ts";

// ----------------------------------------------------------------------

export type Human = {
  id: number;
  x: number;
  z: number;
  satiety: number;
};

type HumanMeshProps = {
  human: Human;
  tiles: Tile[];
  foodResources: ResourceNode[];
};

export default function HumanMesh({
  human,
  tiles,
  foodResources,
}: HumanMeshProps) {
  // Three.js mesh'ini React render'ından bağımsız değiştirebilmek için ref tutuyoruz.
  const meshRef = useRef<Mesh>(null);

  // Runtime simulation state. Değiştiğinde React render tetiklenmez.
  const satietyRef = useRef(human.satiety);

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

    const hungerRate = 2;
    const hungerThreshold = 99;
    const speed = WORLD_INITIAL_HUMAN_SPEED;

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

    const neighbors = getWalkableNeighbors(tiles, currentTile);

    if (neighbors.length === 0) {
      return;
    }

    const isHungry = satietyRef.current <= hungerThreshold;

    let nextTile: Tile | null = null;

    if (isHungry) {
      const closestFoodResource = getClosestFoodResource(
        currentTile,
        foodResources,
      );

      if (closestFoodResource) {
        nextTile = getClosestNeighborToResource(neighbors, closestFoodResource);
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
