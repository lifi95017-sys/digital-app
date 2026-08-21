const fs = require('fs');
let content = fs.readFileSync('src/components/LessonPlanForm.tsx', 'utf8');
content = content.replace(/let cleanedText = text\.replace/g, 'try {\n        let cleanedText = text.replace');
fs.writeFileSync('src/components/LessonPlanForm.tsx', content);
