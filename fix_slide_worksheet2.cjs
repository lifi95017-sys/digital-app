const fs = require('fs');

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');
  // I will just replace the block explicitly
  content = content.replace(/        \}\n      \}\n      \}\n      text = text\.replace/g, '        }\n      }\n      text = text.replace');
  // Or even simpler: 
  content = content.replace(/\}\s*\}\s*text = text\.replace/g, '}\n      text = text.replace');
  fs.writeFileSync(file, content);
}
fix('src/components/SlideGeneratorModal.tsx');
fix('src/components/WorksheetModal.tsx');
