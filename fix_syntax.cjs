const fs = require('fs');

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/\}\s*\}\s*catch\s*\(e:\s*any\)\s*\{/g, '} catch (e: any) {');
  // There is another syntax error:
  //    }
  //  }
  // }
  // try {
  // Let's just fix the specific extra curly brace before catch:
  content = content.replace(/\}\s*\}\s*catch \(/g, '} catch (');
  
  fs.writeFileSync(file, content);
}

fix('src/components/LessonPlanForm.tsx');
fix('src/components/PisaTestView.tsx');
fix('src/components/SeaPlmTestView.tsx');
fix('src/components/WorksheetModal.tsx');
fix('src/components/SlideGeneratorModal.tsx');
console.log('Fixed syntax');
