const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

async function test() {
  const apiKey = process.env.VITE_GEMINI_API_KEY;
  const ai = new GoogleGenAI({ apiKey, httpOptions: { headers: { 'User-Agent': 'aistudio-build' } } });
  try {
    const res = await ai.models.list();
    for await (const m of res) {
      console.log(m.name);
    }
  } catch(e) {
    console.log("Error:", e.message);
  }
}
test();
