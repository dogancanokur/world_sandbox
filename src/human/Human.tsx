
// ----------------------------------------------------------------------

import { WORLD_SIZE } from "../config.ts";

export type Human = {
  id: number;
  x: number;
  z: number;
};

type HumansProps = {
  humans: Human[];
};

export default function Humans({ humans }: HumansProps) {
  return (
    <>
      {humans.map((human) => (
        <mesh
          key={human.id}
          position={[
            // Tile'ları daha önce WORLD_SIZE / 2 kadar
            // merkeze çekmiştik. İnsanlara da aynısını yapıyoruz.
            human.x - WORLD_SIZE / 2,

            // Tile yüksekliği yaklaşık 0.1.
            // İnsan kutusunu zeminin biraz üstüne koyuyoruz.
            0.3,

            human.z - WORLD_SIZE / 2,
          ]}
        >
          {/* Şimdilik insan = küçük kutu.
              Sonra model veya sprite kullanabiliriz. */}
          <boxGeometry args={[0.25, 0.5, 0.25]} />

          <meshStandardMaterial color="#e05a47" />
        </mesh>
      ))}
    </>
  );
}
