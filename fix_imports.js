import fs from 'fs';
import { globSync } from 'glob';

const files = globSync('src/**/*.tsx');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (file === 'src/App.tsx') {
    content = content.replace(/['"]firebase\/firestore['"]/g, "'./lib/firebase'");
  } else {
    content = content.replace(/['"]firebase\/firestore['"]/g, "'../lib/firebase'");
  }
  fs.writeFileSync(file, content);
});
console.log("Imports updated");
