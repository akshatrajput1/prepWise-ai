import { useEffect, useState } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "tsparticles-slim";
import { initParticlesEngine } from "@tsparticles/react";

const ParticlesBackground = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  if (!init) return null;

  return (
    <Particles
      id="tsparticles"
      options={{
        fullScreen: {
          enable: true,
          zIndex: 999,
        },

        background: {
          color: {
            value: "#ff0000",
          },
        },

        fpsLimit: 120,

        particles: {
          number: {
            value: 80,
          },

          color: {
            value: ["#8b5cf6", "#06b6d4", "#ffffff"],
          },

          links: {
            enable: true,
            color: "#8b5cf6",
            distance: 150,
            opacity: 0.2,
            width: 1,
          },

          move: {
            enable: true,
            speed: 1,
          },

          opacity: {
            value: 0.5,
          },

          size: {
            value: {
              min: 1,
              max: 3,
            },
          },
        },

        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "grab",
            },
          },

          modes: {
            grab: {
              distance: 140,

              links: {
                opacity: 0.4,
              },
            },
          },
        },

        detectRetina: true,
      }}
    />
  );
};

export default ParticlesBackground;
