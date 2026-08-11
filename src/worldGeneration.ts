// Haritadaki bir hücrenin türü.
export type TileType = "water" | "sand" | "grass" | "forest";

export type Tile = {
  x: number;
  z: number;
  type: TileType;
};

export function worldGeneration(WORLD_SIZE: number, seed:number): Tile[] {
  const tiles: Tile[] = [];

  // Haritanın orta noktasını hesaplıyoruz.
  const center = WORLD_SIZE / 2;

  const random = createSeededRandom(seed);
  /**
   * Merkeze olan uzaklığa göre terrain tipini belirler.
   * @param x
   * @param z
   */
  const calculateDistanceFromCenter = (x: number, z: number) => {
    const dx = x - center;
    const dz = z - center;
    return Math.sqrt(dx * dx + dz * dz);
  };

  for (let x = 0; x < WORLD_SIZE; x++) {
    for (let z = 0; z < WORLD_SIZE; z++) {
      const distanceFromCenter = calculateDistanceFromCenter(x, z);

      // // 0(merkez) - 1(kenar)
      const normalizedDistance = distanceFromCenter / center;
      // kenarlara yaklaştıkça terrain değeri küçülecek. böylece dış taraflarda su oluşacak
      const islandFalloff = 1 - normalizedDistance;

      // Adanın tamamen yuvarlak olmaması için biraz random noise ekliyoruz.

      const noise = random() * 0.35;

      const terrainValue = islandFalloff + noise;

      let type: TileType;

      if (terrainValue < 0.3) {
        type = "water";
      } else if (terrainValue < 0.42) {
        type = "sand";
      } else if (terrainValue < 0.85) {
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

function createSeededRandom(seed: number) {
  let value = seed;

  return () => {
    value = Math.sin(value) * 10000;

    let number = value - Math.floor(value);
    console.log("seed ", value);
    return number;
  };
}