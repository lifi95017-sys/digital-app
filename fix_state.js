import fs from 'fs';
import { globSync } from 'glob';

const files = globSync('src/**/*.tsx');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content.replace(/useState<Grade>\(1\)/g, 'useState<Grade>(4)');
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    console.log(`Updated ${file}`);
  }
});
