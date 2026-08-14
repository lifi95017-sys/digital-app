import fs from 'fs';

let content = fs.readFileSync('src/components/EducationalGamesView.tsx', 'utf8');

// Add import Download from lucide-react
content = content.replace('List\n} from \'lucide-react\';', 'List,\n  Download\n} from \'lucide-react\';');

// Add xlsx import
if (!content.includes('import * as XLSX')) {
    content = content.replace("import { educationalGamesListData", "import * as XLSX from 'xlsx';\nimport { educationalGamesListData");
}

// Add export function
const exportFunc = `  const handleExportExcel = () => {
    const worksheetData = educationalGamesListData.map(game => ({
      'ល.រ': game.id,
      'ឈ្មោះល្បែង': game.title,
      'របៀបលេង': game.howToPlay,
      'លក្ខខណ្ឌ': game.condition,
      'លទ្ធផលទទួលបាន': game.result
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    
    // Set column widths for A4-ish format
    worksheet['!cols'] = [
      { wch: 5 },   // ល.រ
      { wch: 25 },  // ឈ្មោះល្បែង
      { wch: 50 },  // របៀបលេង
      { wch: 35 },  // លក្ខខណ្ឌ
      { wch: 35 }   // លទ្ធផល
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Games');
    
    XLSX.writeFile(workbook, 'បញ្ជីល្បែងសិក្សា_A4.xlsx');
  };
`;

if (!content.includes('handleExportExcel')) {
    content = content.replace("export default function EducationalGamesView({ onBack }: { onBack: () => void }) {\n", "export default function EducationalGamesView({ onBack }: { onBack: () => void }) {\n" + exportFunc);
}

// Add button
const headerHTML = `
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-100 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center shadow-inner shrink-0">
                  <List className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-black font-kantumruy text-slate-800">បញ្ជីល្បែងសិក្សាទាំង ៥៨</h2>
                  <p className="text-slate-500 text-sm mt-1">ព័ត៌មានលម្អិតពីរបៀបលេង លក្ខខណ្ឌ និងលទ្ធផលទទួលបាន</p>
                </div>
              </div>
              <button
                onClick={handleExportExcel}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> ទាញយកជា Excel (A4)
              </button>
            </div>
`;

content = content.replace(/<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-100 pb-6">[\s\S]*?<\/div>\s*<\/div>/, headerHTML.trim());

fs.writeFileSync('src/components/EducationalGamesView.tsx', content);
