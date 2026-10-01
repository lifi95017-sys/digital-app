const fs = require('fs');

const files = [
  'src/components/LessonPlanForm.tsx',
  'src/components/SecondaryLessonPlanForm.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // Replace remaining instances of "ទំនាក់ទំនងមេរៀនថ្មី៖" in the examples
  content = content.replace(/"• ទំនាក់ទំនងមេរៀនថ្មី៖\\n  - \[ចំណុចតូចៗ\]"/g, '"• ទំនាក់ទំនងមេរៀនចាស់ទៅនឹងមេរៀនថ្មី៖\\n  - [ចំណុចតូចៗ]"');
  content = content.replace(/• ទំនាក់ទំនងមេរៀនថ្មី៖/g, '• ទំនាក់ទំនងមេរៀនចាស់ទៅនឹងមេរៀនថ្មី៖');

  // Add the explicit warning about not putting new lesson in step 2
  if (!content.includes('បម្រាមដាច់ខាត៖ ហាមសរសេរខ្លឹមសារមេរៀនថ្មីលម្អិតនៅក្នុងជំហានទី២')) {
    content = content.replace(
      /ចំណាំបន្ថែមសម្រាប់ជំហានទី២ \(រចនាសម្ព័ន្ធកាតព្វកិច្ច\)៖/,
      'ចំណាំបន្ថែមសម្រាប់ជំហានទី២ (រចនាសម្ព័ន្ធកាតព្វកិច្ច)៖\n      ***បម្រាមដាច់ខាត៖ ហាមសរសេរខ្លឹមសារមេរៀនថ្មីលម្អិតនៅក្នុងជំហានទី២។ ជំហានទី២ ត្រង់ចំណុចចុងក្រោយ គ្រាន់តែជាការនិយាយផ្សារភ្ជាប់ពីមេរៀនចាស់ទៅមេរៀនថ្មីប៉ុណ្ណោះ។ ខ្លឹមសារមេរៀនថ្មីទាំងអស់ត្រូវតែសរសេរចូលក្នុងជំហានទី៣ (មេរៀនថ្មី) វិញ!***'
    );
  }

  fs.writeFileSync(file, content);
  console.log(`Updated ${file}`);
}
