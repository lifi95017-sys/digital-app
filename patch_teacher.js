import fs from 'fs';

let content = fs.readFileSync('src/components/TeacherAccountManagementView.tsx', 'utf8');

// Add import Download
content = content.replace("Trash2, CheckCircle2, Copy } from 'lucide-react';", "Trash2, CheckCircle2, Copy, Download } from 'lucide-react';");

// Add import XLSX
if (!content.includes('import * as XLSX')) {
    content = content.replace("import { ArrowLeft", "import * as XLSX from 'xlsx';\nimport { ArrowLeft");
}

// Add export function
const exportFunc = `  const handleExportExcel = () => {
    const worksheetData = accounts.map((acc, index) => ({
      'ល.រ': index + 1,
      'សាលារៀន': acc.school,
      'ឈ្មោះគ្រូ': acc.name,
      'កូដសម្ងាត់': acc.code,
      'កាលបរិច្ឆេទបង្កើត': acc.createdAt
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    
    // Set column widths for A4-ish format
    worksheet['!cols'] = [
      { wch: 5 },   // ល.រ
      { wch: 25 },  // សាលារៀន
      { wch: 20 },  // ឈ្មោះគ្រូ
      { wch: 15 },  // កូដសម្ងាត់
      { wch: 25 }   // កាលបរិច្ឆេទបង្កើត
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Teacher Codes');
    
    XLSX.writeFile(workbook, 'បញ្ជីគណនីគ្រូបង្រៀន_A4.xlsx');
  };
`;

if (!content.includes('handleExportExcel')) {
    content = content.replace("const saveAccounts = (newAccounts: TeacherAccount[]) => {", exportFunc + "\n  const saveAccounts = (newAccounts: TeacherAccount[]) => {");
}

// Add button
const headerHTML = `
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-black text-slate-800 font-kantumruy leading-relaxed flex items-center gap-3 mb-0">
            <KeyRound className="w-6 h-6 text-indigo-500" /> គ្រប់គ្រងលេខកូដគ្រូបង្រៀន
          </h2>
          <button
            onClick={handleExportExcel}
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white transition-colors font-bold px-4 py-2 rounded-xl text-sm"
          >
            <Download className="w-4 h-4" /> ទាញយកជា Excel (A4)
          </button>
        </div>
`;

content = content.replace(/<h2 className="text-xl font-black text-slate-800 font-kantumruy leading-relaxed mb-6 flex items-center gap-3">[\s\S]*?<\/h2>/, headerHTML.trim());

fs.writeFileSync('src/components/TeacherAccountManagementView.tsx', content);
