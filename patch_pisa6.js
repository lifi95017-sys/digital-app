import fs from 'fs';
let content = fs.readFileSync('src/components/PisaTestView.tsx', 'utf8');

const science6 = `
const SCIENCE_GRADE_6 = [
  {
    chapter: 'ជំពូកទី ១៖ រុក្ខជាតិនិងសត្វ',
    lessons: [
      'មេរៀនទី ១៖ ការរៀបចំខ្លួនរបស់រុក្ខជាតិ',
      'មេរៀនទី ២៖ ការដកដង្ហើម',
      'មេរៀនទី ៣៖ ការបន្តពូជរបស់សត្វ',
    ]
  },
  {
    chapter: 'ជំពូកទី ២៖ បរិស្ថាន',
    lessons: [
      'មេរៀនទី ៤៖ បរិស្ថានធម្មជាតិ',
      'មេរៀនទី ៥៖ ធនធានធម្មជាតិ',
    ]
  },
  {
    chapter: 'ជំពូកទី ៣៖ មនុស្សនិងសុខភាព',
    lessons: [
      'មេរៀនទី ៦៖ ប្រព័ន្ធបន្តពូជមនុស្ស',
      'មេរៀនទី ៧៖ ការការពារខ្លួន',
      'មេរៀនទី ៨៖ ការការពារការគំរាមកំហែងផ្លូវភេទ',
      'មេរៀនទី ៩៖ សុខភាពបន្តពូជ',
      'មេរៀនទី ១០៖ ប្រព័ន្ធរំលាយអាហារ',
      'មេរៀនទី ១១៖ ប្រព័ន្ធរបត់ឈាម',
    ]
  },
  {
    chapter: 'ជំពូកទី ៤៖ រូបធាតុ',
    lessons: [
      'មេរៀនទី ១២៖ ការប្រែប្រួលរូបធាតុ',
      'មេរៀនទី ១៣៖ អង្គធាតុសុទ្ធនិងល្បាយ',
    ]
  },
  {
    chapter: 'ជំពូកទី ៥៖ ម៉ាស៊ីនងាយនិងអគ្គិសនី',
    lessons: [
      'មេរៀនទី ១៤៖ ម៉ាស៊ីនងាយ',
      'មេរៀនទី ១៥៖ អគ្គិសនី',
    ]
  },
  {
    chapter: 'ជំពូកទី ៦៖ ផែនដី',
    lessons: [
      'មេរៀនទី ១៦៖ អាកាសធាតុ',
      'មេរៀនទី ១៧៖ ក្រុមផ្កាយ',
    ]
  }
];

export default function PisaTestView
`;

content = content.replace("export default function PisaTestView", science6);

const activeGradeState = `  const [activeGrade, setActiveGrade] = useState<4 | 5 | 6>(6);
  const currentCurriculum = activeGrade === 4 ? SCIENCE_GRADE_4 : activeGrade === 5 ? SCIENCE_GRADE_5 : SCIENCE_GRADE_6;

  const toggleChapter = (chapter: string) => {`;
  
content = content.replace(/  const \[activeGrade, setActiveGrade\] = useState<4 \| 5>\(5\);\n  const currentCurriculum = activeGrade === 4 \? SCIENCE_GRADE_4 : SCIENCE_GRADE_5;\n\n  const toggleChapter = \(chapter: string\) => \{/, activeGradeState);

const uiReplace = `<h2 className="text-2xl font-moul text-slate-800">តេស្ត PISA វិទ្យាសាស្ត្រ</h2>
            <div className="flex gap-2 mt-2">
              <button 
                onClick={() => { setActiveGrade(4); setSelectedLesson(null); setExpandedChapters([]); }}
                className={\`px-3 py-1 rounded-full text-sm font-bold font-khmer \${activeGrade === 4 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}\`}
              >
                ថ្នាក់ទី៤
              </button>
              <button 
                onClick={() => { setActiveGrade(5); setSelectedLesson(null); setExpandedChapters([]); }}
                className={\`px-3 py-1 rounded-full text-sm font-bold font-khmer \${activeGrade === 5 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}\`}
              >
                ថ្នាក់ទី៥
              </button>
              <button 
                onClick={() => { setActiveGrade(6); setSelectedLesson(null); setExpandedChapters([]); }}
                className={\`px-3 py-1 rounded-full text-sm font-bold font-khmer \${activeGrade === 6 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}\`}
              >
                ថ្នាក់ទី៦
              </button>
            </div>`;
content = content.replace(/<h2 className="text-2xl font-moul text-slate-800">តេស្ត PISA វិទ្យាសាស្ត្រ<\/h2>\s*<div className="flex gap-2 mt-2">[\s\S]*?<\/div>/, uiReplace);

fs.writeFileSync('src/components/PisaTestView.tsx', content);
