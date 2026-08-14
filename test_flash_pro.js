import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.Gemini_API_Key || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY });
async function test() {
  try {
    const res = await ai.models.generateContent({
      model: "gemini-1.5-pro",
      contents: "Hello",
    });
    console.log("Response 1.5 pro:", res.text);
  } catch (e) {
    console.error("1.5 pro error:", e.message);
  }
}
test();
