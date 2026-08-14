import fs from 'fs';
let content = fs.readFileSync('server.ts', 'utf8');

// The function app.post("/api/generateLessonPlan" goes until app.post("/api/generatePisaTest"
const startIndex = content.indexOf('app.post("/api/generateLessonPlan"');
const endIndex = content.indexOf('app.post("/api/generatePisaTest"');

let lessonPlanCode = content.substring(startIndex, endIndex);

lessonPlanCode = lessonPlanCode.replace(/contents: promptText/g, "contents: finalPromptText");

const oldStream = `stream = await ai.models.generateContentStream({
            model: modelsToTry[currentModelIndex],
            contents: finalPromptText,
          });`;
          
const newStream = `const config: any = {};
          if (isJson) {
            config.responseMimeType = "application/json";
          }
          stream = await ai.models.generateContentStream({
            model: modelsToTry[currentModelIndex],
            contents: finalPromptText,
            config: config
          });`;

lessonPlanCode = lessonPlanCode.replace(oldStream, newStream);

content = content.substring(0, startIndex) + lessonPlanCode + content.substring(endIndex);
fs.writeFileSync('server.ts', content);
