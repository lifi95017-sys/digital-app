const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Add import
const importStatement = "import QuestionBankView from './components/QuestionBankView';\n";
content = content.replace("import WorksheetModal from './components/WorksheetModal';", importStatement + "import WorksheetModal from './components/WorksheetModal';");

// Add icon import to lucide-react (FileQuestion)
if (!content.includes('FileQuestion')) {
  content = content.replace("Award,", "Award, FileQuestion,");
}

// Add state type (in case setView takes specific strings, but it's probably string)

// Add MenuCard to Section 3
const newMenuCard = `<MenuCard title="កម្រងសំណួរ (Question Bank)" icon={<FileQuestion />} color="teal" onClick={() => setView('question-bank')} />`;
content = content.replace(
  /<MenuCard title="ប្រព័ន្ធរង្វាន់សិស្ស" icon=\{<Trophy \/>\} color="purple" onClick=\{.*?\} \/>/,
  `<MenuCard title="ប្រព័ន្ធរង្វាន់សិស្ស" icon={<Trophy />} color="purple" onClick={() => setView('student-rewards')} />\n          ${newMenuCard}`
);

// Add case in switch statement
const newCase = `
      case 'question-bank':
        return <QuestionBankView />;
`;
content = content.replace(
  /case 'grade-summary':/,
  `case 'question-bank':\n        return <QuestionBankView />;\n      case 'grade-summary':`
);

fs.writeFileSync('src/App.tsx', content);
