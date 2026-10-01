const fs = require('fs');
let content = fs.readFileSync('src/components/TeachingGlossaryModal.tsx', 'utf8');

const updatedReferenceSection = `
            <h4 className="text-sm font-bold font-khmer text-indigo-800">សៀវភៅឯកសារយោងគោល (ចុចដើម្បីអាន)៖</h4>
            <div className="mt-2 space-y-1.5">
              <a href="https://oer.moeys.gov.kh" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-khmer text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100/50 p-1.5 rounded-lg transition-colors">
                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                <span>សៀវភៅវិធីសាស្ត្របង្រៀន និងរៀននៅបឋមសិក្សា (ក្រសួងអប់រំ យុវជន និងកីឡា)</span>
              </a>
              <a href="https://oer.moeys.gov.kh" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-khmer text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100/50 p-1.5 rounded-lg transition-colors">
                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                <span>សៀវភៅកម្រងឯកសារជំនួយស្មារតីស្តីពីវិធីសាស្ត្របង្រៀនសតវត្សទី២១</span>
              </a>
              <a href="https://oer.moeys.gov.kh" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-khmer text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100/50 p-1.5 rounded-lg transition-colors">
                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                <span>សៀវភៅបច្ចេកទេសបង្រៀន និងការវាយតម្លៃលទ្ធផលសិក្សា</span>
              </a>
            </div>
`;

content = content.replace(
  /<h4 className="text-sm font-bold font-khmer text-indigo-800">សៀវភៅឯកសារយោងគោល៖<\/h4>[\s\S]*?<\/ul>/,
  updatedReferenceSection.trim()
);

fs.writeFileSync('src/components/TeachingGlossaryModal.tsx', content);
