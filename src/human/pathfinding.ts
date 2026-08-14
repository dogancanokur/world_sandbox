import type { Tile } from "../world/generateWorld.ts";
import { WORLD_SIZE } from "../config.ts";
import { isWalkableTile } from "../world/worldUtils.ts";
import { convertActualLocationToTileLocation } from "../utils.ts";
import type { ResourceNode } from "../resource/types.ts";

export function getCurrentTileOfActor(
  tiles: Tile[],
  x: number,
  z: number,
): Tile | null {
  // Three.js world koordinatını tile koordinatına çeviriyoruz.
  const { tileX, tileZ } = convertActualLocationToTileLocation(x, z);

  return tiles.find((tile) => tile.x === tileX && tile.z === tileZ) ?? null;
}

/*
 * Euclidean distance: sqrt(dx² + dz²)
 * Manhattan distance: abs(dx) + abs(dz)
 */

export function getWalkableNeighbors(tiles: Tile[], currentTile: Tile): Tile[] {
  const enableDiagonalMovement = false;

  return tiles.filter((tile) => {
    // Önce yürünemeyen tile'ları direkt eliyoruz.
    if (!isWalkableTile(tile)) {
      return false;
    }

    // Sağ veya sol komşu.
    const isHorizontalNeighbor =
      Math.abs(tile.x - currentTile.x) === 1 && tile.z === currentTile.z;

    // Yukarı veya aşağı komşu.
    const isVerticalNeighbor =
      Math.abs(tile.z - currentTile.z) === 1 && tile.x === currentTile.x;

    // çapraz komşular.
    const isDiagonalNeighbor =
      enableDiagonalMovement &&
      Math.abs(tile.z - currentTile.z) === 1 &&
      Math.abs(tile.x - currentTile.x) === 1;

    return isHorizontalNeighbor || isVerticalNeighbor || isDiagonalNeighbor;
  });
}

/**
 * Filters and retrieves a list of walkable tiles within a specified radius from the given world coordinates.
 *
 * @param {Tile[]} tiles - An array of tile objects to search through.
 * @param {number} worldX - The x-coordinate in the world to search around.
 * @param {number} worldZ - The z-coordinate in the world to search around.
 * @param {number} radius - The radius within which to find walkable tiles.
 * @return {Tile[]} An array of walkable tiles located within the given radius from the specified world coordinates.
 */
export function getWalkableTilesNear(
  tiles: Tile[],
  worldX: number,
  worldZ: number,
  radius: number,
) {
  return tiles.filter((tile) => {
    if (!isWalkableTile(tile)) {
      return false;
    }
    // Tile koordinatını Three.js world koordinatına çeviriyoruz.
    const tileWorldX = tile.x - WORLD_SIZE / 2;
    const tileWorldZ = tile.z - WORLD_SIZE / 2;

    const dx = tileWorldX - worldX;
    const dz = tileWorldZ - worldZ;

    // Kare mesafe kullanıyoruz.
    // sqrt almaya gerek yok çünkü sadece radius ile karşılaştırıyoruz.
    const distanceSquared = dx * dx + dz * dz;

    return distanceSquared <= radius * radius;
  });
}

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

export function getClosestNeighborToDestination(
  neighbors: Tile[],
  destination: { x: number; z: number },
): Tile | null {
  //
  let closestDistance = Infinity;
  let closestNeighbor: Tile | null = null;
  for (const tile of neighbors) {
    const manhattanDistance =
      Math.abs(tile.x - destination.x) + Math.abs(tile.z - destination.z);
    if (closestDistance > manhattanDistance) {
      closestDistance = manhattanDistance;
      closestNeighbor = tile;
    }
  }
  return closestNeighbor;
}
