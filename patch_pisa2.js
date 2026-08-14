import fs from 'fs';
let content = fs.readFileSync('src/components/PisaTestView.tsx', 'utf8');

content = content.replace(/f => f\.category === selectedLesson \|\| f\.title\.includes\(selectedLesson\)/g, "f => f.title.includes(selectedLesson)");

fs.writeFileSync('src/components/PisaTestView.tsx', content);
