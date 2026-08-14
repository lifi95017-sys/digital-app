import fs from 'fs';
import { globSync } from 'glob';

const files = globSync('src/**/*.tsx');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content.replace(/ថ្នាក់ទី ១/g, 'ថ្នាក់ទី ៤');
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    console.log(`Updated ${file}`);
  }
});
