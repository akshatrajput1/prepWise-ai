import { motion } from "framer-motion";

function QuestionCard({ question }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-8 bg-zinc-800 p-6 rounded-2xl"
    >
      <h2 className="text-2xl font-semibold mb-4">Interview Question</h2>

      <p className="text-zinc-300 leading-relaxed">{question}</p>
    </motion.div>
  );
}

export default QuestionCard;
