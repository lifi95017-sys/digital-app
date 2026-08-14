import fs from 'fs';

let content = fs.readFileSync('src/components/SeaPlmTestView.tsx', 'utf8');

const newGrades = `const SEA_PLM_GRADE_4 = [
  {
    chapter: 'មេរៀនទាំងអស់',
    lessons: [
      'មេរៀនទី ១៖ កីឡានិងល្បែងកម្សាន្ត',
      'មេរៀនទី ២៖ សហគមន៍ជឿនលឿន',
      'មេរៀនទី ៣៖ ការគូរសម',
      'មេរៀនទី ៤៖ រុក្ខជាតិប្រទេសយើង',
      'មេរៀនទី ៥៖ មិត្តជិតស្និទ្ធ',
      'មេរៀនទី ៦៖ មធ្យោបាយធ្វើទំនាក់ទំនង',
      'មេរៀនទី ៧៖ ម្ហូបអាហារខ្មែរ',
      'មេរៀនទី ៨៖ សណ្ឋានដីប្រទេសយើង',
      'មេរៀនទី ៩៖ ប្រភពទឹកនៅកម្ពុជា',
      'មេរៀនទី ១០៖ សត្វនៅប្រទេសយើង',
    ]
  }
];

const SEA_PLM_GRADE_5 = [
  {
    chapter: 'មេរៀនទាំងអស់',
    lessons: [
      'មេរៀនទី ១ : វីរជនឆ្នើម',
      'មេរៀនទី ២ : សម្បត្តិអក្សរសិល្ប៍',
      'មេរៀនទី ៣ : កំណាព្យខ្មែរ',
      'មេរៀនទី ៤ : ប្រយោជន៍នៃសារព័ត៌មាន',
      'មេរៀនទី ៥ : ស្មារតីទទួលខុសត្រូវ',
      'មេរៀនទី ៦ : អតីតកាលរបស់យើង',
      'មេរៀនទី ៧ : ទូរគមនាគមន៍នៅកម្ពុជា',
      'មេរៀនទី ៨ : ផលិតផលខ្មែរ',
      'មេរៀនទី ៩ : ពេលវេលាជាមាសប្រាក់',
      'មេរៀនទី ១០ : ប្រយោជន៍នៃវិទ្យាសាស្ត្រ',
    ]
  }
];`;

content = content.replace(/const SEA_PLM_GRADE_4 = \[\s*\{\s*chapter: 'មេរៀនទាំងអស់',\s*lessons: \[\s*'មេរៀនទី ១៖ កីឡានិងល្បែងកម្សាន្ត',[\s\S]*?\]\s*\}\s*\];/, newGrades);

// Update states
const oldStates = `  const [activeGrade, setActiveGrade] = useState<4>(4);
  const currentCurriculum = SEA_PLM_GRADE_4;`;

const newStates = `  const [activeGrade, setActiveGrade] = useState<4 | 5>(5);
  const currentCurriculum = activeGrade === 4 ? SEA_PLM_GRADE_4 : SEA_PLM_GRADE_5;`;
  
content = content.replace(oldStates, newStates);

// Update buttons
const oldButtons = `<div className="flex gap-2 mt-2">
              <button 
                className="px-3 py-1 rounded-full text-sm font-bold font-khmer bg-indigo-600 text-white"
              >
                ថ្នាក់ទី៤
              </button>
            </div>`;
const newButtons = `<div className="flex gap-2 mt-2">
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
            </div>`;
            
content = content.replace(oldButtons, newButtons);

fs.writeFileSync('src/components/SeaPlmTestView.tsx', content);
