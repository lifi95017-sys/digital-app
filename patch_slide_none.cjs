const fs = require('fs');

const file = 'src/components/SlideGeneratorModal.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetContent = `const imgUrl = hasImage ? \`https://image.pollinations.ai/prompt/\${encodeURIComponent(slide.imageKeyword! + ' cartoon style illustration')}?width=400&height=400&nologo=true\` : '';`;

const replacementContent = `const imgUrl = hasImage && slide.imageKeyword !== 'none' ? \`https://image.pollinations.ai/prompt/\${encodeURIComponent(slide.imageKeyword! + ' cartoon style illustration')}?width=400&height=400&nologo=true\` : '';`;

content = content.replace(targetContent, replacementContent);
fs.writeFileSync(file, content);
console.log('patched imgUrl check');
