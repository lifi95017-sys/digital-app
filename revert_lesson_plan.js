import fs from 'fs';

let content = fs.readFileSync('src/components/LessonPlanForm.tsx', 'utf8');

const curriculumDef = `
const CURRICULUM: Record<number, Record<string, any>> = {
  4: {
    'វិទ្យាសាស្ត្រ': [
      {
        chapter: '១',
        chapterTitle: 'រុក្ខជាតិ',
        lessons: [
          { lesson: '១', lessonTitle: 'បរិស្ថានធម្មជាតិ' },
          { lesson: '២', lessonTitle: 'ផលប្រយោជន៍រុក្ខជាតិ' },
          { lesson: '៣', lessonTitle: 'វដ្ដជីវិតរបស់រុក្ខជាតិ' },
          { lesson: '៤', lessonTitle: 'ចំណែកថ្នាក់សត្វ' },
        ]
      },
      {
        chapter: '២',
        chapterTitle: 'មនុស្សនិងសុខភាព',
        lessons: [
          { lesson: '១', lessonTitle: 'គ្រោងឆ្អឹងនិងសាច់ដុំ' },
          { lesson: '២', lessonTitle: 'ភ្នែក' },
          { lesson: '៣', lessonTitle: 'ជំងឺគ្រុនឈាមនិងគ្រុនចាញ់' },
        ]
      },
      {
        chapter: '៣',
        chapterTitle: 'រូបធាតុនិងថាមពល',
        lessons: [
          { lesson: '១', lessonTitle: 'លក្ខណៈនៃរូបធាតុ' },
          { lesson: '២', lessonTitle: 'កម្លាំងនិងចលនា' },
          { lesson: '៣', lessonTitle: 'ឃ្នាស់' },
        ]
      },
      {
        chapter: '៤',
        chapterTitle: 'ផែនដីនិងបរិស្ថាន',
        lessons: [
          { lesson: '១', lessonTitle: 'កង្វក់ទឹក' },
          { lesson: '២', lessonTitle: 'រង្វិលរបស់ផែនដី' },
        ]
      }
    ]
  }
};
`;

content = content.replace(curriculumDef + '\n', '');

const uiToRemove = `
                {CURRICULUM[plan.grade] && CURRICULUM[plan.grade][plan.subject] && (
                  <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-4">
                    <label className="text-xs font-black text-indigo-800 uppercase tracking-widest mb-3 block flex items-center gap-2">
                      <BookOpen className="w-4 h-4" /> ជ្រើសរើសពីកម្មវិធីសិក្សា
                    </label>
                    <div className="space-y-3">
                      <select 
                        className="w-full px-4 py-2 bg-white border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-khmer text-sm"
                        onChange={(e) => {
                          const chap = CURRICULUM[plan.grade][plan.subject].find((c: any) => c.chapter === e.target.value);
                          setSelectedCurriculumChapter(chap);
                          if (chap) {
                            setPlan({...plan, chapter: chap.chapter, chapterTitle: chap.chapterTitle, lesson: '', lessonTitle: ''});
                          }
                        }}
                        value={selectedCurriculumChapter ? selectedCurriculumChapter.chapter : ''}
                      >
                        <option value="">-- ជ្រើសរើសជំពូក --</option>
                        {CURRICULUM[plan.grade][plan.subject].map((c: any) => (
                          <option key={c.chapter} value={c.chapter}>ជំពូកទី {c.chapter}៖ {c.chapterTitle}</option>
                        ))}
                      </select>
                      
                      {selectedCurriculumChapter && (
                        <select
                          className="w-full px-4 py-2 bg-white border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-khmer text-sm"
                          onChange={(e) => {
                            const les = selectedCurriculumChapter.lessons.find((l: any) => l.lesson === e.target.value);
                            if (les) {
                              setPlan({...plan, lesson: les.lesson, lessonTitle: les.lessonTitle});
                            }
                          }}
                          value={plan.lesson}
                        >
                          <option value="">-- ជ្រើសរើសមេរៀន --</option>
                          {selectedCurriculumChapter.lessons.map((l: any) => (
                            <option key={l.lesson} value={l.lesson}>មេរៀនទី {l.lesson}៖ {l.lessonTitle}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                )}
`;

content = content.replace(uiToRemove + '\n', '');
content = content.replace(/const \[selectedCurriculumChapter, setSelectedCurriculumChapter\] = useState<any>\(null\);\n  /, '');

fs.writeFileSync('src/components/LessonPlanForm.tsx', content);
console.log("Reverted");
