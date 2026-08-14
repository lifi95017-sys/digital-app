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

if (content.includes("const { lesson, grade } = req.body;")) {
  console.log("Found target logic.");
  // Let's do string replacement manually on the exact boundaries
  const startIndex = content.indexOf("const { lesson, grade } = req.body;");
  const endIndex = content.indexOf("let retries = 8;", startIndex);
  if (startIndex !== -1 && endIndex !== -1) {
     content = content.substring(0, startIndex) + newLogic + "\n      " + content.substring(endIndex);
  }
}

fs.writeFileSync('server.ts', content);
