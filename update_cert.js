import fs from 'fs';
let code = fs.readFileSync('src/components/DigitalCertificateView.tsx', 'utf8');

// Replace left form part to add issue dates and signatures
const formAdd = `
            <div className="border-t border-slate-100 pt-4 mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 khmer-font">កាលបរិច្ឆេទទី១ (ព.ស)</label>
                <input 
                  type="text" 
                  value={issueDateLine1}
                  onChange={e => setIssueDateLine1(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-3 py-2 text-sm focus:border-indigo-500 font-khmer" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 khmer-font">កាលបរិច្ឆេទទី២ (គ.ស)</label>
                <input 
                  type="text" 
                  value={issueDateLine2}
                  onChange={e => setIssueDateLine2(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-3 py-2 text-sm focus:border-indigo-500 font-khmer" 
                />
              </div>
            </div>
`;

code = code.replace(
  'const [academicYear, setAcademicYear] = useState(\'២០២៤-២០២៥\');',
  `const [academicYear, setAcademicYear] = useState('២០២៤-២០២៥');\n  const [issueDateLine1, setIssueDateLine1] = useState('ថ្ងៃ................ខែ...................ឆ្នាំ.....................ស័ក ព.ស.២៥.......');\n  const [issueDateLine2, setIssueDateLine2] = useState('.........................ថ្ងៃទី..............ខែ.................ឆ្នាំ២០............');`
);

code = code.replace(
  '<div className="border-t border-slate-100 pt-4 mt-4 space-y-4">',
  formAdd + '\n            <div className="border-t border-slate-100 pt-4 mt-4 space-y-4">'
);

// Replace hardcoded dates in preview
code = code.replace(
  /<p className="text-base khmer-font text-slate-700">ថ្ងៃ................ខែ...................ឆ្នាំ.....................ស័ក ព.ស.២៥.......<\/p>/g,
  '<p className="text-base khmer-font text-slate-700">{issueDateLine1}</p>'
);
code = code.replace(
  /<p className="text-base khmer-font text-slate-700 mt-1">.........................ថ្ងៃទី..............ខែ.................ឆ្នាំ២០............<\/p>/g,
  '<p className="text-base khmer-font text-slate-700 mt-1">{issueDateLine2}</p>'
);

fs.writeFileSync('src/components/DigitalCertificateView.tsx', code);
