import fs from 'fs';
let c = fs.readFileSync('server.ts', 'utf8');
c = c.replace(/\\\$\{grade\}/g, '${grade}');
c = c.replace(/\\\$\{subject \|\| 'ភាសាខ្មែរ'\}/g, "${subject || 'ភាសាខ្មែរ'}");
c = c.replace(/\\\$\{lesson\}/g, '${lesson}');
c = c.replace(/\\\$\{gradeConfig\}/g, '${gradeConfig}');
fs.writeFileSync('server.ts', c);
