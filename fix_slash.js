import fs from 'fs';
let content = fs.readFileSync('server.ts', 'utf8');
content = content.replace(/\\frac/g, '\\\\frac');
fs.writeFileSync('server.ts', content);
