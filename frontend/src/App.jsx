import { useEffect, useRef, useState } from "react";

import CustomCursor from "./components/CustomCursor";
import Header from "./components/Header";
import RoleInput from "./components/RoleInput";
import QuestionCard from "./components/QuestionCard";
import VoiceControls from "./components/VoiceControls";
import FeedbackDashboard from "./components/FeedbackDashboard";
import { motion } from "framer-motion";
import ThreeBackground from "./components/ThreeBackground";

import InterviewHistory from "./components/InterviewHistory";

import SplineOrb from "./components/SplineOrb";

import {
  generateQuestion,
  analyzeAnswer,
  speakText,
  getInterviewHistory,
} from "./services/api";

import jsPDF from "jspdf";

function App() {
  const [role, setRole] = useState("Frontend Developer");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [aiState, setAiState] = useState("Idle");
  const [currentSession, setCurrentSession] = useState([]);
  const [savedHistory, setSavedHistory] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);

  const recognitionRef = useRef(null);

  // Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        let transcript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }

        setAnswer(transcript);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // History Fetch Effect
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getInterviewHistory();

        setSavedHistory(res.data.history);
      } catch (error) {
        console.log(error);
      }
    };

    fetchHistory();
  }, [feedback]);

  // Start Listening
  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setListening(true);
      setAiState("Listening");
    }
  };

  // Stop Listening
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
      setAiState("Idle");
    }
  };

  // Generate Question
  const handleGenerateQuestion = async () => {
    setLoading(true);
    setAiState("Thinking");

    try {
      const context = currentSession
        .map(
          (item, index) =>
            `Question ${index + 1}: ${item.question}
Answer ${index + 1}: ${item.answer}`,
        )
        .join("\n\n");

      const enhancedRole = `
Role: ${role}

Previous Interview Context:
${context}

Instructions:
- Ask a realistic follow-up interview question
- If no previous context exists, ask an opening question
- Keep it conversational
- Focus on technical depth
`;

      const res = await generateQuestion(enhancedRole);

      console.log(res.data);

      setQuestion(res.data.question);

      await speakText(res.data.question);

      setAnswer("");
      setFeedback(null);

      setAiState("Speaking");

      setTimeout(() => {
        setAiState("Idle");
      }, 5000);
    } catch (error) {
      console.log(error);
      setAiState("Idle");
    }

    setLoading(false);
  };

  // Analyze Feedback
  const handleFeedback = async () => {
    setLoading(true);

    try {
      const res = await analyzeAnswer(question, answer);

      const text = res.data.feedback;

      const technicalMatch = text.match(/Technical.*?(\d+)/i);

      const communicationMatch = text.match(/Communication.*?(\d+)/i);

      const confidenceMatch = text.match(/Confidence.*?(\d+)/i);

      const overallMatch = text.match(/Overall.*?(\d+)/i);

      setFeedback({
        raw: text,
        technical: technicalMatch ? technicalMatch[1] : 7,
        communication: communicationMatch ? communicationMatch[1] : 7,
        confidence: confidenceMatch ? confidenceMatch[1] : 7,
        overall: overallMatch ? overallMatch[1] : 7,
      });
      setShowFeedback(true);

      setCurrentSession((prev) => [
        ...prev,
        {
          question,
          answer,
          feedback: text,
        },
      ]);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  // Download Function
  const finishInterview = () => {
    try {
      const pdf = new jsPDF();

      pdf.setFontSize(22);
      pdf.text("AI Mock Interview Report", 20, 20);

      pdf.setFontSize(14);
      pdf.text(`Role: ${role}`, 20, 35);

      let y = 50;

      currentSession.forEach((item, index) => {
        pdf.setFontSize(16);
        pdf.text(`Question ${index + 1}`, 20, y);

        y += 10;

        pdf.setFontSize(12);

        const splitQuestion = pdf.splitTextToSize(item.question, 170);

        pdf.text(splitQuestion, 20, y);

        y += splitQuestion.length * 7 + 8;

        pdf.setTextColor(120, 120, 255);

        const splitAnswer = pdf.splitTextToSize(item.answer, 170);

        pdf.text(splitAnswer, 20, y);

        y += splitAnswer.length * 7 + 8;

        pdf.setTextColor(0, 200, 120);

        const splitFeedback = pdf.splitTextToSize(item.feedback, 170);

        pdf.text(splitFeedback, 20, y);

        y += splitFeedback.length * 7 + 20;

        pdf.setTextColor(255, 255, 255);

        // New Page
        if (y > 250) {
          pdf.addPage();
          y = 20;
        }
      });

      pdf.save("Full-Interview-Session.pdf");

      // RESET SESSION
      setQuestion("");
      setAnswer("");
      setFeedback(null);
      setCurrentSession([]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <CustomCursor />
      <ThreeBackground />

      <div className="min-h-screen bg-transparent text-white flex items-center justify-center p-6 overflow-visible relative">
        {/* Main Card */}
        <div className="relative z-10 w-full max-w-7xl bg-zinc-900/45 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* LEFT PANEL */}
            <div className="bg-zinc-900/40 rounded-3xl p-6 backdrop-blur-2xl">
              <Header listening={listening} />

              <SplineOrb listening={listening} />

              <div className="mt-4 text-center">
                <p className="text-zinc-400 text-sm uppercase tracking-widest">
                  AI Interview Status
                </p>

                <div
                  className={`mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-500 ${
                    aiState === "Listening"
                      ? "border-green-500 bg-green-500/10 text-green-400"
                      : aiState === "Thinking"
                      ? "border-yellow-500 bg-yellow-500/10 text-yellow-400"
                      : aiState === "Speaking"
                      ? "border-cyan-500 bg-cyan-500/10 text-cyan-400"
                      : "border-zinc-700 bg-zinc-800 text-zinc-400"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      aiState === "Listening"
                        ? "bg-green-400 animate-pulse"
                        : aiState === "Thinking"
                        ? "bg-yellow-400 animate-pulse"
                        : aiState === "Speaking"
                        ? "bg-cyan-400 animate-pulse"
                        : "bg-zinc-500"
                    }`}
                  ></div>

                  {aiState}
                </div>
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="bg-zinc-900/45 rounded-3xl p-8 backdrop-blur-2xl">
              <RoleInput role={role} setRole={setRole} />

              <button
                onClick={handleGenerateQuestion}
                className="group relative w-full overflow-hidden rounded-2xl p-px transition-all duration-300 hover:scale-[1.01] mt-5"
              >
                <div className="absolute inset-0 bg-linear-to-r from-purple-500 via-cyan-400 to-purple-500 opacity-60 group-hover:opacity-90 blur-md transition-all"></div>

                <div className="relative bg-zinc-900 rounded-2xl px-6 py-4 flex items-center justify-center font-semibold text-white backdrop-blur-xl">
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-white/10 to-transparent"></div>

                  <span className="relative z-10">
                    {loading ? "Generating..." : "Generate Interview Question"}
                  </span>
                </div>
              </button>

              {question && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <QuestionCard question={question} />
                </motion.div>
              )}

              {question && (
                <div className="mt-6">
                  <textarea
                    rows="6"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type or speak your answer..."
                    className="w-full p-4 rounded-2xl bg-zinc-800 border border-zinc-700 outline-none"
                  />
                </div>
              )}

              {question && (
                <VoiceControls
                  startListening={startListening}
                  stopListening={stopListening}
                />
              )}

              {question && (
                <button
                  onClick={handleFeedback}
                  className="group relative w-full mt-5 overflow-hidden rounded-2xl p-px transition-all duration-300 hover:scale-[1.01]"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-green-400 via-emerald-500 to-cyan-400 opacity-60 group-hover:opacity-90 blur-md transition-all"></div>

                  <div className="relative bg-zinc-900 rounded-2xl px-6 py-4 flex items-center justify-center font-semibold text-white backdrop-blur-xl">
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-white/10 to-transparent"></div>

                    <span className="relative z-10">
                      {loading ? "Analyzing..." : "Analyze My Answer"}
                    </span>
                  </div>
                </button>
              )}

              {feedback && (
                <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
                  {/* Header */}
                  <button
                    onClick={() => setShowFeedback(!showFeedback)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-zinc-800/40 transition-all duration-300"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        AI Interview Feedback
                      </h3>

                      <p className="text-sm text-zinc-400 mt-1">
                        Technical analysis, communication review & improvement
                        tips
                      </p>
                    </div>

                    <div
                      className={`text-zinc-400 transition-transform duration-300 ${
                        showFeedback ? "rotate-180" : ""
                      }`}
                    >
                      ▼
                    </div>
                  </button>

                  {/* Expandable Content */}
                  <motion.div
                    initial={false}
                    animate={{
                      height: showFeedback ? "auto" : 0,
                      opacity: showFeedback ? 1 : 0,
                    }}
                    transition={{
                      duration: 0.35,
                    }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 pt-0">
                      <FeedbackDashboard feedback={feedback} />
                    </div>
                  </motion.div>
                </div>
              )}
            </div>
            {currentSession.length > 0 && (
              <button
                onClick={finishInterview}
                className="ignore-pdf w-full mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 transition-all duration-300 px-6 py-4 font-semibold text-red-300"
              >
                Finish Interview & Download Report
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
