import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/generateLessonPlan", async (req, res) => {
    try {
      let apiKey = process.env.Gemini_API_Key || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
      if (apiKey === "AI Studio Free Tier" && process.env.Gemini_API_Key) {
        apiKey = process.env.Gemini_API_Key;
      }
      if (apiKey === "AI Studio Free Tier" && process.env.VITE_GEMINI_API_KEY) {
        apiKey = process.env.VITE_GEMINI_API_KEY;
      }
      
      const { lesson, grade, promptText: reqPromptText, isJson, userApiKey } = req.body;
      if (userApiKey) apiKey = userApiKey;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey === "AI Studio Free Tier") {
        return res.status(500).json({ error: "No valid API key provided. Please check your environment variables." });
      }
      const ai = new GoogleGenAI({ apiKey, httpOptions: { headers: { 'User-Agent': 'aistudio-build' } } });

      let finalPromptText = reqPromptText;

      if (!finalPromptText) {
        if (!lesson) {
          return res.status(400).json({ error: "lesson or promptText is required" });
        }

        finalPromptText = `អ្នកគឺជាគ្រូបង្រៀនកម្រិតបឋមសិក្សាដ៏ចំណានម្នាក់។ សូមជួយរៀបចំកិច្ចតែងការបង្រៀន សម្រាប់មុខវិជ្ជា ភាសាខ្មែរ ថ្នាក់ទី ${grade || 4} លើប្រធានបទមេរៀន៖ "${lesson}" ។

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
៥. សូមសរសេរជាទម្រង់ Markdown ដែលមានចំណងជើងច្បាស់លាស់ ងាយស្រួលអាន សម្រាប់ព្រីនលើក្រដាស A4។`;
      }
      let retries = 8;
      let delay = 1000;
      let modelsToTry = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-flash-8b"];
      let currentModelIndex = 0;
      let response = null;
      
      while (retries > 0) {
        try {
          const config: any = {};
          if (isJson) {
            config.responseMimeType = "application/json";
          }
          
          response = await ai.models.generateContent({
            model: modelsToTry[currentModelIndex],
            contents: finalPromptText,
            config: config
          });
          break; // success
        } catch (error: any) {
          retries--;
          const errorMessage = error.message || "";
          console.error(`Model API error with ${modelsToTry[currentModelIndex]} (${errorMessage})`);
          if ((errorMessage.includes("UNAVAILABLE") || errorMessage.includes("high demand") || errorMessage.includes("503") || errorMessage.includes("429") || errorMessage.includes("Quota") || errorMessage.includes("404") || errorMessage.includes("available")) && retries > 0) {
            console.log(`Retrying... (${retries} retries left)`);
            currentModelIndex = (currentModelIndex + 1) % modelsToTry.length;
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 1.25; 
          } else {
            throw error;
          }
        }
      }

      if (!response) {
        throw new Error("Failed to generate content after retries.");
      }
      res.json({ text: response.text });
    } catch (error: any) { console.error("Error in generateLessonPlan:", error.message || error);
      let errorMessage = error.message;
      errorMessage = `បញ្ហា AI (AI Error): ${errorMessage}`;
      res.status(500).json({ error: errorMessage });
    }
  });

  app.post("/api/generatePisaTest", async (req, res) => {
    try {
      let apiKey = process.env.Gemini_API_Key || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
      if (apiKey === "AI Studio Free Tier" && process.env.Gemini_API_Key) {
        apiKey = process.env.Gemini_API_Key;
      }
      if (apiKey === "AI Studio Free Tier" && process.env.VITE_GEMINI_API_KEY) {
        apiKey = process.env.VITE_GEMINI_API_KEY;
      }
      
      const { lesson, grade, subject, userApiKey } = req.body;
      if (userApiKey) apiKey = userApiKey;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey === "AI Studio Free Tier") {
        return res.status(500).json({ error: "No valid API key provided." });
      }
      const ai = new GoogleGenAI({ apiKey, httpOptions: { headers: { 'User-Agent': 'aistudio-build' } } });

      if (!lesson) {
        return res.status(400).json({ error: "lesson is required" });
      }

      let gradeConfig = "";
      if (Number(grade) === 4) {
        gradeConfig = "ពេលវេលា ៤០នាទី, អត្ថបទខ្លីៗ ២ (ប្រហែល ១៧៥ពាក្យ), និង ៩សំណួរ (ពន្យល់ ៣, វាយតម្លៃ/ស៊ើបអង្កេត ៣, បកស្រាយ ៣)។";
      } else if (Number(grade) === 5) {
        gradeConfig = "ពេលវេលា ៥០នាទី, អត្ថបទ ៣ (ប្រហែល ២៥០ពាក្យ), និង ១២សំណួរ (ពន្យល់ ៤, វាយតម្លៃ/ស៊ើបអង្កេត ៤, បកស្រាយ ៤)។";
      } else if (Number(grade) === 6) {
        gradeConfig = "ពេលវេលា ៦០នាទី, អត្ថបទ ៤ (ប្រហែល ២៧៥ពាក្យ), និង ១៥សំណួរ (ពន្យល់ ៥, វាយតម្លៃ/ស៊ើបអង្កេត ៥, បកស្រាយ ៥)។";
      } else {
        gradeConfig = "កម្រិតថ្នាក់ទី " + grade;
      }

      const promptText = `ក្នុងនាមជាអ្នកជំនាញអប់រំ និងជាអ្នករៀបចំតេស្ត PISA ផ្នែកវិទ្យាសាស្ត្រ (Scientific Literacy) សូមសិក្សាពីរចនាសម្ព័ន្ធ និងទម្រង់នៃវិញ្ញាសារតេស្ត PISA ជាមុនសិន។ ត្រូវប្រាកដថាខ្លឹមសារមេរៀន គឺយកតាមសៀវភៅសិក្សាគោលវិទ្យាសាស្ត្ររបស់ក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS) សម្រាប់ថ្នាក់ទី ${grade}។ បន្ទាប់មក សូមបង្កើតទម្រង់តេស្តនេះ ឲ្យស្របទៅនឹងកម្រិតសមត្ថភាព និងការយល់ដឹងរបស់សិស្សបឋមសិក្សាថ្នាក់ទី ${grade}។

សូមបង្កើតវិញ្ញាសារតេស្ត PISA ជាភាសាខ្មែរ សម្រាប់មុខវិជ្ជា ${subject || 'វិទ្យាសាស្ត្រ'} ថ្នាក់ទី ${grade} លើប្រធានបទមេរៀន៖ "${lesson}" (ផ្អែកលើកម្មវិធីសិក្សារបស់ក្រសួងអប់រំ យុវជន និងកីឡា) ។

កំណត់ចំណាំកម្រិតថ្នាក់ (សម្រាប់ថ្នាក់ទី ${grade})៖ 
${gradeConfig} ។

តម្រូវការ៖
១. រៀបចំអត្ថបទផ្ដើមដែលពាក់ព័ន្ធនឹងមេរៀន និងពិពណ៌នាពីបាតុភូត ឬបញ្ហាវិទ្យាសាស្ត្រដែលស្របតាមជីវិតពិត។
២. សំណួរត្រូវវាស់ស្ទង់សមត្ថភាពផ្នែក៖ ការពន្យល់បាតុភូតដោយប្រើវិទ្យាសាស្ត្រ ការវាយតម្លៃនិងការរៀបចំការស៊ើបអង្កេតតាមបែបវិទ្យាសាស្ត្រ និងការបកស្រាយទិន្នន័យ។
៣. ភាសាដែលប្រើត្រូវតែសាមញ្ញ ច្បាស់លាស់ និងងាយយល់សម្រាប់ក្មេងថ្នាក់ទី ${grade}។
៤. សូមផ្តល់ចម្លើយពិត (Multiple Choice) ឬ សំណួរទាមទារការពន្យល់ខ្លីៗ (Short Constructed Response)។
៥. សូមសរសេរជាទម្រង់ Markdown ដែលមានចំណងជើងច្បាស់លាស់ ងាយស្រួលអាន សម្រាប់ព្រីនលើក្រដាស A4។
៦. នៅផ្នែកខាងចុង សូមផ្តល់នូវ "អត្រាកំណែនិងការដាក់ពិន្ទុ (Rubric)" សម្រាប់គ្រូ ឲ្យបានច្បាស់លាស់សម្រាប់គ្រប់សំណួរទាំងអស់។
៧. ចំណាំ៖ ចំពោះប្រភាគ ឬសញ្ញាគណិតវិទ្យា សូមសរសេរជាលេខឬអក្សរធម្មតា (ឧទាហរណ៍៖ 5/8 ឬ ៥/៨)។ ហាមប្រើប្រាស់ទម្រង់កូដ LaTeX (ដូចជា \\frac{5}{8}) ជាដាច់ខាត។`;

      let retries = 8;
      let delay = 1000;
      let modelsToTry = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-flash-8b"];
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
          console.error(`Model API error with ${modelsToTry[currentModelIndex]} (${errorMessage})`);
          if ((errorMessage.includes("UNAVAILABLE") || errorMessage.includes("high demand") || errorMessage.includes("503") || errorMessage.includes("429") || errorMessage.includes("Quota") || errorMessage.includes("404") || errorMessage.includes("available")) && retries > 0) {
            console.log(`Retrying PISA generation... (${retries} retries left)`);
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
             res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
          }
        }
        res.write('data: [DONE]\n\n');
        res.end();
      } catch (err: any) {
        console.error("Error streaming content:", err);
        res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
        res.end();
      }
    } catch (error: any) {
      console.error("Error in generatePisaTest:", error);
      let errorMessage = error.message;
      errorMessage = `បញ្ហា AI (AI Error): ${errorMessage}`;
      res.status(500).json({ error: errorMessage });
    }
  });

  app.post("/api/generateSeaPlmTest", async (req, res) => {
    try {
      let apiKey = process.env.Gemini_API_Key || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
      if (apiKey === "AI Studio Free Tier" && process.env.Gemini_API_Key) {
        apiKey = process.env.Gemini_API_Key;
      }
      if (apiKey === "AI Studio Free Tier" && process.env.VITE_GEMINI_API_KEY) {
        apiKey = process.env.VITE_GEMINI_API_KEY;
      }
      
      const { lesson, grade, subject, userApiKey } = req.body;
      if (userApiKey) apiKey = userApiKey;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey === "AI Studio Free Tier") {
        return res.status(500).json({ error: "No valid API key provided." });
      }
      const ai = new GoogleGenAI({ apiKey, httpOptions: { headers: { 'User-Agent': 'aistudio-build' } } });

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

        promptText = `ក្នុងនាមជាអ្នកជំនាញអប់រំ និងជាអ្នករៀបចំតេស្ត SEA-PLM សូមសិក្សាពីរចនាសម្ព័ន្ធ និងទម្រង់នៃវិញ្ញាសារតេស្ត SEA-PLM ផ្នែកគណិតវិទ្យា ជាមុនសិន។ តេស្ត SEA-PLM ផ្ដោតលើការដោះស្រាយបញ្ហាក្នុងជីវិតពិត។ ត្រូវប្រាកដថាខ្លឹមសារមេរៀន គឺយកតាមសៀវភៅសិក្សាគោលរបស់ក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS) សម្រាប់ថ្នាក់ទី ${grade}។

សូមបង្កើតវិញ្ញាសារតេស្ត SEA-PLM ជាភាសាខ្មែរ សម្រាប់មុខវិជ្ជា ${subject} ថ្នាក់ទី ${grade} លើប្រធានបទមេរៀន៖ "${lesson}" (ផ្អែកលើកម្មវិធីសិក្សារបស់ក្រសួងអប់រំ យុវជន និងកីឡា) ។

កំណត់ចំណាំកម្រិតថ្នាក់ (សម្រាប់ថ្នាក់ទី ${grade})៖ 
${gradeConfig}

តម្រូវការយោងតាមគំរូ SEA-PLM គណិតវិទ្យា៖
១. ខ្លឹមសារ (Content Area): រៀបចំលំហាត់ទាក់ទងនឹង "ចំនួន និងពីជគណិត (Number and algebra)", "រង្វាស់រង្វាល់ និងធរណីមាត្រ (Measurement and geometry)", ឬ "ឱកាស និងទិន្នន័យ (Chance and data)"។
២. ដំណើរការគិត (Cognitive Process): សំណួរត្រូវវាស់ស្ទង់សមត្ថភាព "ការអនុវត្ត (Apply)", "ការបកស្រាយ (Interpret)", ឬ "ការបកប្រែ/ការប្រែក្លាយបញ្ហា (Translate)"។
៣. ទម្រង់សំណួរ (Response Type): ត្រូវមានសំណួរពហុជ្រើសរើស (Multiple Choice) និងសំណួរសរសេរចម្លើយ (Constructed Response)។
៤. ភាសាដែលប្រើត្រូវតែសាមញ្ញ ច្បាស់លាស់ និងងាយយល់សម្រាប់ក្មេងបឋមសិក្សា។
៥. សូមសរសេរជាទម្រង់ Markdown ដែលមានចំណងជើងច្បាស់លាស់ ងាយស្រួលអាន សម្រាប់ព្រីនលើក្រដាស A4។
៦. នៅផ្នែកខាងចុង សូមផ្តល់នូវ "អត្រាកំណែនិងការដាក់ពិន្ទុ (Rubric)" សម្រាប់គ្រូ ឲ្យបានច្បាស់លាស់ (មានចម្លើយ និងកូដពិន្ទុ)។
៧. ចំណាំ៖ ចំពោះប្រភាគ ឬសញ្ញាគណិតវិទ្យា សូមសរសេរជាលេខឬអក្សរធម្មតា (ឧទាហរណ៍៖ 5/8 ឬ ៥/៨)។ ហាមប្រើប្រាស់ទម្រង់កូដ LaTeX (ដូចជា \\frac{5}{8}) ជាដាច់ខាត។`;
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

        promptText = `ក្នុងនាមជាអ្នកជំនាញអប់រំ និងជាអ្នករៀបចំតេស្ត SEA-PLM សូមសិក្សាពីរចនាសម្ព័ន្ធ និងទម្រង់នៃវិញ្ញាសារតេស្ត SEA-PLM ផ្នែកអំណាន (Reading) ជាមុនសិន។ ត្រូវប្រាកដថាខ្លឹមសារអត្ថបទ និងមេរៀន គឺយកតាមសៀវភៅសិក្សាគោលភាសាខ្មែររបស់ក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS) សម្រាប់ថ្នាក់ទី ${grade}។

សូមបង្កើតវិញ្ញាសារតេស្ត SEA-PLM ជាភាសាខ្មែរ សម្រាប់មុខវិជ្ជា ${subject || 'ភាសាខ្មែរ'} ថ្នាក់ទី ${grade} លើប្រធានបទមេរៀន៖ "${lesson}" (ផ្អែកលើកម្មវិធីសិក្សារបស់ក្រសួងអប់រំ យុវជន និងកីឡា) ។

កំណត់ចំណាំកម្រិតថ្នាក់ (សម្រាប់ថ្នាក់ទី ${grade})៖ 
${gradeConfig}

តម្រូវការយោងតាមគំរូ SEA-PLM ផ្នែកអំណាន៖
១. អត្ថបទអាន៖ រៀបចំអត្ថបទអាន ដែលជាអត្ថបទនិទានកថា (Narrative) ឬ អត្ថបទពណ៌នា (Descriptive) ដែលពាក់ព័ន្ធនឹងមេរៀន។ វាអាចជាអត្ថបទបន្តបន្ទាប់ (Continuous) ឬ មិនបន្តបន្ទាប់ (Non-continuous - ដូចជាតារាង)។
២. ដំណើរការគិត (Cognitive Process): សំណួរត្រូវវាស់ស្ទង់សមត្ថភាព "ស្រង់ព័ត៌មាន (Locate)", "បកស្រាយ (Interpret)", និង "ឆ្លុះបញ្ចាំង (Reflect)"។
៣. ទម្រង់សំណួរ (Response Type): ត្រូវមានសំណួរពហុជ្រើសរើស (Multiple Choice) និងសំណួរសរសេរចម្លើយ (Constructed Response)។
៤. ភាសាដែលប្រើត្រូវតែសាមញ្ញ ច្បាស់លាស់ និងងាយយល់។
៥. សូមសរសេរជាទម្រង់ Markdown ដែលមានចំណងជើងច្បាស់លាស់ ងាយស្រួលអាន សម្រាប់ព្រីនលើក្រដាស A4។
៦. នៅផ្នែកខាងចុង សូមផ្តល់នូវ "អត្រាកំណែនិងការដាក់ពិន្ទុ (Rubric)" សម្រាប់គ្រូ ឲ្យបានច្បាស់លាស់។`;
      }

      let retries = 8;
      let delay = 1000;
      let modelsToTry = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-flash-8b"];
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
          console.error(`Model API error with ${modelsToTry[currentModelIndex]} (${errorMessage})`);
          if ((errorMessage.includes("UNAVAILABLE") || errorMessage.includes("high demand") || errorMessage.includes("503") || errorMessage.includes("429") || errorMessage.includes("Quota") || errorMessage.includes("404") || errorMessage.includes("available")) && retries > 0) {
            console.log(`Retrying SEA-PLM generation... (${retries} retries left)`);
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
             res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
          }
        }
        res.write('data: [DONE]\n\n');
        res.end();
      } catch (err: any) {
        console.error("Error streaming content:", err);
        res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
        res.end();
      }
    } catch (error: any) {
      console.error("Error in generateSeaPlmTest:", error);
      let errorMessage = error.message;
      errorMessage = `បញ្ហា AI (AI Error): ${errorMessage}`;
      res.status(500).json({ error: errorMessage });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
