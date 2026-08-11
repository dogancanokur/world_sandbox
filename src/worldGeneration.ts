// Haritadaki bir hücrenin türü.
export type TileType = "water" | "sand" | "grass" | "forest";

export type Tile = {
  x: number;
  z: number;
  type: TileType;
};

export function worldGeneration(worldSizeX: number, worldSizeY: number): Tile[] {
  const tiles: Tile[] = [];

  for (let x = 0; x < worldSizeX; x++) {
    for (let z = 0; z < worldSizeY; z++) {
      const random = Math.random();

      let type: TileType;

      if (random < 0.15) {
        type = "water";
      } else if (random < 0.25) {
        type = "sand";
      } else if (random < 0.8) {
        type = "grass";
      } else {
        type = "forest";
      }

      tiles.push({
        x,
        z,
        type,
      });
    }
  }

  return tiles;
}

export function getTileColor(type: TileType) {
  switch (type) {
    case "water":
      return "#3f83d1";

    case "sand":
      return "#d9c27c";

    case "forest":
      return "#1b4622";

    case "grass":
    default:
      return "#5d9f4e";
  }
}
