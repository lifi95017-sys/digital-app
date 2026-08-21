const fs = require('fs');

function fixLessonPlan() {
  let content = fs.readFileSync('src/components/LessonPlanForm.tsx', 'utf8');
  content = content.replace(/      \} catch \(error: any\) \{/g, '      }\n    } catch (error: any) {');
  fs.writeFileSync('src/components/LessonPlanForm.tsx', content);
}
fixLessonPlan();
