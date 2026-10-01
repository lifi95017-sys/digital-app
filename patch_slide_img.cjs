const fs = require('fs');

const file = 'src/components/SlideGeneratorModal.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetContent1 = `const imgUrl = hasImage && slide.imageKeyword !== 'none' ? \`https://image.pollinations.ai/prompt/\${encodeURIComponent(slide.imageKeyword! + ' cartoon style illustration')}?width=400&height=400&nologo=true\` : '';
                   const bgUrl = slide.design?.imagePos === 'background' ? \`https://image.pollinations.ai/prompt/\${encodeURIComponent(slide.imageKeyword! + ' cartoon style illustration')}?width=800&height=600&nologo=true\` : '';`;

const replacementContent1 = `const imgUrl = hasImage ? \`https://image.pollinations.ai/prompt/\${encodeURIComponent(slide.imageKeyword! + ' simple illustration')}?width=400&height=400&nologo=true\` : '';
                   const bgUrl = slide.design?.imagePos === 'background' ? \`https://image.pollinations.ai/prompt/\${encodeURIComponent(slide.imageKeyword! + ' simple illustration background')}?width=800&height=600&nologo=true\` : '';`;

content = content.replace(targetContent1, replacementContent1);

const targetContent2 = `        if (slide.imageKeyword && imagePos !== 'none') {
          imagePath = \`https://image.pollinations.ai/prompt/\${encodeURIComponent(slide.imageKeyword + ' cartoon style illustration')}?nologo=true\`;
        }`;

const replacementContent2 = `        if (slide.imageKeyword && imagePos !== 'none') {
          imagePath = \`https://image.pollinations.ai/prompt/\${encodeURIComponent(slide.imageKeyword + ' simple illustration')}?nologo=true\`;
        }`;

content = content.replace(targetContent2, replacementContent2);
fs.writeFileSync(file, content);
console.log('patched imgUrl check');
