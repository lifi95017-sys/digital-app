import fs from 'fs';
let content = fs.readFileSync('src/components/SeaPlmTestView.tsx', 'utf8');

const replacementData = `
interface SeaPlmTestViewProps {
  onBack: () => void;
  files: LibraryFile[];
  onSaveFile: (file: LibraryFile) => void;
  onDeleteFile: (id: string) => void;
}

const SEA_PLM_GRADE_4 = [
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

export default function SeaPlmTestView({ onBack, files, onSaveFile, onDeleteFile }: SeaPlmTestViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedChapters, setExpandedChapters] = useState<string[]>(['មេរៀនទាំងអស់']);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

  const [activeGrade, setActiveGrade] = useState<4>(4);
  const currentCurriculum = SEA_PLM_GRADE_4;

  const toggleChapter = (chapter: string) => {
`;

// Replace props and data
content = content.replace(/interface PisaTestViewProps[\s\S]*?const toggleChapter = \(chapter: string\) => \{/, replacementData);

// Update title
const uiReplace = `<h2 className="text-2xl font-moul text-slate-800">តេស្ត SEA-PLM</h2>
            <div className="flex gap-2 mt-2">
              <button 
                className="px-3 py-1 rounded-full text-sm font-bold font-khmer bg-indigo-600 text-white"
              >
                ថ្នាក់ទី៤
              </button>
            </div>`;
content = content.replace(/<h2 className="text-2xl font-moul text-slate-800">តេស្ត PISA វិទ្យាសាស្ត្រ<\/h2>\s*<div className="flex gap-2 mt-2">[\s\S]*?<\/div>/, uiReplace);

content = content.replace(/បន្ថែមតេស្ត PISA/g, "បន្ថែមតេស្ត SEA-PLM");
content = content.replace(/មិនទាន់មានវិញ្ញាសារតេស្ត PISA/g, "មិនទាន់មានវិញ្ញាសារតេស្ត SEA-PLM");
content = content.replace(/វិញ្ញាសារតេស្ត PISA/g, "វិញ្ញាសារតេស្ត SEA-PLM");

fs.writeFileSync('src/components/SeaPlmTestView.tsx', content);
