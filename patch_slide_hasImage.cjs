const fs = require('fs');

const file = 'src/components/SlideGeneratorModal.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetContent = `const hasImage = slide.imageKeyword && slide.design?.imagePos !== 'none';`;

const replacementContent = `const hasImage = slide.imageKeyword && slide.imageKeyword.toLowerCase() !== 'none' && slide.design?.imagePos !== 'none';`;

content = content.replace(targetContent, replacementContent);
fs.writeFileSync(file, content);
console.log('patched hasImage check');
