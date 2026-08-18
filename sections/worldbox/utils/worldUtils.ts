import type { Tile } from "../world/generateWorld";

export function isWalkableTile(tile: Tile) {
  return (
    tile.type === "grass" || tile.type === "forest" || tile.type === "sand"
  );
}
