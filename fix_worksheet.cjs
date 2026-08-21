const fs = require('fs');
let content = fs.readFileSync('src/components/WorksheetModal.tsx', 'utf8');
content = content.replace(/\}\s*\}\s*setContent\(text\);/g, '}\n      setContent(text);');
fs.writeFileSync('src/components/WorksheetModal.tsx', content);
