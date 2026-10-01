const fs = require('fs');

let content = fs.readFileSync('server.ts', 'utf8');
content = content.replace(/let modelsToTry = \["gemini-3\.6-flash", "gemini-3\.1-flash", "gemini-3\.0-flash", "gemini-2\.5-flash"\];/g, 'let modelsToTry = ["gemini-3.7-flash", "gemini-3.1-pro-preview", "gemini-3.6-flash"];');
fs.writeFileSync('server.ts', content);

try {
  let contentApi = fs.readFileSync('api/index.ts', 'utf8');
  contentApi = contentApi.replace(/let modelsToTry = \["gemini-3\.6-flash", "gemini-3\.1-flash", "gemini-3\.0-flash", "gemini-2\.5-flash"\];/g, 'let modelsToTry = ["gemini-3.7-flash", "gemini-3.1-pro-preview", "gemini-3.6-flash"];');
  fs.writeFileSync('api/index.ts', contentApi);
} catch(e) {}
