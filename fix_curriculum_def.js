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

if (!content.includes('const CURRICULUM')) {
  content = content.replace(
    /export default function LessonPlanForm\(\{ onBack \}: LessonPlanFormProps\) \{/,
    curriculumDef + '\nexport default function LessonPlanForm({ onBack }: LessonPlanFormProps) {'
  );
}

if (!content.includes('const [selectedCurriculumChapter')) {
  content = content.replace(
    /const \[isGenerating, setIsGenerating\] = useState\(false\);/,
    `const [isGenerating, setIsGenerating] = useState(false);\n  const [selectedCurriculumChapter, setSelectedCurriculumChapter] = useState<any>(null);`
  );
}

fs.writeFileSync('src/components/LessonPlanForm.tsx', content);
console.log("Fixed Curriculum Definition");
