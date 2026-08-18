import { generateWorld, getTileColor } from "./generateWorld";
import { useMemo, useState } from "react";
import { WORLD_INITIAL, WORLD_SIZE } from "../config";
import generateHumans from "../human/generate";
import HumanMesh from "../human/Human";
import { generateResources } from "../resource/generate";
import { getRandomInt } from "../utils/utils";
import ResourceMesh from "../resource/ResourceMesh";

import type { House } from "../house/types";
import type { Village } from "@/sections/worldbox/village/types";
import { getOnBuildHouse } from "@/sections/worldbox/house/action";

// ----------------------------------------------------------------------

export function World() {
  //
  // World component her render olduğunda değişmesin diye
  // şimdilik component dışında değil, burada bir kere üretiyoruz.

  const seed = useMemo(() => {
    return getRandomInt(100000);
  }, []);

  // Dünya sadece seed değişince yeniden üretilir.
  const tiles = useMemo(() => generateWorld(seed), [seed]);

  // İnsanların başlangıç konumları da world veya seed değiştiğinde yeniden hesaplanır.
  const humans = useMemo(
    () => generateHumans(tiles, WORLD_INITIAL.human.count, seed),
    [tiles, seed],
  );

  const foodResources = useMemo(
    () =>
      generateResources(
        tiles,
        WORLD_INITIAL.food.count,
        seed,
        "food",
        WORLD_INITIAL.food.amount,
      ),
    [tiles, seed],
  );

  const woodResources = useMemo(
    () =>
      generateResources(
        tiles,
        WORLD_INITIAL.wood.count,
        seed,
        "wood",
        WORLD_INITIAL.wood.amount,
      ),
    [tiles, seed],
  );

  const [villages, setVillages] = useState<Village[]>([]);

  const [houses, setHouses] = useState<House[]>([]);


  return (
    <>
      <ambientLight intensity={1.5} />

      {/* Gün ışığı. */}
      <directionalLight position={[10, 20, 10]} intensity={2} />

      {tiles.map((tile) => (
        <mesh
          key={`${tile.x}-${tile.z}`}
          position={[
            // Haritayı dünya merkezinin etrafına taşıyoruz.
            tile.x - WORLD_SIZE / 2,
            (tile.type === "water" ? 0 : tile.type === "forest" ? 0.2 : 0.1) /
              2,
            tile.z - WORLD_SIZE / 2,
          ]}
        >
          {/*tilelar arası .95 olması çok az boşluk bırakmak için*/}
          <boxGeometry
            args={[
              0.95,
              (tile.type === "water"
                ? 0.1
                : tile.type === "forest"
                  ? 0.3
                  : 0.2) / 2,

              0.95,
            ]}
          />

          <meshStandardMaterial color={getTileColor(tile.type)} />
        </mesh>
      ))}

      {humans.map((human) => (
        <HumanMesh
          key={human.id}
          human={human}
          tiles={tiles}
          foodResources={foodResources}
          woodResources={woodResources}
          onBuildHouse={getOnBuildHouse(tiles, houses, setHouses, villages,setVillages)}
        />
      ))}

      {foodResources.map((node) =>
        node.amount > 0 ? <ResourceMesh key={node.id} resource={node} /> : null,
      )}
      {woodResources.map((node) =>
        node.amount > 0 ? <ResourceMesh key={node.id} resource={node} /> : null,
      )}

      {houses.map((house) => (
        <mesh
          key={`house_${house.id}`}
          position={[
            house.x - WORLD_SIZE / 2,
            0.75 / 2,
            house.z - WORLD_SIZE / 2,
          ]}
        >
          <boxGeometry args={[0.5, 0.75, 0.5]} />
          <meshStandardMaterial color="#964b00" />
        </mesh>
      ))}
    </>
  );
}
