const fs = require('fs');

const file = 'src/components/SlideGeneratorModal.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetContent1 = `      const teacherWorksheetKey = \`worksheet_teacher_\${plan.lessonTitle || 'draft'}\`;
      const teacherWorksheetContent = localStorage.getItem(teacherWorksheetKey);
      
      const promptText = \`អ្នកគឺជាអ្នកបង្កើតស្លាយបទបង្ហាញដ៏ចំណានម្នាក់។ សូមប្រែសម្រួលកិច្ចតែងការបង្រៀននេះទៅជាស្លាយបទបង្ហាញដ៏ទាក់ទាញ (Presentation Outline)។
ម៉ោងសិក្សា៖ \${plan.subject}, មេរៀន៖ \${plan.lessonTitle}, ថ្នាក់ទី៖ \${plan.grade}

\${teacherWorksheetContent ? \`នេះជាសន្លឹកកិច្ចការគ្រូ៖\\n\${teacherWorksheetContent}\\n\\nសូមបង្កើតជាស្លាយបទបង្ហាញ ដោយយកតាមខ្លឹមសារនៃសន្លឹកកិច្ចការគ្រូខាងលើជាចម្បង (ត្រូវប្រាកដថាបញ្ចូលខ្លឹមសារមេរៀន លំហាត់ និងចម្លើយពីសន្លឹកកិច្ចការគ្រូចូលក្នុងស្លាយឱ្យបានក្បោះក្បាយ)។\` : \`ខ្លឹមសារមេរៀនពីកិច្ចតែងការ៖\\n\${contentStr}\\n\\nសូមបង្កើតជាស្លាយបទបង្ហាញ ដោយយកតាមលំដាប់លំដោយនៃខ្លឹមសារមេរៀនពីកិច្ចតែងការខាងលើ (ពិសេសផ្តោតលើមេរៀនថ្មី និងសកម្មភាពពង្រឹងចំណេះដឹង) ហើយរៀបចំវាឱ្យមានទម្រង់ដូចជាសន្លឹកកិច្ចការគ្រូ (មានការពន្យល់មេរៀន លំហាត់ និងអត្រាកំណែ)។\`}

សូមបង្កើតជាទម្រង់ JSON Array ដោយមិនមានពាក្យណែនាំអ្វីផ្សេង ដូចទម្រង់ខាងក្រោម៖`;

const replacementContent1 = `      const promptText = \`អ្នកគឺជាអ្នកបង្កើតស្លាយបទបង្ហាញដ៏ចំណានម្នាក់។ សូមប្រែសម្រួលកិច្ចតែងការបង្រៀននេះទៅជាស្លាយបទបង្ហាញដ៏ទាក់ទាញ (Presentation Outline)។
ម៉ោងសិក្សា៖ \${plan.subject}, មេរៀន៖ \${plan.lessonTitle}, ថ្នាក់ទី៖ \${plan.grade}

ខ្លឹមសារមេរៀនពីកិច្ចតែងការ៖
\${contentStr}

សូមបង្កើតជាស្លាយបទបង្ហាញ ដោយយកតាមលំដាប់លំដោយនៃខ្លឹមសារមេរៀនពីកិច្ចតែងការខាងលើ (ពិសេសផ្តោតលើមេរៀនថ្មី និងសកម្មភាពពង្រឹងចំណេះដឹង)។

សូមបង្កើតជាទម្រង់ JSON Array ដោយមិនមានពាក្យណែនាំអ្វីផ្សេង ដូចទម្រង់ខាងក្រោម៖`;

content = content.replace(targetContent1, replacementContent1);

const targetContent2 = `កំណត់សម្គាល់៖
- type អាចជា៖ intro, content, activity, summary។
- ការរចនា (design) ត្រូវមានពណ៌ចម្រុះ ស្រស់ស្អាត ទាក់ទាញសិស្សកុមារតូចៗ។
- រូបភាព (imageKeyword) ត្រូវតែមានជានិច្ចសម្រាប់ស្លាយនីមួយៗ (ហាមទុកទទេ) ហើយពាក់ព័ន្ធនឹងខ្លឹមសារមេរៀន។ បើចង់បានរូបភាពតុក្កតា សូមបញ្ជាក់ពាក្យ 'cartoon' ក្នុង keyword (ឧ. cute cartoon kids learning math)។
- imagePos គឺទីតាំងរូបភាព៖ ត្រូវតែជ្រើសរើសមួយក្នុងចំណោម left, right, top, bottom, ឬ background (ហាមយក none ដើម្បីអោយស្លាយមានរូបភាពគ្រប់ទំព័រ)។\`;`;

const replacementContent2 = `កំណត់សម្គាល់៖
- type អាចជា៖ intro, content, activity, summary។
- ការរចនា (design) ត្រូវមានពណ៌ចម្រុះ ស្រស់ស្អាត ទាក់ទាញសិស្សកុមារតូចៗ។
- រូបភាព (imageKeyword) ត្រូវតែមានជានិច្ចសម្រាប់ស្លាយនីមួយៗ (ហាមទុកទទេ) ហើយពាក់ព័ន្ធនឹងខ្លឹមសារមេរៀន។ បើចង់បានរូបភាពតុក្កតា សូមបញ្ជាក់ពាក្យ 'cartoon' ក្នុង keyword (ឧ. cute cartoon kids learning math)។ ចំណាំ៖ imageKeyword ត្រូវតែជាភាសាអង់គ្លេសសុទ្ធ (English Only) ដោយគ្មានសញ្ញាពិសេស។
- imagePos គឺទីតាំងរូបភាព៖ ត្រូវតែជ្រើសរើសមួយក្នុងចំណោម left, right, top, bottom, ឬ background (ហាមយក none ដើម្បីអោយស្លាយមានរូបភាពគ្រប់ទំព័រ)។\`;`;

content = content.replace(targetContent2, replacementContent2);

fs.writeFileSync(file, content);
console.log('patched');
