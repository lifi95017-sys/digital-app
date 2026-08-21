const fs = require('fs');

function updateServer(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace response.text generation with stream
  const target = `      let response = null;
      
      while (retries > 0) {
        try {
          const config: any = {};
          if (isJson) {
            config.responseMimeType = "application/json";
          }
          
          response = await ai.models.generateContent({
            model: modelsToTry[currentModelIndex],
            contents: finalPromptText,
            config: config
          });
          break; // success
        } catch (error: any) {`;

  const replacement = `      let stream = null;
      
      while (retries > 0) {
        try {
          const config: any = {};
          if (isJson) {
            config.responseMimeType = "application/json";
          }
          
          stream = await ai.models.generateContentStream({
            model: modelsToTry[currentModelIndex],
            contents: finalPromptText,
            config: config
          });
          break; // success
        } catch (error: any) {`;
        
  content = content.replace(target, replacement);
  
  const target2 = `      if (!response) {
        throw new Error("Failed to generate content after retries.");
      }
      res.json({ text: response.text });
    } catch (error: any) {`;
    
  const replacement2 = `      if (!stream) {
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
      }
    } catch (error: any) {`;
    
  content = content.replace(target2, replacement2);
  fs.writeFileSync(file, content);
}

try { updateServer('server.ts'); } catch (e) { console.error(e); }
try { updateServer('api/index.ts'); } catch (e) { console.error(e); }
