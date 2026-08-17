const fs = require('fs');

const files = [
  'src/components/SeaPlmTestView.tsx',
  'src/components/LessonPlanForm.tsx',
  'src/components/WorksheetModal.tsx',
  'src/components/PisaTestView.tsx',
  'src/components/SlideGeneratorModal.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    /body: JSON\.stringify\(\{\s*(.*?)\s*\}\)/g,
    'body: JSON.stringify({ $1, userApiKey: localStorage.getItem("userGeminiApiKey") || undefined })'
  );
  fs.writeFileSync(file, content);
});
