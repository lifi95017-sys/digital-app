const fs = require('fs');

function fixModels(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    /let modelsToTry = \["gemini-1.5-flash", "gemini-1.5-pro"\];/g,
    'let modelsToTry = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-flash-8b"];'
  );
  fs.writeFileSync(file, content);
}

fixModels('server.ts');
fixModels('api/index.ts');
