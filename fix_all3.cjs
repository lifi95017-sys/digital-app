const fs = require('fs');
function processOther() {
  const files = ['src/components/WorksheetModal.tsx', 'src/components/SlideGeneratorModal.tsx'];
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/let text = '';\s*let buffer = '';[\s\S]*?cleanedText = text\.replace/g, 
`let text = '';
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
              if (parsed.error) throw new Error(parsed.error);
              if (parsed.text) text += parsed.text;
            } catch (e: any) {
              // ignore partial chunks
            }
          }
        }
      }
      
      let cleanedText = text.replace`);
      
    // Slide generator and worksheet modal use `let text = ''` and then `cleanedText = text.replace` ?? Let's check!
    // Actually they might use `fullText`. 
    // Let me check what variables they use.
    fs.writeFileSync(file, content);
  }
}
processOther();
