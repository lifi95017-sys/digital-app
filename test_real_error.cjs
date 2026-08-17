const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

async function test() {
  const apiKey = process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.log("No API key in env");
    return;
  }
  const ai = new GoogleGenAI({ apiKey, httpOptions: { headers: { 'User-Agent': 'aistudio-build' } } });
  const models = ["gemini-2.0-flash", "gemini-1.5-flash"];
  
  for (const m of models) {
    try {
      console.log(`Trying ${m}...`);
      const res = await ai.models.generateContent({
        model: m,
        contents: "Hello",
        config: { responseMimeType: "application/json" }
      });
      console.log(`Success ${m}:`, res.text);
    } catch (e) {
      console.error(`Error ${m}:`, e.message);
    }
  }
}
test();
