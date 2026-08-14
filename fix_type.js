import fs from 'fs';

let content = fs.readFileSync('src/types.ts', 'utf8');
let newContent = content.replace(/export type Grade = 1 \| 2 \| 3 \| 4 \| 5 \| 6;/g, 'export type Grade = 4 | 5 | 6;');
fs.writeFileSync('src/types.ts', newContent);
console.log("updated");
