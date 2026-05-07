import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";

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

      body: JSON.stringify({
        text,
      }),
    });

    if (!response.ok) {
      console.log("VOICE FAILED");
      return;
    }

    const blob = await response.blob();

    console.log(blob);

    const audioUrl = window.URL.createObjectURL(blob);

    const audio = new Audio(audioUrl);

    audio.volume = 1;

    audio.oncanplaythrough = async () => {
      try {
        await audio.play();
      } catch (err) {
        console.log("PLAY ERROR:", err);
      }
    };
  } catch (error) {
    console.log("VOICE ERROR:", error);
  }
};

export const getInterviewHistory = async () => {
  const response = await axios.get(`${BASE_URL}/history`);

  return response;
};
