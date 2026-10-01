const fs = require('fs');

const file = 'src/components/SlideGeneratorModal.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetContent1 = `const imgUrl = hasImage && slide.imageKeyword !== 'none' ? \`https://image.pollinations.ai/prompt/\${encodeURIComponent(slide.imageKeyword! + ' cartoon style illustration')}?width=400&height=400&nologo=true\` : '';
                   const bgUrl = slide.design?.imagePos === 'background' ? \`https://image.pollinations.ai/prompt/\${encodeURIComponent(slide.imageKeyword! + ' cartoon style illustration')}?width=800&height=600&nologo=true\` : '';`;

// Fallback logic, replacing spaces with %20 just in case and ensuring it always generates
const replacementContent1 = `const imgUrl = hasImage ? \`https://image.pollinations.ai/prompt/\${encodeURIComponent(slide.imageKeyword!)}?width=400&height=400&nologo=true\` : '';
                   const bgUrl = slide.design?.imagePos === 'background' ? \`https://image.pollinations.ai/prompt/\${encodeURIComponent(slide.imageKeyword!)}?width=800&height=600&nologo=true\` : '';`;

content = content.replace(targetContent1, replacementContent1);

// We should also patch the prompt to encourage simple english keywords
const promptTarget = `- រូបភាព (imageKeyword) ត្រូវតែមានជានិច្ចសម្រាប់ស្លាយនីមួយៗ (ហាមទុកទទេ) ហើយពាក់ព័ន្ធនឹងខ្លឹមសារមេរៀន។ បើចង់បានរូបភាពតុក្កតា សូមបញ្ជាក់ពាក្យ 'cartoon' ក្នុង keyword (ឧ. cute cartoon kids learning math)។ ចំណាំ៖ imageKeyword ត្រូវតែជាភាសាអង់គ្លេសសុទ្ធ (English Only) ដោយគ្មានសញ្ញាពិសេស។`;

const promptReplacement = `- រូបភាព (imageKeyword) ត្រូវតែមានជានិច្ច (ហាមទទេ)។ ត្រូវសរសេរជាភាសាអង់គ្លេសសុទ្ធ ខ្លីៗ គ្មានសញ្ញាពិសេស។ (ឧ. "cute math cartoon", "beautiful nature")។ កុំសរសេរប្រយោគវែងៗ។`;

content = content.replace(promptTarget, promptReplacement);

fs.writeFileSync(file, content);
console.log('patched imgUrl check');
