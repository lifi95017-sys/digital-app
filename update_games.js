import fs from 'fs';

let content = fs.readFileSync('src/components/EducationalGamesView.tsx', 'utf8');

// 1. Add 'list' to the activeTab state
content = content.replace(
  `const [activeTab, setActiveTab] = useState<'quiz' | 'teams' | 'custom'>('quiz');`,
  `const [activeTab, setActiveTab] = useState<'quiz' | 'teams' | 'custom' | 'list'>('quiz');`
);

// 2. Add the List Tab icon in the header
content = content.replace(
  `import { ChevronLeft, Gamepad2, Play, Users, Plus, Trophy, CheckCircle2, XCircle } from 'lucide-react';`,
  `import { ChevronLeft, Gamepad2, Play, Users, Plus, Trophy, CheckCircle2, XCircle, List } from 'lucide-react';`
);

content = content.replace(
  `<button
            onClick={() => setActiveTab('custom')}
            className={\`flex-1 md:flex-none px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 \${
              activeTab === 'custom' ? 'bg-white text-orange-600 shadow-lg' : 'text-white/80 hover:text-white'
            }\`}
          >
            <Plus className="w-4 h-4" /> បង្កើតសំណួរ
          </button>
        </div>`,
  `<button
            onClick={() => setActiveTab('custom')}
            className={\`flex-1 md:flex-none px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 \${
              activeTab === 'custom' ? 'bg-white text-orange-600 shadow-lg' : 'text-white/80 hover:text-white'
            }\`}
          >
            <Plus className="w-4 h-4" /> បង្កើតសំណួរ
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={\`flex-1 md:flex-none px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 \${
              activeTab === 'list' ? 'bg-white text-orange-600 shadow-lg' : 'text-white/80 hover:text-white'
            }\`}
          >
            <List className="w-4 h-4" /> បញ្ជីល្បែង
          </button>
        </div>`
);

// 3. Add the 'list' tab content before </AnimatePresence>
const listContent = `
        {activeTab === 'list' && (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-xl border border-slate-100 max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center shadow-inner">
                <List className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black font-kantumruy text-slate-800">បញ្ជីល្បែងសិក្សាទាំង ៥៨</h2>
                <p className="text-slate-500 text-sm mt-1">គំនិតល្បែងសិក្សាសម្រាប់យកទៅអនុវត្តក្នុងថ្នាក់រៀន</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                "១. ល្បែងវេវចនសព្ទ",
                "២. ល្បែងរៀបបណ្ណអក្សរ",
                "៣. ល្បែងប្រដាប់ស្វែងរកចំនួន",
                "៤. ល្បែងប្រជែងពីជគណិត",
                "៥. ល្បែងទំនាញលេខ",
                "៦. ល្បែងទះក្ដារខៀន",
                "៧. ល្បែងកាតចងចាំ",
                "៨. ល្បែងទស្សន៍ទាយអក្សរ",
                "៩. ល្បែងតម្រៀបកាត",
                "១០. ល្បែងផ្គុំរូប",
                "១១. ល្បែងស្វែងរកលេខ",
                "១២. ល្បែងស្វែងរកពណ៌",
                "១៣. ល្បែងកាតដូមីណូ",
                "១៤. ល្បែងភ្ជាប់ពាក្យ",
                "១៥. ល្បែងប្រមូលពាក្យ",
                "១៦. ល្បែងរកចំណុចខុស",
                "១៧. ល្បែងធ្វើត្រាប់តាម",
                "១៨. ល្បែងផ្លែចេក",
                "១៩. ល្បែងនិយាយបណ្ដាក់គ្នា",
                "២០. ល្បែងទិញផ្លែឈើ",
                "២១. ល្បែងលាក់ខ្លួនក្នុងរូបភាព",
                "២២. ល្បែងបិទមុខ សួរសំណួរ",
                "២៣. ល្បែង ទាយឈ្មោះវត្ថុដែលប្ដូរទីតាំង",
                "២៤. ល្បែង មួយ ពីរ បី",
                "២៥. ល្បែង មើលមាត់ខ្ញុំ",
                "២៦. ល្បែងឆ្លើយថា បាទ/ចាស!",
                "២៧. ល្បែងចងចាំ",
                "២៨. ល្បែងរាប់លេខទៅមុខនិងថយក្រោយ",
                "២៩. ល្បែងបង្កើតរឿង",
                "៣០. ល្បែងបូកលេខ",
                "៣១. ល្បែងចរាចរណ៍",
                "៣២. ល្បែងប្រាប់ទីតាំង",
                "៣៣. ល្បែង កន្លែងអង្គុយក្ដៅ",
                "៣៤. ល្បែងសរសេរតាមអានរត់",
                "៣៥. ល្បែង សរសេរពាក្យប្រណាំងគ្នា",
                "៣៦. ល្បែងរាប់លេខ",
                "៣៧. ល្បែង ទឹក ដី អាកាស",
                "៣៨. ល្បែង ស្ដាំ ឬ ឆ្វេង",
                "៣៩. ល្បែង ទេវតាថា",
                "៤០. ល្បែង ឆ្លើយខុស",
                "៤១. ល្បែង ត្រូវ ខុស",
                "៤២. ល្បែង ខ្សឹបបណ្ដាក់គ្នា",
                "៤៣. ល្បែង សរសេរបណ្ដាក់គ្នា",
                "៤៤. ល្បែង ដំឡូងក្ដៅ",
                "៤៥. ល្បែង ស្វែងរកពាក្យ",
                "៤៦. ល្បែង គំនិតច្នៃប្រឌិត",
                "៤៧. ល្បែង និយាយផ្សេង ធ្វើផ្សឹង",
                "៤៨. ល្បែងឆ្មាចាប់កណ្ដុរ",
                "៤៩. ល្បែងចលនាម្រាមដៃ",
                "៥០. ល្បែង ពាក្យនិងនិយមន័យ",
                "៥១. ល្បែង ទះដៃ",
                "៥២. ល្បែង ហ្សីប ហ្សែប ហ្សប់",
                "៥៣. ល្បែង ចលនារាងកាយ",
                "៥៤. ល្បែង ស្អិតៗ",
                "៥៥. ល្បែង ទះដៃ ឬ មិនទះដៃ",
                "៥៦. ល្បែង ទស្សន៍ទាយអាយុ",
                "៥៧. ល្បែង អាហារដែលចូលចិត្ត",
                "៥៨. ល្បែង ទស្សន៍ទាយពាក្យតំណាងលេខ"
              ].map((game, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-xl hover:bg-orange-50 transition-colors border border-transparent hover:border-orange-100 group cursor-default">
                  <div className="w-2 h-2 rounded-full bg-orange-300 group-hover:bg-orange-500 transition-colors"></div>
                  <span className="text-slate-700 font-bold text-sm leading-relaxed">{game}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
`;

content = content.replace(
  `      </AnimatePresence>
    </div>
  );
}`,
  listContent + `
      </AnimatePresence>
    </div>
  );
}`
);

fs.writeFileSync('src/components/EducationalGamesView.tsx', content);
console.log("updated");
