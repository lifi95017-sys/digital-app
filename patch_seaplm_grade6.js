import fs from 'fs';

let content = fs.readFileSync('src/components/SeaPlmTestView.tsx', 'utf8');

const newGrades = `const SEA_PLM_GRADE_5 = [
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
];

const SEA_PLM_GRADE_6 = [
  {
    chapter: 'មេរៀនទាំងអស់',
    lessons: [
      'មេរៀនទី១ : អ្នកមានគុណ',
      'មេរៀនទី២ : កិត្តិយសរបស់កុមារ',
      'មេរៀនទី៣ : ធនធានរ៉ែនៅប្រទេសកម្ពុជា',
      'មេរៀនទី៤ : ប្រយោជន៍នៃធម្មជាតិ',
      'មេរៀនទី៥ : ធនធានជលផលនៅកម្ពុជា',
      'មេរៀនទី៦ : ទំនៀមទម្លាប់ ប្រពៃណីខ្មែរ',
      'មេរៀនទី៧ : តន្ត្រីនិងសិល្បៈបុរាណ',
      'មេរៀនទី៨ : ជំនឿនិងសាសនា',
      'មេរៀនទី៩ : រមណីយដ្ឋានទេសចរណ៍នៅកម្ពុជា',
      'មេរៀនទី១០ : សេចក្តីថ្លៃថ្នូរ',
    ]
  }
];`;

content = content.replace(/const SEA_PLM_GRADE_5 = \[\s*\{\s*chapter: 'មេរៀនទាំងអស់',\s*lessons: \[\s*'មេរៀនទី ១ : វីរជនឆ្នើម',[\s\S]*?\]\s*\}\s*\];/, newGrades);

const oldStates = `  const [activeGrade, setActiveGrade] = useState<4 | 5>(5);
  const currentCurriculum = activeGrade === 4 ? SEA_PLM_GRADE_4 : SEA_PLM_GRADE_5;`;

const newStates = `  const [activeGrade, setActiveGrade] = useState<4 | 5 | 6>(6);
  const currentCurriculum = activeGrade === 4 ? SEA_PLM_GRADE_4 : activeGrade === 5 ? SEA_PLM_GRADE_5 : SEA_PLM_GRADE_6;`;
  
content = content.replace(oldStates, newStates);

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
              <button 
                onClick={() => { setActiveGrade(6); setSelectedLesson(null); setExpandedChapters(['មេរៀនទាំងអស់']); }}
                className={\`px-3 py-1 rounded-full text-sm font-bold font-khmer \${activeGrade === 6 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}\`}
              >
                ថ្នាក់ទី៦
              </button>
            </div>`;
            
content = content.replace(oldButtons, newButtons);

fs.writeFileSync('src/components/SeaPlmTestView.tsx', content);
