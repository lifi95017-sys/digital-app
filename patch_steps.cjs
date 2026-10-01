const fs = require('fs');

const files = [
  'src/components/LessonPlanForm.tsx',
  'src/components/SecondaryLessonPlanForm.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // Replace "• ទំនាក់ទំនងមេរៀនថ្មី៖" with "• ទំនាក់ទំនងមេរៀនចាស់ទៅនឹងមេរៀនថ្មី៖"
  content = content.replace(/"• ទំនាក់ទំនងមេរៀនថ្មី៖"/g, '"• ទំនាក់ទំនងមេរៀនចាស់ទៅនឹងមេរៀនថ្មី៖"');

  // Add the explicit instruction about step 3
  // First match the line "- ខ្លឹមសារមេរៀន៖ ត្រូវមានចំណុចធំ៣..."
  const oldLine = '- ខ្លឹមសារមេរៀន៖ ត្រូវមានចំណុចធំ៣ គឺ "• កែកិច្ចការផ្ទះ៖" (មានចំណុចតូចៗ), "• រំឭកមេរៀនចាស់៖" (មានចំណុចតូចៗ) និង "• ទំនាក់ទំនងមេរៀនចាស់ទៅនឹងមេរៀនថ្មី៖" (មានចំណុចតូចៗ)';
  const newLine = '- ខ្លឹមសារមេរៀន៖ ត្រូវមានចំណុចធំ៣ គឺ "• កែកិច្ចការផ្ទះ៖" (មានចំណុចតូចៗ), "• រំឭកមេរៀនចាស់៖" (មានចំណុចតូចៗ) និង "• ទំនាក់ទំនងមេរៀនចាស់ទៅនឹងមេរៀនថ្មី៖" (មានចំណុចតូចៗ) (បញ្ជាក់៖ ត្រង់នេះគ្រាន់តែភ្ជាប់សាច់រឿងមេរៀនចាស់ទៅថ្មីប៉ុណ្ណោះ រីឯខ្លឹមសារមេរៀនថ្មីលម្អិតត្រូវដាក់នៅជំហានទី៣ទាំងស្រុង)។';
  
  content = content.replace(oldLine, newLine);

  fs.writeFileSync(file, content);
  console.log(`Updated ${file}`);
}
