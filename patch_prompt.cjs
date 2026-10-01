const fs = require('fs');
const file = 'src/components/SlideGeneratorModal.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetContent = `កំណត់សម្គាល់៖
- type អាចជា៖ intro, content, activity, summary។
- ការរចនា (design) ត្រូវមានពណ៌ចម្រុះ ស្រស់ស្អាត ទាក់ទាញសិស្សកុមារតូចៗ។
- រូបភាព (imageKeyword) ត្រូវតែពាក់ព័ន្ធនឹងខ្លឹមសារមេរៀន។ បើចង់បានរូបភាពតុក្កតា សូមបញ្ជាក់ពាក្យ 'cartoon' ក្នុង keyword។
- imagePos គឺទីតាំងរូបភាព៖ left, right, top, bottom, background ឬ none (មិនដាក់រូបភាព)។\`;`;

const replacementContent = `កំណត់សម្គាល់៖
- type អាចជា៖ intro, content, activity, summary។
- ការរចនា (design) ត្រូវមានពណ៌ចម្រុះ ស្រស់ស្អាត ទាក់ទាញសិស្សកុមារតូចៗ។
- រូបភាព (imageKeyword) ត្រូវតែមានជានិច្ចសម្រាប់ស្លាយនីមួយៗ (ហាមទុកទទេ) ហើយពាក់ព័ន្ធនឹងខ្លឹមសារមេរៀន។ បើចង់បានរូបភាពតុក្កតា សូមបញ្ជាក់ពាក្យ 'cartoon' ក្នុង keyword (ឧ. cute cartoon kids learning math)។
- imagePos គឺទីតាំងរូបភាព៖ ត្រូវតែជ្រើសរើសមួយក្នុងចំណោម left, right, top, bottom, ឬ background (ហាមយក none ដើម្បីអោយស្លាយមានរូបភាពគ្រប់ទំព័រ)។\`;`;

content = content.replace(targetContent, replacementContent);
fs.writeFileSync(file, content);
console.log('patched');
