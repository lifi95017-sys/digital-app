const fs = require('fs');

function fixErrors(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  content = content.replace(
    /if \(errorMessage\.includes\("404"\) \|\| errorMessage\.includes\("not found"\)\) \{ errorMessage = \`បញ្ហាគណនី \(Account Error\): API Key របស់អ្នកមិនទាន់មានសិទ្ធិប្រើប្រាស់ម៉ូដែលថ្មីនៅឡើយទេ ឬម៉ូដែលមិនត្រូវគ្នា។ សូមចូលទៅកាន់ aistudio\.google\.com ដើម្បីបង្កើត API Key ថ្មីមួយទៀត រួចយកមកបញ្ជូលក្នុង Settings ម្តងទៀត។ \(Error: \$\{errorMessage\}\)\`; \} else \{ errorMessage = \`បញ្ហា AI \(AI Error\): \$\{errorMessage\}\`; \}/g,
    'if (errorMessage.includes("404") || errorMessage.includes("not found")) { errorMessage = `បញ្ហាគណនី (Account Error): API Key របស់អ្នកមិនទាន់មានសិទ្ធិប្រើប្រាស់ម៉ូដែលថ្មីនៅឡើយទេ ឬម៉ូដែលមិនត្រូវគ្នា។ សូមចូលទៅកាន់ aistudio.google.com (ជ្រើសរើស Create API key in a new project) ដើម្បីបង្កើត API Key ថ្មី រួចយកមកបញ្ជូលក្នុង Settings ម្តងទៀត។ (Error: ${errorMessage})`; } else { errorMessage = `បញ្ហា AI (AI Error): ${errorMessage}`; }'
  );
  
  fs.writeFileSync(file, content);
}

fixErrors('server.ts');
fixErrors('api/index.ts');
