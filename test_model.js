import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

async function test() {
  const apiKey = process.env.Gemini_API_Key || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  const ai = new GoogleGenAI({ apiKey });
  try {
    const res = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Hello"
    });
    console.log("2.5-flash OK:", res.text);
  } catch (e) {
    console.log("2.5-flash ERROR:", e.message);
  }
}
test();
