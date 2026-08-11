import { generateWorld, getTileColor } from "./generateWorld.ts";
import { useMemo } from "react";
import { WORLD_SIZE } from "../config.ts";
import generateHumans from "../human/generateHuman.ts";
import Humans from "../human/Human.tsx";
// ----------------------------------------------------------------------

export function World() {
  //
  // World component her render olduğunda değişmesin diye
  // şimdilik component dışında değil, burada bir kere üretiyoruz.

  const seed = 1337;

  // Dünya sadece seed değişince yeniden üretilir.
  const tiles = useMemo(() => generateWorld(seed), [seed]);

  // İnsanların başlangıç konumları da world veya seed değiştiğinde yeniden hesaplanır.
  const humans = useMemo(() => generateHumans(tiles, 20, seed), [tiles, seed]);

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
      <Humans humans={humans} />
    </>
  );
}
