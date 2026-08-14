import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf8');

// Fix PISA Test configuration (it's mostly fine, but let's make sure it matches user exactly)
const pisaOldConfig = `      if (Number(grade) === 4) {
        gradeConfig = "ពេលវេលា ៤០នាទី, មានអត្ថបទខ្លីៗ (ប្រហែល ១៧៥ពាក្យ) ចំនួន ២អត្ថបទ, និងសំណួរសរុបចំនួន ៩ ដែលបែងចែកជា៖ ពន្យល់បាតុភូត ៣សំណួរ, ការវាយតម្លៃនិងការរៀបចំការស៊ើបអង្កេត ៣សំណួរ, ការបកស្រាយទិន្នន័យ ៣សំណួរ";
      } else if (Number(grade) === 5) {
        gradeConfig = "ពេលវេលា ៥០នាទី, មានអត្ថបទ (ប្រហែល ២៥០ពាក្យ) ចំនួន ៣អត្ថបទ, និងសំណួរសរុបចំនួន ១២ ដែលបែងចែកជា៖ ពន្យល់បាតុភូត ៤សំណួរ, ការវាយតម្លៃនិងការរៀបចំការស៊ើបអង្កេត ៤សំណួរ, ការបកស្រាយទិន្នន័យ ៤សំណួរ";
      } else if (Number(grade) === 6) {
        gradeConfig = "ពេលវេលា ៦០នាទី, មានអត្ថបទ (ប្រហែល ២៧៥ពាក្យ) ចំនួន ៤អត្ថបទ, និងសំណួរសរុបចំនួន ១៥ ដែលបែងចែកជា៖ ពន្យល់បាតុភូត ៥សំណួរ, ការវាយតម្លៃនិងការរៀបចំការស៊ើបអង្កេត ៥សំណួរ, ការបកស្រាយទិន្នន័យ ៥សំណួរ";
      }`;
      
const pisaNewConfig = `      if (Number(grade) === 4) {
        gradeConfig = "ពេលវេលា ៤០នាទី, អត្ថបទខ្លីៗ ២ (ប្រហែល ១៧៥ពាក្យ), និង ៩សំណួរ (ពន្យល់ ៣, វាយតម្លៃ/ស៊ើបអង្កេត ៣, បកស្រាយ ៣)។";
      } else if (Number(grade) === 5) {
        gradeConfig = "ពេលវេលា ៥០នាទី, អត្ថបទ ៣ (ប្រហែល ២៥០ពាក្យ), និង ១២សំណួរ (ពន្យល់ ៤, វាយតម្លៃ/ស៊ើបអង្កេត ៤, បកស្រាយ ៤)។";
      } else if (Number(grade) === 6) {
        gradeConfig = "ពេលវេលា ៦០នាទី, អត្ថបទ ៤ (ប្រហែល ២៧៥ពាក្យ), និង ១៥សំណួរ (ពន្យល់ ៥, វាយតម្លៃ/ស៊ើបអង្កេត ៥, បកស្រាយ ៥)។";
      }`;

content = content.replace(pisaOldConfig, pisaNewConfig);

// Rewrite the SEA-PLM Test generator logic entirely to ensure it uses the provided document's structure
const seaplmStart = content.indexOf('app.post("/api/generateSeaPlmTest"');
const seaplmEnd = content.indexOf('  // Vite middleware for development');

const newSeaplmHandler = `app.post("/api/generateSeaPlmTest", async (req, res) => {
    try {
      let apiKey = process.env.Gemini_API_Key || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
      if (apiKey === "AI Studio Free Tier" && process.env.Gemini_API_Key) {
        apiKey = process.env.Gemini_API_Key;
      }
      if (apiKey === "AI Studio Free Tier" && process.env.VITE_GEMINI_API_KEY) {
        apiKey = process.env.VITE_GEMINI_API_KEY;
      }
      
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey === "AI Studio Free Tier") {
        return res.status(500).json({ error: "No valid API key provided." });
      }

      const ai = new GoogleGenAI({ apiKey, httpOptions: { headers: { 'User-Agent': 'aistudio-build' } } });
      const { lesson, grade, subject } = req.body;

      if (!lesson) {
        return res.status(400).json({ error: "lesson is required" });
      }

      let gradeConfig = "";
      let promptText = "";

      if (subject === 'គណិតវិទ្យា') {
        if (Number(grade) === 4) {
          gradeConfig = "រយៈពេល ៤០នាទី, លំហាត់សមស្របនឹងសមត្ថភាពសិស្សថ្នាក់ទី៤";
        } else if (Number(grade) === 5) {
          gradeConfig = "រយៈពេល ៥០នាទី, លំហាត់សមស្របនឹងសមត្ថភាពសិស្សថ្នាក់ទី៥";
        } else if (Number(grade) === 6) {
          gradeConfig = "រយៈពេល ៦០នាទី, លំហាត់សមស្របនឹងសមត្ថភាពសិស្សថ្នាក់ទី៦";
        } else {
          gradeConfig = "កម្រិតថ្នាក់ទី " + grade;
        }

        promptText = \`ក្នុងនាមជាអ្នកជំនាញអប់រំ និងជាអ្នករៀបចំតេស្ត SEA-PLM សូមសិក្សាពីរចនាសម្ព័ន្ធ និងទម្រង់នៃវិញ្ញាសារតេស្ត SEA-PLM ផ្នែកគណិតវិទ្យា ជាមុនសិន។ តេស្ត SEA-PLM ផ្ដោតលើការដោះស្រាយបញ្ហាក្នុងជីវិតពិត។

សូមបង្កើតវិញ្ញាសារតេស្ត SEA-PLM ជាភាសាខ្មែរ សម្រាប់មុខវិជ្ជា \${subject} ថ្នាក់ទី \${grade} លើប្រធានបទមេរៀន៖ "\${lesson}" ។

កំណត់ចំណាំកម្រិតថ្នាក់ (សម្រាប់ថ្នាក់ទី \${grade})៖ 
\${gradeConfig}

តម្រូវការយោងតាមគំរូ SEA-PLM គណិតវិទ្យា៖
១. ខ្លឹមសារ (Content Area): រៀបចំលំហាត់ទាក់ទងនឹង "ចំនួន និងពីជគណិត (Number and algebra)", "រង្វាស់រង្វាល់ និងធរណីមាត្រ (Measurement and geometry)", ឬ "ឱកាស និងទិន្នន័យ (Chance and data)"។
២. ដំណើរការគិត (Cognitive Process): សំណួរត្រូវវាស់ស្ទង់សមត្ថភាព "ការអនុវត្ត (Apply)", "ការបកស្រាយ (Interpret)", ឬ "ការបកប្រែ/ការប្រែក្លាយបញ្ហា (Translate)"។
៣. ទម្រង់សំណួរ (Response Type): ត្រូវមានសំណួរពហុជ្រើសរើស (Multiple Choice) និងសំណួរសរសេរចម្លើយ (Constructed Response)។
៤. ភាសាដែលប្រើត្រូវតែសាមញ្ញ ច្បាស់លាស់ និងងាយយល់សម្រាប់ក្មេងបឋមសិក្សា។
៥. សូមសរសេរជាទម្រង់ Markdown ដែលមានចំណងជើងច្បាស់លាស់ ងាយស្រួលអាន សម្រាប់ព្រីនលើក្រដាស A4។
៦. នៅផ្នែកខាងចុង សូមផ្តល់នូវ "អត្រាកំណែនិងការដាក់ពិន្ទុ (Rubric)" សម្រាប់គ្រូ ឲ្យបានច្បាស់លាស់ (មានចម្លើយ និងកូដពិន្ទុ)។\`;
      } else {
        if (Number(grade) === 4) {
          gradeConfig = "រយៈពេល ៤០នាទី, អត្ថបទអានសមស្របនឹងសមត្ថភាពសិស្សថ្នាក់ទី៤";
        } else if (Number(grade) === 5) {
          gradeConfig = "រយៈពេល ៥០នាទី, អត្ថបទអានសមស្របនឹងសមត្ថភាពសិស្សថ្នាក់ទី៥";
        } else if (Number(grade) === 6) {
          gradeConfig = "រយៈពេល ៦០នាទី, អត្ថបទអានសមស្របនឹងសមត្ថភាពសិស្សថ្នាក់ទី៦";
        } else {
          gradeConfig = "កម្រិតថ្នាក់ទី " + grade;
        }

        promptText = \`ក្នុងនាមជាអ្នកជំនាញអប់រំ និងជាអ្នករៀបចំតេស្ត SEA-PLM សូមសិក្សាពីរចនាសម្ព័ន្ធ និងទម្រង់នៃវិញ្ញាសារតេស្ត SEA-PLM ផ្នែកអំណាន (Reading) ជាមុនសិន។ 

សូមបង្កើតវិញ្ញាសារតេស្ត SEA-PLM ជាភាសាខ្មែរ សម្រាប់មុខវិជ្ជា \${subject || 'ភាសាខ្មែរ'} ថ្នាក់ទី \${grade} លើប្រធានបទមេរៀន៖ "\${lesson}" ។

កំណត់ចំណាំកម្រិតថ្នាក់ (សម្រាប់ថ្នាក់ទី \${grade})៖ 
\${gradeConfig}

តម្រូវការយោងតាមគំរូ SEA-PLM ផ្នែកអំណាន៖
១. អត្ថបទអាន៖ រៀបចំអត្ថបទអាន ដែលជាអត្ថបទនិទានកថា (Narrative) ឬ អត្ថបទពណ៌នា (Descriptive) ដែលពាក់ព័ន្ធនឹងមេរៀន។ វាអាចជាអត្ថបទបន្តបន្ទាប់ (Continuous) ឬ មិនបន្តបន្ទាប់ (Non-continuous - ដូចជាតារាង)។
២. ដំណើរការគិត (Cognitive Process): សំណួរត្រូវវាស់ស្ទង់សមត្ថភាព "ស្រង់ព័ត៌មាន (Locate)", "បកស្រាយ (Interpret)", និង "ឆ្លុះបញ្ចាំង (Reflect)"។
៣. ទម្រង់សំណួរ (Response Type): ត្រូវមានសំណួរពហុជ្រើសរើស (Multiple Choice) និងសំណួរសរសេរចម្លើយ (Constructed Response)។
៤. ភាសាដែលប្រើត្រូវតែសាមញ្ញ ច្បាស់លាស់ និងងាយយល់។
៥. សូមសរសេរជាទម្រង់ Markdown ដែលមានចំណងជើងច្បាស់លាស់ ងាយស្រួលអាន សម្រាប់ព្រីនលើក្រដាស A4។
៦. នៅផ្នែកខាងចុង សូមផ្តល់នូវ "អត្រាកំណែនិងការដាក់ពិន្ទុ (Rubric)" សម្រាប់គ្រូ ឲ្យបានច្បាស់លាស់។\`;
      }

      let retries = 8;
      let delay = 1000;
      let modelsToTry = ["gemini-2.5-flash", "gemini-3.1-pro-preview"];
      let currentModelIndex = 0;
      let stream = null;
      
      while (retries > 0) {
        try {
          stream = await ai.models.generateContentStream({
            model: modelsToTry[currentModelIndex],
            contents: promptText,
          });
          break; // success
        } catch (error: any) {
          retries--;
          const errorMessage = error.message || "";
          console.error(\`Model API error with \${modelsToTry[currentModelIndex]} (\${errorMessage})\`);
          if ((errorMessage.includes("UNAVAILABLE") || errorMessage.includes("high demand") || errorMessage.includes("503") || errorMessage.includes("429") || errorMessage.includes("Quota")) && retries > 0) {
            console.log(\`Retrying SEA-PLM generation... (\${retries} retries left)\`);
            currentModelIndex = (currentModelIndex + 1) % modelsToTry.length;
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 1.25; 
          } else {
            throw error;
          }
        }
      }

      if (!stream) {
        throw new Error("Failed to generate content after retries.");
      }

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      try {
        for await (const chunk of stream) {
          if (chunk.text) {
             res.write(\`data: \${JSON.stringify({ text: chunk.text })}\\n\\n\`);
          }
        }
        res.write('data: [DONE]\\n\\n');
        res.end();
      } catch (err: any) {
        console.error("Error streaming content:", err);
        res.write(\`data: \${JSON.stringify({ error: err.message })}\\n\\n\`);
        res.end();
      }
    } catch (error: any) {
      console.error("Error in generateSeaPlmTest:", error);
      let errorMessage = error.message;
      if (errorMessage.includes("UNAVAILABLE") || errorMessage.includes("high demand") || errorMessage.includes("503")) {
        errorMessage = "ប្រព័ន្ធ AI កំពុងមានអ្នកប្រើប្រាស់ច្រើន (High Demand)។ សូមរង់ចាំបន្តិច រួចព្យាយាមម្ដងទៀត។";
      }
      res.status(500).json({ error: errorMessage });
    }
  });

`;

content = content.substring(0, seaplmStart) + newSeaplmHandler + content.substring(seaplmEnd);

fs.writeFileSync('server.ts', content);
