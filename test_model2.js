import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

async function test() {
  const apiKey = process.env.Gemini_API_Key || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  const ai = new GoogleGenAI({ apiKey });
  const models = ["gemini-3.1-pro-preview", "gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
  for (const m of models) {
    try {
      const res = await ai.models.generateContent({
        model: m,
        contents: "Hello"
      });
      console.log(m, "OK:", res.text.slice(0, 10));
    } catch (e) {
      console.log(m, "ERROR:", e.message);
    }
  }
}
test();
