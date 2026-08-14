import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.Gemini_API_Key || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY });
async function test() {
  try {
    const res = await ai.models.list();
    for await (const m of res) {
      console.log(m.name);
    }
  } catch (e) {
    console.error("error:", e);
  }
}
test();
