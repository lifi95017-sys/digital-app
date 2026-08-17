const fs = require('fs');

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');
  // Remove 404 and "not found" from the retry condition
  content = content.replace(
    /errorMessage\.includes\("404"\) \|\| errorMessage\.includes\("not found"\) \|\| /g,
    ''
  );
  
  // Make the error message include the raw error again
  content = content.replace(
    /errorMessage = `បញ្ហាគណនី \(Account Error\): API Key របស់អ្នកមិនអាចប្រើប្រាស់មុខងារនេះបានទេ ដោយសារគណនីចាស់ ឬមិនមានសិទ្ធិ។ សូមចូលទៅកាន់ aistudio.google.com \(ជ្រើសរើស Create API key in a new project\) ដើម្បីបង្កើត API Key ថ្មី រួចយកមកបញ្ជូលក្នុង Settings ម្តងទៀត។`;/g,
    'errorMessage = `បញ្ហាគណនី (Account Error): API Key របស់អ្នកគ្មានសិទ្ធិ ឬស្ថិតក្នុង Project ចាស់ដែលត្រូវបិទ។ សូមបង្កើត API Key ថ្មីក្នុង "Project ថ្មី" រួច Paste បញ្ចូលក្នុង Settings ម្តងទៀត។ (Error: ${errorMessage})`;'
  );
  fs.writeFileSync(file, content);
}

fix('server.ts');
fix('api/index.ts');
