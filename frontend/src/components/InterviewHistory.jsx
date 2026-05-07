import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function InterviewHistory({ history }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white">Interview History</h2>

        <div className="px-4 py-2 rounded-full bg-zinc-800 border border-zinc-700 text-sm text-zinc-400">
          {history.length} Sessions
        </div>
      </div>

      <div className="space-y-6 pt-2 pb-4 max-h-[60vh] overflow-y-scroll overflow-x-visible pr-2 custom-scrollbar">
        {history.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
              }}
              className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-xl p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/20 hover:shadow-lg"
            >
              {/* Header */}
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between text-left"
              >
                <div>
                  <p className="text-sm uppercase tracking-widest text-zinc-500">
                    Interview Session
                  </p>

                  <h3 className="text-xl font-semibold text-white mt-1">
                    Session #{history.length - index}
                  </h3>
                </div>

                <div
                  className={`transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35 }}
                    className="overflow-hidden mt-6"
                  >
                    {/* Question Card */}
                    <div className="relative mb-5 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5 overflow-hidden">
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.4),transparent_40%)]"></div>

                      <div className="relative flex items-start gap-4">
                        <div className="min-w-[48px] h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 font-bold text-lg">
                          Q
                        </div>

                        <div>
                          <h4 className="text-cyan-300 font-semibold mb-2">
                            Interview Question
                          </h4>

                          <p className="text-zinc-200 leading-relaxed">
                            {item.question}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Answer Card */}
                    <div className="relative mb-5 rounded-2xl border border-purple-500/20 bg-purple-500/5 p-5 overflow-hidden">
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.4),transparent_40%)]"></div>

                      <div className="relative flex items-start gap-4">
                        <div className="min-w-[48px] h-12 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 font-bold text-lg">
                          A
                        </div>

                        <div>
                          <h4 className="text-purple-300 font-semibold mb-2">
                            Your Answer
                          </h4>

                          <p className="text-zinc-200 leading-relaxed whitespace-pre-wrap">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Feedback Card */}
                    <div className="relative rounded-2xl border border-green-500/20 bg-green-500/5 p-5 overflow-hidden">
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.4),transparent_40%)]"></div>

                      <div className="relative flex items-start gap-4">
                        <div className="min-w-[48px] h-12 rounded-2xl bg-green-500/20 border border-green-400/30 flex items-center justify-center text-green-300 font-bold text-lg">
                          ✦
                        </div>

                        <div className="flex-1">
                          <h4 className="text-green-300 font-semibold mb-2">
                            AI Feedback
                          </h4>

                          <p className="text-zinc-200 leading-relaxed whitespace-pre-wrap">
                            {typeof item.feedback === "string"
                              ? item.feedback
                              : item.feedback?.raw}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
