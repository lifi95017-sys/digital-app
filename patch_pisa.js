import fs from 'fs';
let content = fs.readFileSync('src/components/PisaTestView.tsx', 'utf8');

const science5 = `
const SCIENCE_GRADE_5 = [
  {
    chapter: 'ជំពូកទី១៖ រុក្ខជាតិនិងសត្វ',
    lessons: [
      'មេរៀនទី១៖ ការបន្តពូករបស់រុក្ខជាតិ',
      'មេរៀនទី២៖ ការលូតលាស់របស់គ្រាប់ពូជ',
      'មេរៀនទី៣៖ ការបន្តពូជរបស់សត្វ',
    ]
  },
  {
    chapter: 'ជំពូកទី២៖ បរិស្ថាន',
    lessons: [
      'មេរៀនទី១៖ បរិស្ថានធម្មជាតិ',
      'មេរៀនទី២៖ ការកាត់បន្ថយកង្វក់និងសារធាតុបំពុលបរិស្ថាន',
      'មេរៀនទី៣៖ ដី',
    ]
  },
  {
    chapter: 'ជំពូកទី៣៖ មនុស្សនិងជំងឺ',
    lessons: [
      'មេរៀនទី១៖ អាហារដើម្បីសុខភាព',
      'មេរៀនទី២៖ ការបរិភោគអាហារនិងទឹកគ្មានអនាម័យ',
      'មេរៀនទី៣៖ ការចាក់វ៉ាក់សាំង',
    ]
  },
  {
    chapter: 'ជំពូកទី៤៖ រូបធាតុនិងថាមពល',
    lessons: [
      'មេរៀនទី១៖ រង្វាស់ រូបធាតុ និងកម្ដៅ',
      'មេរៀនទី២៖ កម្លាំងកកិត',
      'មេរៀនទី៣៖ អគ្គិសនី',
    ]
  },
  {
    chapter: 'ជំពូកទី៥៖ លំហ',
    lessons: [
      'មេរៀនទី១៖ ព្រះអាទិត្យ',
      'មេរៀនទី២៖ ប្រព័ន្ធព្រះអាទិត្យនិងភពរណបផ្សេងៗ',
    ]
  }
];

export default function PisaTestView
`;

content = content.replace("export default function PisaTestView", science5);

const activeGradeState = `  const [activeGrade, setActiveGrade] = useState<4 | 5>(5);
  const currentCurriculum = activeGrade === 4 ? SCIENCE_GRADE_4 : SCIENCE_GRADE_5;

  const toggleChapter = (chapter: string) => {`;
  
content = content.replace("const toggleChapter = (chapter: string) => {", activeGradeState);

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
            </div>`;
content = content.replace(/<h2 className="text-2xl font-moul text-slate-800">តេស្ត PISA វិទ្យាសាស្ត្រ<\/h2>\s*<p className="text-slate-500 font-khmer mt-1">កម្មវិធីសិក្សាថ្នាក់ទី៤<\/p>/, uiReplace);

content = content.replace(/\{SCIENCE_GRADE_4\.map/g, "{currentCurriculum.map");

fs.writeFileSync('src/components/PisaTestView.tsx', content);
