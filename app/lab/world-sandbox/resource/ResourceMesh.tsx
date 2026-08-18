import { WORLD_SIZE } from "../config";
import type { ResourceNode } from "./types";

type ResourceMeshProps = {
  resource: ResourceNode;
};

export default function ResourceMesh({ resource }: ResourceMeshProps) {
  //
  const foodGeometry = (
    <>
      <sphereGeometry args={[0.18, 12, 12]} />
      <meshStandardMaterial color="#9acd32" />
    </>
  );
  const woodGeometry = (
    <>
      <cylinderGeometry args={[0.1, 0.1, 1]} />
      <meshStandardMaterial color="#964b00" />
    </>
  );
  return (
    <mesh
      position={[
        // Tile koordinatını Three.js world koordinatına çeviriyoruz.
        resource.x - WORLD_SIZE / 2,

        // Zeminin biraz üstünde dursun.
        resource.type === "wood" ? 0.5 : 0.25,

        resource.z - WORLD_SIZE / 2,
      ]}
    >
      {resource.type === "food" ? foodGeometry : null}
      {resource.type === "wood" ? woodGeometry : null}
    </mesh>
  );
}
