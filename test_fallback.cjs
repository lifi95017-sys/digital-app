const { GoogleGenAI } = require("@google/genai");

async function run() {
  const ai = new GoogleGenAI({ apiKey: "some_fake_key" });
  let modelsToTry = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro", "gemini-pro"];
  let currentModelIndex = 0;
  let retries = 8;
  
  while (retries > 0) {
    try {
      console.log("Trying model: ", modelsToTry[currentModelIndex]);
      await ai.models.generateContent({
        model: modelsToTry[currentModelIndex],
        contents: "Hello",
      });
      console.log("Success!");
      break;
    } catch (error) {
      retries--;
      const errorMessage = error.message || "";
      console.log("Error:", errorMessage);
      if ((errorMessage.includes("UNAVAILABLE") || errorMessage.includes("high demand") || errorMessage.includes("503") || errorMessage.includes("429") || errorMessage.includes("Quota") || errorMessage.includes("404") || errorMessage.includes("available")) && retries > 0) {
         currentModelIndex = (currentModelIndex + 1) % modelsToTry.length;
         console.log("Falling back to next model...");
      } else {
         console.log("Terminal error. Stopping.");
         break;
      }
    }
  }
}
run();
