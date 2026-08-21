const fs = require('fs');

const sseLogic = `
      if (!response.ok) {
        throw new Error('API request failed');
      }
      
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error('No reader available');
      
      let text = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split('\\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (dataStr === '[DONE]') continue;
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.error) throw new Error(parsed.error);
              if (parsed.text) text += parsed.text;
            } catch (e) {
              if (e.message !== "Unexpected end of JSON input" && e.message !== "Unexpected token") {
                // ignore parse errors for chunks unless it's a real error we threw
                if (dataStr.includes('"error"')) {
                  console.error("Stream error:", dataStr);
                }
              }
            }
          }
        }
      }
`;

function replaceFetchJSON(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  // This is a bit tricky, but basically we want to replace:
  // if (!response.ok) ...
  // const data = await response.json();
  // const text = data.text || '';
  
  // LessonPlanForm.tsx has this twice. Let's do string replacement.
  
  content = content.replace(
    /if \(\!response\.ok\) \{\s+const errData = await response\.json\(\)\.catch\(\(\) => null\);\s+throw new Error\(errData\?\.error \|\| 'API request failed'\);\s+\}\s+const data = await response\.json\(\);\s+const text = data\.text \|\| '';/g,
    sseLogic
  );
  
  // WorksheetModal.tsx
  content = content.replace(
    /if \(\!response\.ok\) throw new Error\('Failed to generate worksheet'\);\s+const data = await response\.json\(\);\s+setContent\(data\.text \|\| ''\);/g,
    sseLogic + "\n      setContent(text);"
  );

  // SlideGeneratorModal.tsx
  content = content.replace(
    /if \(\!response\.ok\) throw new Error\('Failed to generate slides outline'\);\s+const data = await response\.json\(\);\s+let text = data\.text \|\| '';/g,
    sseLogic + "\n"
  );
  
  fs.writeFileSync(file, content);
}

replaceFetchJSON('src/components/LessonPlanForm.tsx');
replaceFetchJSON('src/components/WorksheetModal.tsx');
replaceFetchJSON('src/components/SlideGeneratorModal.tsx');
