const fs = require('fs');

const file = 'src/components/SlideGeneratorModal.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetContent1 = `const imgUrl = hasImage ? \`https://image.pollinations.ai/prompt/\${encodeURIComponent(slide.imageKeyword!)}?width=400&height=400&nologo=true\` : '';`;
const targetContent2 = `const bgUrl = slide.design?.imagePos === 'background' ? \`https://image.pollinations.ai/prompt/\${encodeURIComponent(slide.imageKeyword!)}?width=800&height=600&nologo=true\` : '';`;

const replacementContent1 = `const imgUrl = hasImage ? \`https://image.pollinations.ai/prompt/\${encodeURIComponent(slide.imageKeyword!.replace(/[^a-zA-Z0-9 ]/g, ''))}?width=400&height=400&nologo=true\` : '';`;
const replacementContent2 = `const bgUrl = slide.design?.imagePos === 'background' ? \`https://image.pollinations.ai/prompt/\${encodeURIComponent(slide.imageKeyword!.replace(/[^a-zA-Z0-9 ]/g, ''))}?width=800&height=600&nologo=true\` : '';`;

content = content.replace(targetContent1, replacementContent1);
content = content.replace(targetContent2, replacementContent2);

const targetContent3 = `        if (slide.imageKeyword && imagePos !== 'none') {
          imagePath = \`https://image.pollinations.ai/prompt/\${encodeURIComponent(slide.imageKeyword + ' simple illustration')}?nologo=true\`;
        }`;

const replacementContent3 = `        if (slide.imageKeyword && imagePos !== 'none') {
          imagePath = \`https://image.pollinations.ai/prompt/\${encodeURIComponent(slide.imageKeyword.replace(/[^a-zA-Z0-9 ]/g, ''))}?nologo=true\`;
        }`;

content = content.replace(targetContent3, replacementContent3);

fs.writeFileSync(file, content);
console.log('patched imgUrl check to remove all non alphanumeric characters');
