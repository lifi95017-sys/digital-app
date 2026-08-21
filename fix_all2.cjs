const fs = require('fs');

function processLessonPlanForm() {
  let content = fs.readFileSync('src/components/LessonPlanForm.tsx', 'utf8');
  
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

  fs.writeFileSync('src/components/LessonPlanForm.tsx', content);
}

function processPisaTestView() {
  let content = fs.readFileSync('src/components/PisaTestView.tsx', 'utf8');
  content = content.replace(/let fullText = '';\s*let buffer = '';[\s\S]*?\}\s*catch\s*\(err\)\s*\{/g, 
`let fullText = '';
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
              if (parsed.text) {
                fullText += parsed.text;
                setGeneratedText(fullText);
              }
            } catch (e: any) {
            }
          }
        }
      }
    } catch (err) {`);
  fs.writeFileSync('src/components/PisaTestView.tsx', content);
}

function processSeaPlmTestView() {
  let content = fs.readFileSync('src/components/SeaPlmTestView.tsx', 'utf8');
  content = content.replace(/let fullText = '';\s*let buffer = '';[\s\S]*?\}\s*catch\s*\(err\)\s*\{/g, 
`let fullText = '';
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
              if (parsed.text) {
                fullText += parsed.text;
                setGeneratedText(fullText);
              }
            } catch (e: any) {
            }
          }
        }
      }
    } catch (err) {`);
  fs.writeFileSync('src/components/SeaPlmTestView.tsx', content);
}

processLessonPlanForm();
processPisaTestView();
processSeaPlmTestView();

