import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf8');

const pisaGenerateReplace = `
      let response;
      let retries = 8;
      let delay = 1000;
      let modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-pro", "gemini-1.5-flash"];
      let currentModelIndex = 0;
      
      while (retries > 0) {
        try {
          response = await ai.models.generateContent({
            model: modelsToTry[currentModelIndex],
            contents: promptText,
          });
          break; // success
        } catch (error) {
          retries--;
          const errorMessage = error.message || "";
          console.error(\`Model API error with \${modelsToTry[currentModelIndex]} (\${errorMessage})\`);
          if ((errorMessage.includes("UNAVAILABLE") || errorMessage.includes("high demand") || errorMessage.includes("503") || errorMessage.includes("429") || errorMessage.includes("Quota")) && retries > 0) {
            console.log(\`Retrying PISA generation... (\${retries} retries left)\`);
            currentModelIndex = (currentModelIndex + 1) % modelsToTry.length;
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 1.25; 
          } else {
            throw error;
          }
        }
      }

      res.json({ text: response.text });
`;

content = content.replace(/      const response = await ai\.models\.generateContent\(\{\n        model: "gemini-3\.1-pro-preview",\n        contents: promptText,\n      \}\);\n\n      res\.json\(\{ text: response\.text \}\);/, pisaGenerateReplace);

fs.writeFileSync('server.ts', content);
