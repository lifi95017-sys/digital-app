const fs = require('fs');
let content = fs.readFileSync('src/components/TeachingGlossaryModal.tsx', 'utf8');

const referenceSection = `
        {/* Reference Books Banner */}
        <div className="bg-indigo-50/50 border-b border-indigo-100 px-6 py-3 shrink-0 flex items-start gap-3">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg shrink-0 mt-0.5">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold font-khmer text-indigo-800">សៀវភៅឯកសារយោងគោល៖</h4>
            <ul className="text-xs font-khmer text-indigo-600/80 mt-1 space-y-1 list-disc list-inside">
              <li>សៀវភៅវិធីសាស្ត្របង្រៀន និងរៀននៅបឋមសិក្សា (ក្រសួងអប់រំ យុវជន និងកីឡា)</li>
              <li>សៀវភៅកម្រងឯកសារជំនួយស្មារតីស្តីពីវិធីសាស្ត្របង្រៀនសតវត្សទី២១</li>
              <li>សៀវភៅបច្ចេកទេសបង្រៀន និងការវាយតម្លៃលទ្ធផលសិក្សា</li>
            </ul>
          </div>
        </div>

        {/* Content */}`;

content = content.replace("{/* Content */}", referenceSection);

fs.writeFileSync('src/components/TeachingGlossaryModal.tsx', content);
