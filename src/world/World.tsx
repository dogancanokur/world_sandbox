import { generateWorld, getTileColor } from "./generateWorld.ts";
import { useMemo } from "react";
import { WORLD_INITIAL_HUMAN_SIZE, WORLD_SIZE } from "../config.ts";
import generateHumans from "../human/generate.ts";
import HumanMesh from "../human/Human.tsx";
import { generateResources } from "../resource/generate.ts";
import ResourceMesh from "../resource/ResourceMesh.tsx";

// ----------------------------------------------------------------------

export function World() {
  //
  // World component her render olduğunda değişmesin diye
  // şimdilik component dışında değil, burada bir kere üretiyoruz.

  const seed = 1337;

  // Dünya sadece seed değişince yeniden üretilir.
  const tiles = useMemo(() => generateWorld(seed), [seed]);

  // İnsanların başlangıç konumları da world veya seed değiştiğinde yeniden hesaplanır.
  const humans = useMemo(
    () => generateHumans(tiles, WORLD_INITIAL_HUMAN_SIZE, seed),
    [tiles, seed],
  );

  const foodResources = useMemo(
    () => generateResources(tiles, 30, seed, "food", 10),
    [tiles, seed],
  );
  const woodResources = useMemo(
    () => generateResources(tiles, 30, seed, "wood", 20),
    [tiles, seed],
  );

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
            0,
            tile.z - WORLD_SIZE / 2,
          ]}
        >
          {/*tilelar arası .95 olması çok az boşluk bırakmak için*/}
          <boxGeometry args={[0.95, 0.1, 0.95]} />

          <meshStandardMaterial color={getTileColor(tile.type)} />
        </mesh>
      ))}

      {humans.map((human) => (
        <HumanMesh
          key={human.id}
          human={human}
          tiles={tiles}
          foodResources={foodResources}
        />
      ))}

      {foodResources.map((foodResourceNode) => (
        <ResourceMesh key={foodResourceNode.id} resource={foodResourceNode} />
      ))}
      {woodResources.map((woodResourceNode) => (
        <ResourceMesh key={woodResourceNode.id} resource={woodResourceNode} />
      ))}
    </>
  );
}
