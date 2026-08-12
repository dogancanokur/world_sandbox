import { WORLD_INITIAL_HUMAN_SPEED, WORLD_SIZE } from "../config.ts";
import { useRef } from "react";
import type { Mesh } from "three";
import { type RootState, useFrame } from "@react-three/fiber";
import type { Tile } from "../world/generateWorld.ts";
import { getCurrentTileOfActor, getWalkableNeighbors } from "./pathfinding.ts";
import { clamp } from "../utils.ts";

// ----------------------------------------------------------------------

export type Human = {
  id: number;
  x: number;
  z: number;

  satiety: number;
};

type HumanMeshProps = {
  human: Human;
  tiles: Tile[];
};

export default function HumanMesh({ human, tiles }: HumanMeshProps) {
  // Three.js'teki gerçek mesh objesine referans tutuyoruz.
  // Böylece React render etmeden objenin pozisyonunu değiştirebiliriz.
  const meshRef = useRef<Mesh>(null);
  const satietyRef = useRef(human.satiety);

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

    const hungerRate = 2;

    const speed = WORLD_INITIAL_HUMAN_SPEED;

    satietyRef.current = clamp(satietyRef.current - delta * hungerRate, 0, 100);
    if (satietyRef.current > 50) {
      // not hungry

      // Hedef ile mevcut pozisyon arasındaki fark.
      const dx = target.x - mesh.position.x;
      const dz = target.z - mesh.position.z;

      // Hedefe olan mesafe.
      const distance = Math.sqrt(dx * dx + dz * dz);

      if (distance < 0.1) {
        // Hedefe çok yaklaştığımız için pozisyonu tam hedefe oturtuyoruz.
        // Böylece 4.999 gibi küsuratlarla uğraşmıyoruz.
        mesh.position.x = target.x;
        mesh.position.z = target.z;

        // Actor'ın şu anda üzerinde olduğu tile'ı bul.
        const currentTile = getCurrentTileOfActor(
          tiles,
          mesh.position.x,
          mesh.position.z,
        );

        if (!currentTile) {
          return;
        }

        // Sadece dört yönlü yürünebilir komşuları bul.
        const neighbors = getWalkableNeighbors(tiles, currentTile);

        if (neighbors.length === 0) {
          return;
        }

        // Komşulardan rastgele birini seç.
        const randomIndex = Math.floor(Math.random() * neighbors.length);

        const targetTile = neighbors[randomIndex];

        // Tile koordinatını Three.js world koordinatına çevir.
        targetRef.current = {
          x: targetTile.x - WORLD_SIZE / 2,
          z: targetTile.z - WORLD_SIZE / 2,
        };

        return;
      }

      // Hedef yönü.
      const directionX = dx / distance;
      const directionZ = dz / distance;

      // Bu frame maksimum ne kadar ilerleyebiliriz?
      // distance ile clamp ediyoruz ki hedefi asla geçmesin.
      const moveDistance = Math.min(speed * delta, distance);

      mesh.position.x += directionX * moveDistance;
      mesh.position.z += directionZ * moveDistance;
    } else {
      // hungry
    }
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
