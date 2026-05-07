import os
import requests

from io import BytesIO

from dotenv import load_dotenv

from groq import Groq

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from motor.motor_asyncio import AsyncIOMotorClient


# LOAD ENV
load_dotenv()


# GROQ CLIENT
client_ai = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


# FASTAPI
app = FastAPI()


# MONGODB CONNECTION
client = AsyncIOMotorClient(
    os.getenv("MONGO_URI")
)

db = client["ai_interviewer"]

interviews_collection = db["interviews"]


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# HOME ROUTE
@app.get("/")
def home():
    return {
        "message": "AI Interview Backend Running"
    }


# GENERATE INTERVIEW QUESTION
@app.post("/generate")
async def generate_question(data: dict):

    try:

        role = data.get(
            "role",
            "Frontend Developer"
        )

        prompt = f"""
You are a professional technical interviewer.

Ask ONE interview question for:
{role}

Rules:
- Ask only one question
- Keep it concise
- Make it realistic
- Do not include answers
"""

        response = client_ai.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        question = response.choices[0].message.content

        return {
            "question": question
        }

    except Exception as e:

        print("GENERATE ERROR:", e)

        return {
            "error": str(e)
        }


# ANALYZE CANDIDATE ANSWER
@app.post("/feedback")
async def feedback(data: dict):

    try:

        question = data.get("question")

        answer = data.get("answer")

        prompt = f"""
You are an expert interviewer.

Interview Question:
{question}

Candidate Answer:
{answer}

Analyze the answer based on:

1. Technical Knowledge
2. Communication Skills
3. Confidence
4. Clarity
5. Improvements Needed

Also give:
- Overall Score out of 10
- Short improvement tips

Keep response clean and structured.
"""

        response = client_ai.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        feedback_text = (
            response
            .choices[0]
            .message
            .content
        )

        # SAVE TO MONGODB
        await interviews_collection.insert_one({
            "question": question,
            "answer": answer,
            "feedback": feedback_text
        })

        return {
            "feedback": feedback_text
        }

    except Exception as e:

        print("FEEDBACK ERROR:", e)

        return {
            "error": str(e)
        }


# AI VOICE ROUTE
@app.post("/speak")
async def speak(data: dict):

    try:

        text = data["text"]

        # WORKING ELEVENLABS VOICE
        url = (
            "https://api.elevenlabs.io/v1/"
            "text-to-speech/"
            "pNInz6obpgDQGcFmaJgB"
        )

        headers = {
            "xi-api-key": os.getenv(
                "ELEVENLABS_API_KEY"
            ),
            "Content-Type": "application/json",
            "Accept": "audio/mpeg"
        }

        print("VOICE TEXT:", text)

        payload = {
            "text": text[:500]
            .replace("*", "")
            .replace("#", ""),

            "model_id": "eleven_multilingual_v2",

            "voice_settings": {
                "stability": 0.4,
                "similarity_boost": 0.9
            }
        }

        response = requests.post(
            url,
            json=payload,
            headers=headers
        )

        print(
            "ELEVEN STATUS:",
            response.status_code
        )

        if response.status_code != 200:

            print(
                "ELEVEN ERROR:",
                response.text
            )

            return {
                "error": response.text
            }

        # RETURN AUDIO
        return StreamingResponse(
            BytesIO(response.content),
            media_type="audio/mpeg"
        )

    except Exception as e:

        print("VOICE ERROR:", e)

        return {
            "error": str(e)
        }

# TEST DATABASE
@app.get("/test-db")
async def test_db():

    await interviews_collection.insert_one({
        "test": "MongoDB Connected"
    })

    return {
        "message": "MongoDB working"
    }


# GET INTERVIEW HISTORY
@app.get("/history")
async def get_history():

    history = []

    async for interview in interviews_collection.find().sort("_id", -1):

        history.append({
            "question": interview.get("question"),
            "answer": interview.get("answer"),
            "feedback": interview.get("feedback")
        })

    return {
        "history": history
    }