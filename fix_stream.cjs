const fs = require('fs');

const streamLogicOld = `
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
            } catch (e: any) {
              if (e.message !== "Unexpected end of JSON input" && !e.message.includes("Unexpected token")) {
                throw e; // RE-THROW REAL ERRORS
              }
            }
          }
        }
      }
`;

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // A generic replacer for the pattern:
  // let [varname] = '';
  // while (true) { ... await reader.read(); ... decoder.decode ... split('\n') ... JSON.parse ... }
  
  const pattern = /let (\w+) = '';\s*while\s*\(true\)\s*\{\s*const\s*\{\s*done,\s*value\s*\}\s*=\s*await\s*reader\.read\(\);\s*if\s*\(done\)\s*break;\s*const\s*chunk\s*=\s*decoder\.decode\(value\);\s*const\s*lines\s*=\s*chunk\.split\('\\n'\);\s*for\s*\(const\s*line\s*of\s*lines\)\s*\{\s*if\s*\(line\.startsWith\('data:\s*'\)\)\s*\{\s*const\s*dataStr\s*=\s*line\.slice\(6\);\s*if\s*\(dataStr\s*===\s*'\[DONE\]'\)\s*continue;\s*try\s*\{\s*const\s*parsed\s*=\s*JSON\.parse\(dataStr\);([\s\S]*?)catch\s*\(e[^)]*\)\s*\{[\s\S]*?\}\s*\}\s*\}\s*\}/g;

  content = content.replace(pattern, (match, varName, innerTryBody) => {
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
              const parsed = JSON.parse(dataStr);${innerTryBody}            } catch (e: any) {
              console.error("Error parsing JSON chunk:", e, "Chunk:", dataStr);
            }
          }
        }
      }`;
  });
  
  fs.writeFileSync(filePath, content);
}

replaceInFile('src/components/LessonPlanForm.tsx');
replaceInFile('src/components/PisaTestView.tsx');
replaceInFile('src/components/SeaPlmTestView.tsx');
replaceInFile('src/components/WorksheetModal.tsx');
replaceInFile('src/components/SlideGeneratorModal.tsx');
console.log('Stream fixing done');
