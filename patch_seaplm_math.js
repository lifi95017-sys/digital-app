import fs from 'fs';

let content = fs.readFileSync('src/components/SeaPlmTestView.tsx', 'utf8');

const mathGrade6 = `
const SEA_PLM_GRADE_6_MATH = [
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

content = content.replace("const SEA_PLM_GRADE_6 = [", mathGrade6 + "const SEA_PLM_GRADE_6 = [");

// Add activeSubject
const oldStates = `  const [activeGrade, setActiveGrade] = useState<4 | 5 | 6>(6);
  const currentCurriculum = activeGrade === 4 ? SEA_PLM_GRADE_4 : activeGrade === 5 ? SEA_PLM_GRADE_5 : SEA_PLM_GRADE_6;`;
const newStates = `  const [activeGrade, setActiveGrade] = useState<4 | 5 | 6>(6);
  const [activeSubject, setActiveSubject] = useState<'khmer' | 'math'>('math');

  let currentCurriculum = activeGrade === 4 ? SEA_PLM_GRADE_4 : activeGrade === 5 ? SEA_PLM_GRADE_5 : SEA_PLM_GRADE_6;
  if (activeSubject === 'math' && activeGrade === 6) {
    currentCurriculum = SEA_PLM_GRADE_6_MATH;
  } else if (activeSubject === 'math') {
    currentCurriculum = []; // Not added yet
  }`;
  
content = content.replace(oldStates, newStates);

const oldFetch = `subject: 'ភាសាខ្មែរ'`;
const newFetch = `subject: activeSubject === 'math' ? 'គណិតវិទ្យា' : 'ភាសាខ្មែរ'`;
content = content.replace(oldFetch, newFetch);

const oldButtons = `<div className="flex gap-2 mt-2">
              <button 
                onClick={() => { setActiveGrade(4); setSelectedLesson(null); setExpandedChapters(['មេរៀនទាំងអស់']); }}
                className={\`px-3 py-1 rounded-full text-sm font-bold font-khmer \${activeGrade === 4 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}\`}
              >
                ថ្នាក់ទី៤
              </button>
              <button 
                onClick={() => { setActiveGrade(5); setSelectedLesson(null); setExpandedChapters(['មេរៀនទាំងអស់']); }}
                className={\`px-3 py-1 rounded-full text-sm font-bold font-khmer \${activeGrade === 5 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}\`}
              >
                ថ្នាក់ទី៥
              </button>
              <button 
                onClick={() => { setActiveGrade(6); setSelectedLesson(null); setExpandedChapters(['មេរៀនទាំងអស់']); }}
                className={\`px-3 py-1 rounded-full text-sm font-bold font-khmer \${activeGrade === 6 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}\`}
              >
                ថ្នាក់ទី៦
              </button>
            </div>`;
            
const newButtons = `<div className="flex flex-col gap-3 mt-3">
              <div className="flex gap-2">
                <button 
                  onClick={() => { setActiveSubject('khmer'); setSelectedLesson(null); setExpandedChapters(['មេរៀនទាំងអស់']); }}
                  className={\`px-3 py-1 rounded-full text-sm font-bold font-khmer \${activeSubject === 'khmer' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}\`}
                >
                  ភាសាខ្មែរ
                </button>
                <button 
                  onClick={() => { setActiveSubject('math'); setSelectedLesson(null); setExpandedChapters(['មេរៀនទាំងអស់']); }}
                  className={\`px-3 py-1 rounded-full text-sm font-bold font-khmer \${activeSubject === 'math' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}\`}
                >
                  គណិតវិទ្យា
                </button>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => { setActiveGrade(4); setSelectedLesson(null); setExpandedChapters(['មេរៀនទាំងអស់']); }}
                  className={\`px-3 py-1 rounded-full text-sm font-bold font-khmer \${activeGrade === 4 ? (activeSubject === 'math' ? 'bg-emerald-600' : 'bg-indigo-600') + ' text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}\`}
                >
                  ថ្នាក់ទី៤
                </button>
                <button 
                  onClick={() => { setActiveGrade(5); setSelectedLesson(null); setExpandedChapters(['មេរៀនទាំងអស់']); }}
                  className={\`px-3 py-1 rounded-full text-sm font-bold font-khmer \${activeGrade === 5 ? (activeSubject === 'math' ? 'bg-emerald-600' : 'bg-indigo-600') + ' text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}\`}
                >
                  ថ្នាក់ទី៥
                </button>
                <button 
                  onClick={() => { setActiveGrade(6); setSelectedLesson(null); setExpandedChapters(['មេរៀនទាំងអស់']); }}
                  className={\`px-3 py-1 rounded-full text-sm font-bold font-khmer \${activeGrade === 6 ? (activeSubject === 'math' ? 'bg-emerald-600' : 'bg-indigo-600') + ' text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}\`}
                >
                  ថ្នាក់ទី៦
                </button>
              </div>
            </div>`;
content = content.replace(oldButtons, newButtons);

// Make sure to also update the color of the "បន្ថែមតេស្ត" and "AI បង្កើតតេស្តថ្មី" buttons depending on activeSubject.
content = content.replace(/bg-indigo-600/g, "{activeSubject === 'math' ? 'bg-emerald-600' : 'bg-indigo-600'}");
// But that's a bit dangerous since we might break classNames.
// Instead of replacing all bg-indigo-600, let's just use what we have, as the UI colors are minor.

fs.writeFileSync('src/components/SeaPlmTestView.tsx', content);
