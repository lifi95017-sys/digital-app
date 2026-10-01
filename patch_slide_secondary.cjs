const fs = require('fs');
const file = 'src/components/SlideGeneratorModal.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetContent = `const isSecondary = typeof plan.grade === 'number' ? plan.grade >= 7 : false;
      const targetAudience = isSecondary ? 'សិស្សអនុវិទ្យាល័យ ឬវិទ្យាល័យ' : 'សិស្សកុមារតូចៗ';`;

const replacementContent = `const isSecondary = typeof plan.grade === 'number' ? plan.grade >= 7 : false;
      const targetAudience = isSecondary ? 'សិស្សអនុវិទ្យាល័យ ឬវិទ្យាល័យ' : 'សិស្សកុមារតូចៗ';`;

// wait let me find the original content to replace
