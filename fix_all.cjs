const fs = require('fs');

function replaceWhileLoop(content, customTryBody) {
  const pattern = /let (\w+) = '';\s*let buffer = '';\s*while \(true\) \{[\s\S]*?\}\s*\}\s*\}\s*\}/g;
  return content.replace(pattern, (match, varName) => {
    return `let ${varName} = '';
      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          if (line.trim().startsWith('data: ')) {
            const dataStr = line.trim().slice(6).trim();
            if (dataStr === '[DONE]') continue;
            try {
              const parsed = JSON.parse(dataStr);
${customTryBody}
            } catch (e: any) {
              console.error("Error parsing JSON chunk:", e, "Chunk:", dataStr);
            }
          }
        }
      }`;
  });
}

function processFile(file, customTryBody) {
  let content = fs.readFileSync(file, 'utf8');
  content = replaceWhileLoop(content, customTryBody);
  fs.writeFileSync(file, content);
}

processFile('src/components/LessonPlanForm.tsx', '              if (parsed.error) throw new Error(parsed.error);\n              if (parsed.text) text += parsed.text;');
processFile('src/components/PisaTestView.tsx', '              if (parsed.error) throw new Error(parsed.error);\n              if (parsed.text) { fullText += parsed.text; setGeneratedText(fullText); }');
processFile('src/components/SeaPlmTestView.tsx', '              if (parsed.error) throw new Error(parsed.error);\n              if (parsed.text) { fullText += parsed.text; setGeneratedText(fullText); }');
processFile('src/components/WorksheetModal.tsx', '              if (parsed.error) throw new Error(parsed.error);\n              if (parsed.text) { fullText += parsed.text; setGeneratedText(fullText); }');
processFile('src/components/SlideGeneratorModal.tsx', '              if (parsed.error) throw new Error(parsed.error);\n              if (parsed.text) { fullText += parsed.text; setGeneratedText(fullText); }');

