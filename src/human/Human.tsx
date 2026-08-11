import { WORLD_SIZE } from "../config.ts";
import { useRef } from "react";
import { Mesh } from "three";
import { type RootState, useFrame } from "@react-three/fiber";
import type { Tile } from "../world/generateWorld.ts";
import { isWalkableTile } from "../world/worldUtils.ts";

// ----------------------------------------------------------------------

export type Human = {
  id: number;
  x: number;
  z: number;
};

type HumanMeshProps = {
  human: Human;
  tiles: Tile[];
};

export default function HumanMesh({ human, tiles }: HumanMeshProps) {
  // Three.js'teki gerçek mesh objesine referans tutuyoruz.
  // Böylece React render etmeden objenin pozisyonunu değiştirebiliriz.
  const meshRef = useRef<Mesh>(null);

  // useState => değer değişir → React yeniden render eder
  // useRef => değer değişir → React yeniden render etmez
  const targetRef = useRef({
    x: human.x - WORLD_SIZE / 2,
    z: human.z - WORLD_SIZE / 2,
  });

  const onFrameUpdate = (_state: RootState, delta: number) => {
    const mesh = meshRef.current;

    // Mesh henüz oluşturulmamışsa hiçbir şey yapma.
    if (!mesh) {
      return;
    }

    const target = targetRef.current;

    // Hedef ile mevcut pozisyon arasındaki fark.
    const dx = target.x - mesh.position.x;
    const dz = target.z - mesh.position.z;

    // Hedefe olan mesafe.
    const distance = Math.sqrt(dx * dx + dz * dz);

    // Hedefe ulaştıysa yeni rastgele hedef seç.
    if (distance < 0.1) {
      const nearbyTiles = getWalkableTilesNear(
        tiles,
        mesh.position.x,
        mesh.position.z,
        5, // İnsanın yaklaşık 5 birim çevresindeki yürünebilir tile'ları buluyoruz.
      );

      if (nearbyTiles.length > 0) {
        // Uygun tile'lardan rastgele birini hedef seçiyoruz.
        const randomIndex = Math.floor(Math.random() * nearbyTiles.length);

        const targetTile = nearbyTiles[randomIndex];

        targetRef.current = {
          // Tile koordinatını world koordinatına çeviriyoruz.
          x: targetTile.x - WORLD_SIZE / 2,
          z: targetTile.z - WORLD_SIZE / 2,
        };
      }

      return;
    }

    const speed = 10;

    // dx ve dz'yi distance'a bölerek yönü normalize ediyoruz.
    // Böylece çapraz giderken daha hızlı hareket etmez.
    const directionX = dx / distance;
    const directionZ = dz / distance;

    // delta = bir önceki frame ile bu frame arasındaki süre.
    // FPS değişse bile hareket hızının aynı kalmasını sağlar.
    mesh.position.x += directionX * speed * delta;
    mesh.position.z += directionZ * speed * delta;
  };

  useFrame(onFrameUpdate);

  return (
    <mesh
      ref={meshRef}
      position={[human.x - WORLD_SIZE / 2, 0.3, human.z - WORLD_SIZE / 2]}
    >
      {/* Şimdilik insanı küçük bir kutu olarak çiziyoruz. */}
      <boxGeometry args={[0.25, 0.5, 0.25]} />

      <meshStandardMaterial color="#e05a47" />
    </mesh>
  );
}

function getWalkableTilesNear(
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
