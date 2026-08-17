const fs = require('fs');

function fixErrors(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  // The SDK throws this exact message when the API key doesn't have access to models at all
  // "models/gemini-pro is not found for API version v1beta, or is not supported for generateContent"
  // If ALL models fail, let's catch it when retries drop to 0 or we run out of models to try.
  
  // Actually, wait, the error being displayed on the frontend right now is 
  // Error: {"error":{"code":404,"message":"models/gemini-pro is not found for API version v1beta...
  
  // Let's modify the catch block so that if the error is 404, we *force* the fallback if we haven't tried all models.
  // Wait, if it fails on gemini-pro, that means it *did* try all models.
  // In `modelsToTry`, `gemini-pro` is the LAST model.
  // It tried: gemini-1.5-flash -> gemini-1.5-pro -> gemini-1.0-pro -> gemini-pro
  // And it failed on all of them, ending at gemini-pro!
  
  // Ah! It actually did the fallback! And it failed on the very last one. 
  // The error message says "models/gemini-pro is not found...". This proves the fallback logic WORKS, but the API key doesn't have access to ANY of these models!
  
  // Okay, so in this case, the API key is simply completely broken or restricted for text generation in this project.
  
  // I'll make the error message cleaner. Currently it shows a raw JSON string. 
  content = content.replace(
    /if \(errorMessage\.includes\("404"\) \|\| errorMessage\.includes\("not found"\)\) \{ errorMessage = \`បញ្ហាគណនី \(Account Error\): API Key របស់អ្នកមិនទាន់មានសិទ្ធិប្រើប្រាស់ម៉ូដែលថ្មីនៅឡើយទេ ឬម៉ូដែលមិនត្រូវគ្នា។ សូមចូលទៅកាន់ aistudio\.google\.com \(ជ្រើសរើស Create API key in a new project\) ដើម្បីបង្កើត API Key ថ្មី រួចយកមកបញ្ជូលក្នុង Settings ម្តងទៀត។ \(Error: \$\{errorMessage\}\)\`; \} else \{ errorMessage = \`បញ្ហា AI \(AI Error\): \$\{errorMessage\}\`; \}/g,
    'if (errorMessage.includes("404") || errorMessage.includes("not found")) { errorMessage = `បញ្ហាគណនី (Account Error): API Key របស់អ្នកមិនអាចប្រើប្រាស់មុខងារនេះបានទេ ដោយសារគណនីចាស់ ឬមិនមានសិទ្ធិ។ សូមចូលទៅកាន់ aistudio.google.com (ជ្រើសរើស Create API key in a new project) ដើម្បីបង្កើត API Key ថ្មី រួចយកមកបញ្ជូលក្នុង Settings ម្តងទៀត។`; } else { errorMessage = `បញ្ហា AI (AI Error): ${errorMessage}`; }'
  );
  
  fs.writeFileSync(file, content);
}

fixErrors('server.ts');
fixErrors('api/index.ts');
