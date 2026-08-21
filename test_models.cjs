const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

async function test() {
  const apiKey = process.env.VITE_GEMINI_API_KEY;
  const ai = new GoogleGenAI({ apiKey, httpOptions: { headers: { 'User-Agent': 'aistudio-build' } } });
  const m = "gemini-1.5-flash";
  try {
    const res = await ai.models.generateContent({
      model: m,
      contents: "Hello",
    });
    console.log("Success:", res.text);
  } catch(e) {
    console.log("Error:", e.message);
  }
}
test();
