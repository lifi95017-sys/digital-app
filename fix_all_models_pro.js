import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf8');
content = content.replace(/let modelsToTry = \[.*?\];/g, 'let modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.5-pro", "gemini-3.1-pro-preview"];');
fs.writeFileSync('server.ts', content);
