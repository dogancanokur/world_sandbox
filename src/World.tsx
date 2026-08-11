import { worldGeneration, getTileColor } from "./worldGeneration.ts";
import { useMemo } from "react";
// ----------------------------------------------------------------------

export function World() {
  //
  const WORLD_SIZE = 60;
  // World component her render olduğunda değişmesin diye
  // şimdilik component dışında değil, burada bir kere üretiyoruz.

  const seed = 1337;
  const tiles = useMemo(() => worldGeneration(WORLD_SIZE, seed), []);

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
    </>
  );
}
