import { WORLD_SIZE } from "../config.ts";
import { useRef } from "react";
import { Mesh } from "three";
import { useFrame } from "@react-three/fiber";
import { clamp } from "../utils.ts";

// ----------------------------------------------------------------------

export type Human = {
  id: number;
  x: number;
  z: number;
};

type HumanMeshProps = {
  human: Human;
};

export default function HumanMesh({ human }: HumanMeshProps) {
  // Three.js'teki gerçek mesh objesine referans tutuyoruz.
  // Böylece React render etmeden objenin pozisyonunu değiştirebiliriz.
  const meshRef = useRef<Mesh>(null);

  // useState => değer değişir → React yeniden render eder
  // useRef => değer değişir → React yeniden render etmez
  const targetRef = useRef({
    x: human.x - WORLD_SIZE / 2,
    z: human.z - WORLD_SIZE / 2,
  });

  useFrame((_, delta) => {
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
      targetRef.current = {
        // Şimdilik yakınlarda rastgele dolaştırıyoruz.
        // Bir sonraki adımda suya girmelerini engelleyeceğiz.
        x: clamp(mesh.position.x + (Math.random() - 0.5) * 4, -WORLD_SIZE / 2, WORLD_SIZE / 2),
        z: clamp(mesh.position.z + (Math.random() - 0.5) * 4, -WORLD_SIZE / 2, WORLD_SIZE / 2),
      };

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
  });

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
