import fs from 'fs';
let c = fs.readFileSync('src/components/SeaPlmTestView.tsx', 'utf8');
c = c.replace(/\\n  const \[isGenerating/, '\n  const [isGenerating');
fs.writeFileSync('src/components/SeaPlmTestView.tsx', c);
