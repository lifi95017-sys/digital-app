const fs = require('fs');
for (const file of ['src/components/SlideGeneratorModal.tsx', 'src/components/WorksheetModal.tsx']) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/if \(parsed\.text\) \{ fullText \+= parsed\.text; setGeneratedText\(fullText\); \}/g, 'if (parsed.text) text += parsed.text;');
  fs.writeFileSync(file, content);
}
