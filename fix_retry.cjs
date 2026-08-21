const fs = require('fs');

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    /errorMessage\.includes\("Quota"\)\) && currentModelIndex/g,
    'errorMessage.includes("Quota") || errorMessage.includes("404") || errorMessage.includes("not found")) && currentModelIndex'
  );
  // Also put gemini-2.0-flash as the first model to try, since 1.5-flash seems to be giving 404 for this user.
  content = content.replace(
    /let modelsToTry = \["gemini-1.5-flash", "gemini-2.0-flash", "gemini-2.5-flash", "gemini-pro"\];/g,
    'let modelsToTry = ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-1.5-flash", "gemini-pro"];'
  );
  fs.writeFileSync(file, content);
}

fix('server.ts');
fix('api/index.ts');
