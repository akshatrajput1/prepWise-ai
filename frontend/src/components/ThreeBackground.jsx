import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";

import * as random from "maath/random";
import { useRef, useState } from "react";

function Stars(props) {
  const ref = useRef();

  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(5000), {
      radius: 1.5,
    }),
  );

  const materialRef = useRef();

  let progress = useRef(0);

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 20;
    ref.current.rotation.y -= delta / 25;

    // Smooth reveal animation
    if (materialRef.current && progress.current < 1) {
      progress.current += delta * 0.35;

      materialRef.current.opacity = progress.current;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          ref={materialRef}
          transparent
          opacity={0}
          color="#8b5cf6"
          size={0.003}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

const ThreeBackground = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Stars />
      </Canvas>
    </div>
  );
};

export default ThreeBackground;
