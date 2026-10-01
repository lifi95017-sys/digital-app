const fs = require('fs');
const file = 'src/components/SlideGeneratorModal.tsx';
let lines = fs.readFileSync(file, 'utf8').split('\n');

const replacement = `      const isSecondary = typeof plan.grade === 'number' ? plan.grade >= 7 : false;
      const targetAudience = isSecondary ? 'សិស្សអនុវិទ្យាល័យ ឬវិទ្យាល័យ' : 'សិស្សកុមារតូចៗ';
      const promptText = \`អ្នកគឺជាអ្នកបង្កើតស្លាយបទបង្ហាញដ៏ចំណានម្នាក់។ សូមប្រែសម្រួលកិច្ចតែងការបង្រៀននេះទៅជាស្លាយបទបង្ហាញដ៏ទាក់ទាញ (Presentation Outline)។
ម៉ោងសិក្សា៖ \${plan.subject}, មេរៀន៖ \${plan.lessonTitle}, ថ្នាក់ទី៖ \${plan.grade}

\${teacherWorksheetContent ? \`នេះជាសន្លឹកកិច្ចការគ្រូ៖\\n\${teacherWorksheetContent}\\n\\nសូមបង្កើតជាស្លាយបទបង្ហាញ ដោយយកតាមខ្លឹមសារនៃសន្លឹកកិច្ចការគ្រូខាងលើជាចម្បង (ត្រូវប្រាកដថាបញ្ចូលខ្លឹមសារមេរៀន លំហាត់ និងចម្លើយពីសន្លឹកកិច្ចការគ្រូចូលក្នុងស្លាយឱ្យបានក្បោះក្បាយ)។\` : \`ខ្លឹមសារមេរៀនពីកិច្ចតែងការ៖\\n\${contentStr}\\n\\nសូមបង្កើតជាស្លាយបទបង្ហាញ ដោយយកតាមលំដាប់លំដោយនៃខ្លឹមសារមេរៀនពីកិច្ចតែងការខាងលើ (ពិសេសផ្តោតលើមេរៀនថ្មី និងសកម្មភាពពង្រឹងចំណេះដឹង) ហើយរៀបចំវាឱ្យមានទម្រង់ដូចជាសន្លឹកកិច្ចការគ្រូ (មានការពន្យល់មេរៀន លំហាត់ និងអត្រាកំណែ)។\`}
សូមបង្កើតជាទម្រង់ JSON Array ដោយមិនមានពាក្យណែនាំអ្វីផ្សេង ដូចទម្រង់ខាងក្រោម៖
[
  {
    "title": "ចំណងជើងស្លាយ",
    "subtitle": "ចំណងជើងរង (មានឬគ្មានក៏បាន)",
    "content": ["ចំណុចទី១", "ចំណុចទី២", "ចំណុចខ្លីៗនីមួយៗអោយខ្លីៗ ច្បាស់ៗ"],
    "type": "intro",
    "imageKeyword": "ពាក្យគន្លឹះជាភាសាអង់គ្លេសសម្រាប់ស្វែងរករូបភាព (ឧទាហរណ៍៖ cute kids studying cartoon, beautiful nature landscape, colorful math symbols)",
    "design": {
      "bgColor": "កូដពណ៌ Hex សម្រាប់ផ្ទៃខាងក្រោយ (ឧទាហរណ៍៖ #FDF4FF)",
      "titleColor": "កូដពណ៌ Hex សម្រាប់ចំណងជើង (ឧទាហរណ៍៖ #4C1D95)",
      "contentColor": "កូដពណ៌ Hex សម្រាប់អត្ថបទ (ឧទាហរណ៍៖ #334155)",
      "imagePos": "left" // ជ្រើសរើសមួយ៖ left, right, top, bottom, background, ឫ none
    }
  }
]

កំណត់សម្គាល់៖
- type អាចជា៖ intro, content, activity, summary។
- ការរចនា (design) ត្រូវមានពណ៌ចម្រុះ ស្រស់ស្អាត ទាក់ទាញ\${targetAudience}។
- រូបភាព (imageKeyword) ត្រូវតែមានជានិច្ច (ហាមទទេ)។ ត្រូវសរសេរជាភាសាអង់គ្លេសសុទ្ធ ខ្លីៗ គ្មានសញ្ញាពិសេស។ (ឧ. "cute math cartoon", "beautiful nature")។ កុំសរសេរប្រយោគវែងៗ។
- imagePos គឺទីតាំងរូបភាព៖ ត្រូវតែជ្រើសរើសមួយក្នុងចំណោម left, right, top, bottom, ឬ background (ហាមយក none ដើម្បីអោយស្លាយមានរូបភាពគ្រប់ទំព័រ)។\`;`;

lines.splice(62, 27, replacement);
fs.writeFileSync(file, lines.join('\n'));
console.log('Slide patched');
