import "./App.css";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { World } from "./World.tsx";

// ----------------------------------------------------------------------

function App() {
  return (
    <Canvas
      camera={{
        // Kameranın dünyadaki başlangıç konumu: X, Y, Z
        position: [10, 12, 10],

        // Kameranın görüş açısı.
        // Küçüldükçe daha zoomlu, büyüdükçe daha geniş görünür.
        fov: 45,
      }}
    >
      <World />
      <OrbitControls
        // Kameranın baktığı merkez noktası.
        target={[0, 0, 0]}

        // Kamera hareketini aniden durdurmak yerine hafifçe yavaşlatır.
        // Daha doğal ve akıcı bir kamera hissi verir.
        enableDamping
      />
    </Canvas>
  );
}

export default App;
