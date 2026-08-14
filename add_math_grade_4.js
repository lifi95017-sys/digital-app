import fs from 'fs';

let content = fs.readFileSync('src/components/SeaPlmTestView.tsx', 'utf8');

const mathGrade4 = `
const SEA_PLM_GRADE_4_MATH = [
  {
    chapter: 'មេរៀនទាំងអស់',
    lessons: [
      'មេរៀនទី 1 : ចំនួន',
      'មេរៀនទី 2 : ប្រភាគ',
      'មេរៀនទី 3 : វិធីបូក',
      'មេរៀនទី 4 : រូបធរណីមាត្រ',
      'មេរៀនទី 5 : ទម្ងន់',
      'មេរៀនទី 6 : វិធីដក',
      'មេរៀនទី 7 : រូបិយវត្ថុ',
      'មេរៀនទី 8 : វិធីគុណ',
      'មេរៀនទី 9 : វិធីចែក',
      'មេរៀនទី 10 : ពេលវេលា',
      'មេរៀនទី 11 : ប្រវែង',
      'មេរៀនទី 12 : ចំនួនទសភាគ',
      'មេរៀនទី 13 : វិធីបូកចំនួនទសភាគ',
      'មេរៀនទី 14 : វិធីដកចំនួនទសភាគ',
      'មេរៀនទី 15 : មុំ',
      'មេរៀនទី 16 : បន្ទាត់កែងនិងបន្ទាត់ស្រប',
      'មេរៀនទី 17 : ស្ថិតិ',
    ]
  }
];
`;

content = content.replace("const SEA_PLM_GRADE_6_MATH = [", mathGrade4 + "const SEA_PLM_GRADE_6_MATH = [");

const oldLogic = `  if (activeSubject === 'math' && activeGrade === 6) {
    currentCurriculum = SEA_PLM_GRADE_6_MATH;
  } else if (activeSubject === 'math') {
    currentCurriculum = []; // Not added yet
  }`;
  
const newLogic = `  if (activeSubject === 'math') {
    if (activeGrade === 6) {
      currentCurriculum = SEA_PLM_GRADE_6_MATH;
    } else if (activeGrade === 4) {
      currentCurriculum = SEA_PLM_GRADE_4_MATH;
    } else {
      currentCurriculum = []; // Not added yet
    }
  }`;
  
content = content.replace(oldLogic, newLogic);

fs.writeFileSync('src/components/SeaPlmTestView.tsx', content);
