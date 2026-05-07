import Spline from "@splinetool/react-spline";

export default function SplineOrb({ listening }) {
  return (
    <div
      className={`w-full h-[180px] md:h-[220px] overflow-hidden rounded-3xl border border-zinc-800 bg-black/40 backdrop-blur-xl mb-6 transition-all duration-500 ${
        listening
          ? "shadow-[0_0_60px_rgba(168,85,247,0.6)] scale-[1.02]"
          : "shadow-[0_0_20px_rgba(168,85,247,0.15)]"
      }`}
    >
      <Spline scene="https://prod.spline.design/UeoNbFfY8WiFw9Zi/scene.splinecode" />
    </div>
  );
}
