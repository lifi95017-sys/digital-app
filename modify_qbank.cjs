const fs = require('fs');
let content = fs.readFileSync('src/components/QuestionBankView.tsx', 'utf8');

content = content.replace(
  "export default function QuestionBankView() {",
  "import { ArrowLeft } from 'lucide-react';\n\ninterface Props {\n  onBack?: () => void;\n}\n\nexport default function QuestionBankView({ onBack }: Props) {"
);

content = content.replace(
  "import { BookOpen, Search, ChevronDown, ChevronRight, FileQuestion } from 'lucide-react';",
  "import { BookOpen, Search, ChevronDown, ChevronRight, FileQuestion } from 'lucide-react';"
);

// We've already added ArrowLeft import above, but we need to ensure it's not duplicate. It's safer to just inject the Back button into the UI.

content = content.replace(
  /<div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center relative">/,
  `{onBack && (
        <button 
          onClick={onBack}
          className="mb-6 w-12 h-12 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center text-slate-500 hover:text-slate-700 shadow-sm transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center relative">`
);

fs.writeFileSync('src/components/QuestionBankView.tsx', content);
