const fs = require('fs');

const oldLogic = `            try {
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
            }`;

const newLogic = `            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.error) throw new Error(parsed.error);
              if (parsed.text) text += parsed.text;
            } catch (e: any) {
              if (e.message !== "Unexpected end of JSON input" && !e.message.includes("Unexpected token")) {
                throw e; // RE-THROW REAL ERRORS
              }
            }`;

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replaceAll(oldLogic, newLogic);
  fs.writeFileSync(file, content);
}

fix('src/components/LessonPlanForm.tsx');
fix('src/components/WorksheetModal.tsx');
fix('src/components/SlideGeneratorModal.tsx');
