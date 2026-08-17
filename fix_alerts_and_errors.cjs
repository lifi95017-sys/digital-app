const fs = require('fs');

function fixFrontendAlert(file) {
  let content = fs.readFileSync(file, 'utf8');
  // Replace the hardcoded alert with just the error message from the backend
  content = content.replace(
    /alert\(`មានបញ្ហាក្នុងការបង្កើតកិច្ចតែងការ៖ \$\{error\.message \|\| "AI API Error"\}\\n\\n\(បញ្ជាក់៖ គណនីឥតគិតថ្លៃប្រចាំថ្ងៃប្រហែលជាអស់កូតាហើយ។ សូមចូលទៅកាន់ Settings ដើម្បីបញ្ចូល API Key ផ្ទាល់ខ្លួនរបស់អ្នក។\)`\);/g,
    'alert(`មានបញ្ហា៖ ${error.message || "AI API Error"}`);'
  );
  content = content.replace(
    /alert\(`មានបញ្ហាក្នុងការបង្កើត៖ \$\{error\.message \|\| "AI API Error"\}\\n\\n\(បញ្ជាក់៖ គណនីឥតគិតថ្លៃប្រចាំថ្ងៃប្រហែលជាអស់កូតាហើយ។ សូមចូលទៅកាន់ Settings ដើម្បីបញ្ចូល API Key ផ្ទាល់ខ្លួនរបស់អ្នក។\)`\);/g,
    'alert(`មានបញ្ហា៖ ${error.message || "AI API Error"}`);'
  );
  fs.writeFileSync(file, content);
}

fixFrontendAlert('src/components/LessonPlanForm.tsx');
fixFrontendAlert('src/components/SeaPlmTestView.tsx');
fixFrontendAlert('src/components/PisaTestView.tsx');
fixFrontendAlert('src/components/WorksheetModal.tsx');
fixFrontendAlert('src/components/SlideGeneratorModal.tsx');


function fixBackendErrors(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace the catch blocks that hide the real error
  // Replace:
  // if (errorMessage.includes("UNAVAILABLE") || errorMessage.includes("high demand") || errorMessage.includes("503") || errorMessage.includes("429") || errorMessage.includes("Quota") || errorMessage.includes("404") || errorMessage.includes("available")) {
  //   errorMessage = "ប្រព័ន្ធ AI អស់កូតាប្រើប្រាស់ (Quota Exceeded)។ សូមកំណត់ API Key ផ្ទាល់ខ្លួនរបស់អ្នកនៅក្នុង Settings ដើម្បីបន្តប្រើប្រាស់។";
  // }
  
  content = content.replace(
    /if \(errorMessage\.includes\("UNAVAILABLE"\) \|\| errorMessage\.includes\("high demand"\) \|\| errorMessage\.includes\("503"\) \|\| errorMessage\.includes\("429"\) \|\| errorMessage\.includes\("Quota"\) \|\| errorMessage\.includes\("404"\) \|\| errorMessage\.includes\("available"\)\) \{\s*errorMessage = "ប្រព័ន្ធ AI អស់កូតាប្រើប្រាស់ \(Quota Exceeded\)។ សូមកំណត់ API Key ផ្ទាល់ខ្លួនរបស់អ្នកនៅក្នុង Settings ដើម្បីបន្តប្រើប្រាស់។";\s*\}/g,
    'errorMessage = `បញ្ហា AI (AI Error): ${errorMessage}`;'
  );

  fs.writeFileSync(file, content);
}

fixBackendErrors('api/index.ts');
fixBackendErrors('server.ts');
