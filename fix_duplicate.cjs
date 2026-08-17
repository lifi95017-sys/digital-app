const fs = require('fs');

const files = [
  'src/components/WorksheetModal.tsx',
  'src/components/SlideGeneratorModal.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    /, userApiKey: localStorage\.getItem\("userGeminiApiKey"\) \|\| undefined, userApiKey: localStorage\.getItem\("userGeminiApiKey"\) \|\| undefined/g,
    ', userApiKey: localStorage.getItem("userGeminiApiKey") || undefined'
  );
  fs.writeFileSync(file, content);
});
