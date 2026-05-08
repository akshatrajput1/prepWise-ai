import { motion } from "framer-motion";

function Progress({ value }) {
  return (
    <div className="w-full bg-zinc-800 rounded-full h-3 mt-4 overflow-hidden">
      <div
        className="h-full bg-purple-500 rounded-full transition-all duration-500"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <p className="text-zinc-400">{title}</p>

      <h3 className="text-4xl font-bold mt-2">{value}/10</h3>

      <Progress value={Number(value) * 10} />
    </div>
  );
}

function FeedbackDashboard({ feedback }) {

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-10"
    >
      <h2 className="text-3xl font-bold mb-6">
        AI Performance Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Technical Skills"
          value={feedback.technical}
        />

        <StatCard
          title="Communication"
          value={feedback.communication}
        />

        <StatCard
          title="Confidence"
          value={feedback.confidence}
        />
      </div>

      <div className="mt-6 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-2xl p-6">
        <p className="text-zinc-400">Overall Performance</p>

        <h3 className="text-4xl font-bold mt-2">
          {feedback.overall}/10
        </h3>

        <Progress value={Number(feedback.overall) * 10} />
      </div>

      <div className="mt-6 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <p className="text-zinc-400">
          Detailed AI Feedback
        </p>

        <pre className="whitespace-pre-wrap text-zinc-300 leading-relaxed mt-4">
          {feedback.raw}
        </pre>
      </div>
    </motion.div>
  );
}

export default FeedbackDashboard;