const fs = require('fs');
let content = fs.readFileSync('src/components/SecondaryLessonPlanForm.tsx', 'utf8');

// Component name
content = content.replace(
  'export default function LessonPlanForm',
  'export default function SecondaryLessonPlanForm'
);

// Initial grade
content = content.replace(
  /const INITIAL_PLAN: LessonPlan = \{\s*grade: 4,/,
  'const INITIAL_PLAN: LessonPlan = {\n  grade: 7,'
);

// Grade options mapping
content = content.replace(
  /\{\[4, 5, 6\]\.map\(g =>/g,
  '{[7, 8, 9, 10, 11, 12].map(g =>'
);

// Local storage key
content = content.replace(
  /'saved_lesson_plan_draft'/g,
  "'secondary_saved_lesson_plan_draft'"
);

fs.writeFileSync('src/components/SecondaryLessonPlanForm.tsx', content);
