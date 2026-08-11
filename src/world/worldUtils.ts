import type { Tile } from "./generateWorld.ts";

export function isWalkableTile(tile: Tile) {
  return (
    tile.type === "grass" || tile.type === "forest" || tile.type === "sand"
  );
}
