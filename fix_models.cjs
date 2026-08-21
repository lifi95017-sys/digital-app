const fs = require('fs');

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    /let modelsToTry = \["gemini-2.0-flash", "gemini-2.5-flash", "gemini-1.5-flash", "gemini-pro"\];/g,
    'let modelsToTry = ["gemini-3.6-flash", "gemini-3.1-flash", "gemini-3.0-flash", "gemini-2.5-flash"];'
  );
  fs.writeFileSync(file, content);
}

fix('server.ts');
fix('api/index.ts');
