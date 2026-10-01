const fs = require('fs');

const file = 'src/components/SlideGeneratorModal.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetContent = `      const stepsArr = Object.values(plan.steps);
      const contentStr = stepsArr.map(s => s.content).filter(Boolean).join('\\n');
      
      const promptText = \`អ្នកគឺជាអ្នកបង្កើតស្លាយបទបង្ហាញដ៏ចំណានម្នាក់។ សូមប្រែសម្រួលកិច្ចតែងការបង្រៀននេះទៅជាស្លាយបទបង្ហាញដ៏ទាក់ទាញ (Presentation Outline)។
ម៉ោងសិក្សា៖ \${plan.subject}, មេរៀន៖ \${plan.lessonTitle}, ថ្នាក់ទី៖ \${plan.grade}

ខ្លឹមសារមេរៀនពីកិច្ចតែងការ៖
\${contentStr}

សូមបង្កើតជាស្លាយបទបង្ហាញ ដោយយកតាមលំដាប់លំដោយនៃខ្លឹមសារមេរៀនពីកិច្ចតែងការខាងលើ (ពិសេសផ្តោតលើមេរៀនថ្មី និងសកម្មភាពពង្រឹងចំណេះដឹង)។`;

const replacementContent = `      const stepsArr = Object.values(plan.steps);
      const contentStr = stepsArr.map(s => s.content).filter(Boolean).join('\\n');
      
      const teacherWorksheetKey = \`worksheet_teacher_\${plan.lessonTitle || 'draft'}\`;
      const teacherWorksheetContent = localStorage.getItem(teacherWorksheetKey);
      
      const promptText = \`អ្នកគឺជាអ្នកបង្កើតស្លាយបទបង្ហាញដ៏ចំណានម្នាក់។ សូមប្រែសម្រួលកិច្ចតែងការបង្រៀននេះទៅជាស្លាយបទបង្ហាញដ៏ទាក់ទាញ (Presentation Outline)។
ម៉ោងសិក្សា៖ \${plan.subject}, មេរៀន៖ \${plan.lessonTitle}, ថ្នាក់ទី៖ \${plan.grade}

\${teacherWorksheetContent ? \`នេះជាសន្លឹកកិច្ចការគ្រូ៖\\n\${teacherWorksheetContent}\\n\\nសូមបង្កើតជាស្លាយបទបង្ហាញ ដោយយកតាមខ្លឹមសារនៃសន្លឹកកិច្ចការគ្រូខាងលើជាចម្បង (ត្រូវប្រាកដថាបញ្ចូលខ្លឹមសារមេរៀន លំហាត់ និងចម្លើយពីសន្លឹកកិច្ចការគ្រូចូលក្នុងស្លាយឱ្យបានក្បោះក្បាយ)។\` : \`ខ្លឹមសារមេរៀនពីកិច្ចតែងការ៖\\n\${contentStr}\\n\\nសូមបង្កើតជាស្លាយបទបង្ហាញ ដោយយកតាមលំដាប់លំដោយនៃខ្លឹមសារមេរៀនពីកិច្ចតែងការខាងលើ (ពិសេសផ្តោតលើមេរៀនថ្មី និងសកម្មភាពពង្រឹងចំណេះដឹង) ហើយរៀបចំវាឱ្យមានទម្រង់ដូចជាសន្លឹកកិច្ចការគ្រូ (មានការពន្យល់មេរៀន លំហាត់ និងអត្រាកំណែ)។\`}`;

content = content.replace(targetContent, replacementContent);
fs.writeFileSync(file, content);
console.log('patched');
