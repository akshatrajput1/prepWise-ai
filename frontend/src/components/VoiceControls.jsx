import { FaMicrophone, FaStop } from "react-icons/fa";

function VoiceControls({ startListening, stopListening }) {
  return (
    <div className="flex gap-4 mt-4">
      {/* Start Button */}
      <button
        onClick={startListening}
        className="group relative flex-1 overflow-hidden rounded-2xl p-px transition-all duration-300 hover:scale-[1.02]"
      >
        <div className="absolute inset-0 bg-linear-to-r from-purple-500 to-cyan-400 opacity-70 blur-sm"></div>

        <div className="relative bg-zinc-900 rounded-2xl px-6 py-4 flex items-center justify-center gap-2 text-white font-semibold">
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-white/10 to-transparent"></div>

          <FaMicrophone className="relative z-10" />

          <span className="relative z-10">Start Speaking</span>
        </div>
      </button>

      {/* Stop Button */}
      <button
        onClick={stopListening}
        className="group relative flex-1 overflow-hidden rounded-2xl p-px transition-all duration-300 hover:scale-[1.02]"
      >
        <div className="absolute inset-0 bg-linear-to-r from-red-500 to-pink-500 opacity-70 blur-sm"></div>

        <div className="relative bg-zinc-900 rounded-2xl px-6 py-4 flex items-center justify-center gap-2 text-white font-semibold">
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-white/10 to-transparent"></div>

          <FaStop className="relative z-10" />

          <span className="relative z-10">Stop</span>
        </div>
      </button>
    </div>
  );
}

export default VoiceControls;
