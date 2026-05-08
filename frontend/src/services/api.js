import axios from "axios";

const BASE_URL = "https://prepwise-ai-s1gr.onrender.com";

export const generateQuestion = async (role) => {
  const response = await axios.post(`${BASE_URL}/generate`, { role });

  return response;
};

export const analyzeAnswer = async (question, answer) => {
  const response = await axios.post(`${BASE_URL}/feedback`, {
    question,
    answer,
  });

  return response;
};

export const speakText = async (text) => {
  try {
    const response = await fetch(`${BASE_URL}/speak`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      console.log("VOICE FAILED");
      return;
    }

    const blob = await response.blob();

    const audioUrl = URL.createObjectURL(blob);

    const audio = document.createElement("audio");

    audio.src = audioUrl;
    audio.autoplay = true;
    audio.controls = false;

    document.body.appendChild(audio);

    await audio.play();

    console.log("VOICE PLAYING");
  } catch (error) {
    console.log("VOICE ERROR:", error);
  }
};

export const getInterviewHistory = async () => {
  const response = await axios.get(`${BASE_URL}/history`);

  return response;
};
