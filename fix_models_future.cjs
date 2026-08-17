const fs = require('fs');

function fixModels(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    /let modelsToTry = \[.*?\];/g,
    'let modelsToTry = ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-3.0-flash", "gemini-3.1-flash", "gemini-1.5-flash", "gemini-1.5-flash-8b", "gemini-pro"];'
  );
  fs.writeFileSync(file, content);
}

fixModels('server.ts');
fixModels('api/index.ts');
