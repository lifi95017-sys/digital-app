const fs = require('fs');

function fixFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace LessonPlan
  content = content.replace(
    /if \(!apiKey \|\| apiKey === "MY_GEMINI_API_KEY" \|\| apiKey === "AI Studio Free Tier"\) \{\s*return res\.status\(500\)\.json\(\{ error: "No valid API key provided\. Please check your environment variables\." \}\);\s*\}\s*const \{ lesson, grade, promptText: reqPromptText, isJson, userApiKey \} = req\.body;\s*if \(userApiKey\) apiKey = userApiKey;/g,
    'const { lesson, grade, promptText: reqPromptText, isJson, userApiKey } = req.body;\n      if (userApiKey) apiKey = userApiKey;\n      if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey === "AI Studio Free Tier") {\n        return res.status(500).json({ error: "No valid API key provided. Please check your environment variables." });\n      }'
  );
  
  // Replace Pisa and SeaPlm
  content = content.replace(
    /if \(!apiKey \|\| apiKey === "MY_GEMINI_API_KEY" \|\| apiKey === "AI Studio Free Tier"\) \{\s*return res\.status\(500\)\.json\(\{ error: "No valid API key provided\." \}\);\s*\}\s*const \{ lesson, grade, subject, userApiKey \} = req\.body;\s*if \(userApiKey\) apiKey = userApiKey;/g,
    'const { lesson, grade, subject, userApiKey } = req.body;\n      if (userApiKey) apiKey = userApiKey;\n      if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey === "AI Studio Free Tier") {\n        return res.status(500).json({ error: "No valid API key provided." });\n      }'
  );

  fs.writeFileSync(file, content);
}

fixFile('api/index.ts');
fixFile('server.ts');
