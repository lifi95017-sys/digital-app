const fs = require('fs');
function patchFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    /const \{ lesson, grade, promptText: reqPromptText, isJson \} = req\.body;/g,
    'const { lesson, grade, promptText: reqPromptText, isJson, userApiKey } = req.body;\n      if (userApiKey) apiKey = userApiKey;\n      const ai = new GoogleGenAI({ apiKey, httpOptions: { headers: { \'User-Agent\': \'aistudio-build\' } } });'
  );
  // remove the old ai instance creation
  content = content.replace(
    /const ai = new GoogleGenAI\(\{ apiKey, httpOptions: \{ headers: \{ 'User-Agent': 'aistudio-build' \} \} \}\);\s*const \{ lesson, grade, promptText: reqPromptText, isJson, userApiKey \} = req\.body;/g,
    'const { lesson, grade, promptText: reqPromptText, isJson, userApiKey } = req.body;'
  );

  content = content.replace(
    /const \{ lesson, grade, subject \} = req\.body;/g,
    'const { lesson, grade, subject, userApiKey } = req.body;\n      if (userApiKey) apiKey = userApiKey;\n      const ai = new GoogleGenAI({ apiKey, httpOptions: { headers: { \'User-Agent\': \'aistudio-build\' } } });'
  );
  content = content.replace(
    /const ai = new GoogleGenAI\(\{ apiKey, httpOptions: \{ headers: \{ 'User-Agent': 'aistudio-build' \} \} \}\);\s*const \{ lesson, grade, subject, userApiKey \} = req\.body;/g,
    'const { lesson, grade, subject, userApiKey } = req.body;'
  );
  fs.writeFileSync(file, content);
}
patchFile('api/index.ts');
patchFile('server.ts');
