const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Add import
const importStatement = "import SecondaryLessonPlanForm from './components/SecondaryLessonPlanForm';\n";
content = content.replace("import LessonPlanForm from './components/LessonPlanForm';", "import LessonPlanForm from './components/LessonPlanForm';\n" + importStatement);

// Rename existing card from "បង្កើតកិច្ចតែងការ" to "កិច្ចតែងការ (១-៦)"
content = content.replace(
  /<MenuCard title="បង្កើតកិច្ចតែងការ" icon=\{<BookText \/>\} color="amber" onClick=\{.*?\} \/>/,
  `<MenuCard title="កិច្ចតែងការ (១-៦)" icon={<BookText />} color="amber" onClick={() => setView('lesson-plan')} />\n          <MenuCard title="កិច្ចតែងការ (៧-១២)" icon={<BookText />} color="indigo" onClick={() => setView('secondary-lesson-plan')} />`
);

// Add case in switch statement for 'secondary-lesson-plan'
content = content.replace(
  /case 'lesson-plan':/,
  `case 'secondary-lesson-plan':\n        return <SecondaryLessonPlanForm onBack={onBack} />;\n      case 'lesson-plan':`
);

// Also add to the inline condition blocks just in case
content = content.replace(
  /\{view === 'lesson-plan' && <LessonPlanForm onBack=\{onBack\} \/>\}/,
  "{view === 'lesson-plan' && <LessonPlanForm onBack={onBack} />}\n              {view === 'secondary-lesson-plan' && <SecondaryLessonPlanForm onBack={onBack} />}"
);

// Add to exclusion array in App.tsx
content = content.replace(
  /'lesson-plan'/,
  "'lesson-plan', 'secondary-lesson-plan'"
);

fs.writeFileSync('src/App.tsx', content);
