const fs = require('fs');
let content = fs.readFileSync('src/components/LessonPlanForm.tsx', 'utf8');

// 1. Add state for reference file
content = content.replace(
  "const [showSlideGenerator, setShowSlideGenerator] = useState(false);",
  "const [showSlideGenerator, setShowSlideGenerator] = useState(false);\n  const [referenceFile, setReferenceFile] = useState<{name: string, url: string} | null>(null);"
);

// 2. Add handler for reference file
const handler = `
  const handleReferenceFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setReferenceFile({ name: file.name, url });
    }
  };
`;

content = content.replace(
  "const handleSchoolLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {",
  handler + "\n  const handleSchoolLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {"
);

// 3. Add UI element for uploading and viewing reference file
const ui = `
                <div>
                  <div className="flex items-center justify-between pl-2 mb-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">សៀវភៅឯកសារយោង (Reference Document)</label>
                    {referenceFile && (
                      <a 
                        href={referenceFile.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] sm:text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2 sm:px-3 py-1 rounded-full flex items-center gap-1.5 transition-colors"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        មើលឯកសារ
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-2 w-full px-5 py-3 bg-slate-50 rounded-xl focus-within:ring-2 focus-within:ring-emerald-500 font-khmer text-sm">
                    <input 
                      type="file" 
                      accept=".pdf,.doc,.docx,.jpg,.png" 
                      onChange={handleReferenceFileUpload} 
                      className="w-full text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" 
                    />
                  </div>
                </div>
`;

content = content.replace(
  "<div>\n                  <label className=\"text-xs font-black text-slate-400 uppercase tracking-widest pl-2 mb-2 block\">ឡូហ្គូសាលា (បើមាន)</label>",
  ui + "\n                <div>\n                  <label className=\"text-xs font-black text-slate-400 uppercase tracking-widest pl-2 mb-2 block\">ឡូហ្គូសាលា (បើមាន)</label>"
);

fs.writeFileSync('src/components/LessonPlanForm.tsx', content);
