import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf8');

const startIndex = content.indexOf('app.post("/api/generateLessonPlan"');
const endIndex = content.indexOf('app.post("/api/generatePisaTest"');

let handlerContent = content.substring(startIndex, endIndex);

// Change stream logic back to non-streaming
handlerContent = handlerContent.replace(/let stream = null;/g, "let aiResponse = null;");
handlerContent = handlerContent.replace(/stream = await ai.models.generateContentStream/g, "aiResponse = await ai.models.generateContent");

// Now replace the streaming response handling with standard JSON response
const streamResponseStr = `      if (!stream) {
        throw new Error("Failed to generate content after retries.");
      }

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      try {
        for await (const chunk of stream) {
          if (chunk.text) {
             res.write(\`data: \${JSON.stringify({ text: chunk.text })}\\n\\n\`);
          }
        }
        res.write('data: [DONE]\\n\\n');
        res.end();
      } catch (err: any) {
        console.error("Error streaming content:", err);
        res.write(\`data: \${JSON.stringify({ error: err.message })}\\n\\n\`);
        res.end();
      }`;

const newResponseHandling = `      if (!aiResponse) {
        throw new Error("Failed to generate content after retries.");
      }
      res.json({ text: aiResponse.text });`;

handlerContent = handlerContent.replace(streamResponseStr, newResponseHandling);

content = content.substring(0, startIndex) + handlerContent + content.substring(endIndex);

fs.writeFileSync('server.ts', content);
