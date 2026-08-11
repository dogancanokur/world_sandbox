import {
  worldGeneration,
  getTileColor,
} from "./worldGeneration.ts";
// ----------------------------------------------------------------------

export function World() {
  //
  const WORLD_SIZE_X = 20;
  const WORLD_SIZE_Y = 25;
  // World component her render olduğunda değişmesin diye
  // şimdilik component dışında değil, burada bir kere üretiyoruz.

  const tiles = worldGeneration(WORLD_SIZE_X, WORLD_SIZE_Y);

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
            tile.x - WORLD_SIZE_X / 2,
            0,
            tile.z - WORLD_SIZE_Y / 2,
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
