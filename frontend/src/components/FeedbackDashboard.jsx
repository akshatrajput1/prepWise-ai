import { motion } from "framer-motion";
import { Card, Metric, Text, ProgressBar, Grid } from "@tremor/react";

function FeedbackDashboard({ feedback }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-10"
    >
      <h2 className="text-3xl font-bold mb-6">AI Performance Dashboard</h2>

      <Grid numItems={1} numItemsMd={3} className="gap-4">
        <Card className="bg-zinc-900 border border-zinc-800 rounded-2xl">
          <Text>Technical Skills</Text>

          <Metric>{feedback.technical}/10</Metric>

          <ProgressBar
            value={Number(feedback.technical) * 10}
            className="mt-4"
          />
        </Card>

        <Card className="bg-zinc-900 border border-zinc-800 rounded-2xl">
          <Text>Communication</Text>

          <Metric>{feedback.communication}/10</Metric>

          <ProgressBar
            value={Number(feedback.communication) * 10}
            className="mt-4"
          />
        </Card>

        <Card className="bg-zinc-900 border border-zinc-800 rounded-2xl">
          <Text>Confidence</Text>

          <Metric>{feedback.confidence}/10</Metric>

          <ProgressBar
            value={Number(feedback.confidence) * 10}
            className="mt-4"
          />
        </Card>
      </Grid>

      <Card className="mt-6 bg-linear-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-2xl">
        <Text>Overall Performance</Text>

        <Metric>{feedback.overall}/10</Metric>

        <ProgressBar value={Number(feedback.overall) * 10} className="mt-4" />
      </Card>

      <Card className="mt-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
        <Text>Detailed AI Feedback</Text>

        <pre className="whitespace-pre-wrap text-zinc-300 leading-relaxed mt-4">
          {feedback.raw}
        </pre>
      </Card>
    </motion.div>
  );
}

export default FeedbackDashboard;
