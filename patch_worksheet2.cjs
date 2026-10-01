const fs = require('fs');
const file = 'src/components/WorksheetModal.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/យកតែម្តង。/g, "យកតែម្តង។");
fs.writeFileSync(file, content);
console.log("fixed");
