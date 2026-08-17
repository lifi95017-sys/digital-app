const fs = require('fs');

function fixModels(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    /let modelsToTry = \["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-flash-8b"\];/g,
    'let modelsToTry = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro", "gemini-pro"];'
  );
  
  // also let's update the catch block to provide a better message for 404
  content = content.replace(
    /errorMessage = \`បញ្ហា AI \\(AI Error\\): \$\{errorMessage\}\`;/g,
    'if (errorMessage.includes("404") || errorMessage.includes("not found")) { errorMessage = `បញ្ហា AI: API Key របស់អ្នកមិនមានសិទ្ធិប្រើប្រាស់ជំនាន់ថ្មីទេ។ សូមចូលទៅកាន់ aistudio.google.com ដើម្បីបង្កើត API Key ថ្មី រួចយកមកដាក់ក្នុង Settings។ (Error: ${errorMessage})`; } else { errorMessage = `បញ្ហា AI (AI Error): ${errorMessage}`; }'
  );
  
  fs.writeFileSync(file, content);
}

fixModels('server.ts');
fixModels('api/index.ts');
