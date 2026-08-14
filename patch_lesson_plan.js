import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf8');

const oldLogic = `      const { lesson, grade } = req.body;

      if (!lesson) {
        return res.status(400).json({ error: "lesson is required" });
      }

      const promptText = \`អ្នកគឺជាគ្រូបង្រៀនកម្រិតបឋមសិក្សាដ៏ចំណានម្នាក់។ សូមជួយរៀបចំកិច្ចតែងការបង្រៀន សម្រាប់មុខវិជ្ជា ភាសាខ្មែរ ថ្នាក់ទី \${grade || 4} លើប្រធានបទមេរៀន៖ "\${lesson}" ។

សូមសរសេរកិច្ចតែងការនេះ ជាភាសាខ្មែរ ឲ្យបានក្បោះក្បាយ ច្បាស់លាស់ និងមានលក្ខណៈស្តង់ដារ តាមទម្រង់កិច្ចតែងការបង្រៀនរបស់ក្រសួងអប់រំ។

សូមប្រើប្រាស់រចនាសម្ព័ន្ធដូចខាងក្រោម៖
១. វត្ថុបំណងមេរៀន (ចំណេះដឹង, ជំនាញ, និងឥរិយាបថ)
២. សម្ភារៈឧបទេស
៣. ដំណើរការបង្រៀន (សកម្មភាពគ្រូ និងសកម្មភាពសិស្ស)
   - ជំហានទី១: រៀបចំថ្នាក់ (អវត្តមាន អនាម័យ សណ្តាប់ធ្នាប់)
   - ជំហានទី២: រំលឹកមេរៀនចាស់ និងល្បងប្រាជ្ញា (K-W-L)
   - ជំហានទី៣: មេរៀនថ្មី (ការបង្រៀន និងការអនុវត្ត)
   - ជំហានទី៤: ពង្រឹងចំណេះដឹង (សួរគន្លឹះ)
   - ជំហានទី៥: បណ្ដាំផ្ញើ និងកិច្ចការផ្ទះ
៤. ការវាយតម្លៃ
៥. សូមសរសេរជាទម្រង់ Markdown ដែលមានចំណងជើងច្បាស់លាស់ ងាយស្រួលអាន សម្រាប់ព្រីនលើក្រដាស A4។\`;`;

const newLogic = `      const { lesson, grade, promptText: reqPromptText, isJson } = req.body;

      let finalPromptText = reqPromptText;

      if (!finalPromptText) {
        if (!lesson) {
          return res.status(400).json({ error: "lesson or promptText is required" });
        }

        finalPromptText = \`អ្នកគឺជាគ្រូបង្រៀនកម្រិតបឋមសិក្សាដ៏ចំណានម្នាក់។ សូមជួយរៀបចំកិច្ចតែងការបង្រៀន សម្រាប់មុខវិជ្ជា ភាសាខ្មែរ ថ្នាក់ទី \${grade || 4} លើប្រធានបទមេរៀន៖ "\${lesson}" ។

សូមសរសេរកិច្ចតែងការនេះ ជាភាសាខ្មែរ ឲ្យបានក្បោះក្បាយ ច្បាស់លាស់ និងមានលក្ខណៈស្តង់ដារ តាមទម្រង់កិច្ចតែងការបង្រៀនរបស់ក្រសួងអប់រំ។

សូមប្រើប្រាស់រចនាសម្ព័ន្ធដូចខាងក្រោម៖
១. វត្ថុបំណងមេរៀន (ចំណេះដឹង, ជំនាញ, និងឥរិយាបថ)
២. សម្ភារៈឧបទេស
៣. ដំណើរការបង្រៀន (សកម្មភាពគ្រូ និងសកម្មភាពសិស្ស)
   - ជំហានទី១: រៀបចំថ្នាក់ (អវត្តមាន អនាម័យ សណ្តាប់ធ្នាប់)
   - ជំហានទី២: រំលឹកមេរៀនចាស់ និងល្បងប្រាជ្ញា (K-W-L)
   - ជំហានទី៣: មេរៀនថ្មី (ការបង្រៀន និងការអនុវត្ត)
   - ជំហានទី៤: ពង្រឹងចំណេះដឹង (សួរគន្លឹះ)
   - ជំហានទី៥: បណ្ដាំផ្ញើ និងកិច្ចការផ្ទះ
៤. ការវាយតម្លៃ
៥. សូមសរសេរជាទម្រង់ Markdown ដែលមានចំណងជើងច្បាស់លាស់ ងាយស្រួលអាន សម្រាប់ព្រីនលើក្រដាស A4។\`;
      }`;

content = content.replace(oldLogic, newLogic);
content = content.replace(/contents: promptText/g, 'contents: finalPromptText');

// Also, the LessonPlanForm.tsx might pass isJson, which means we might want the output to be strictly JSON.
// If isJson is true, we need to pass responseMimeType: "application/json" to generation config.
const oldGenerateStream = `          stream = await ai.models.generateContentStream({
            model: modelsToTry[currentModelIndex],
            contents: finalPromptText,
          });`;

const newGenerateStream = `          const config: any = {};
          if (isJson) {
            config.responseMimeType = "application/json";
          }
          
          stream = await ai.models.generateContentStream({
            model: modelsToTry[currentModelIndex],
            contents: finalPromptText,
            config: config
          });`;

content = content.replace(oldGenerateStream, newGenerateStream);

fs.writeFileSync('server.ts', content);
