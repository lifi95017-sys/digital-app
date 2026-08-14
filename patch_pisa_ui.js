import fs from 'fs';

let content = fs.readFileSync('src/components/PisaTestView.tsx', 'utf8');

// Ensure CheckCircle2 is imported
if (!content.includes('CheckCircle2')) {
  content = content.replace('X, Loader2, Sparkles', 'X, Loader2, Sparkles, CheckCircle2');
}

const targetDiv = `        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-moul text-slate-800">តេស្ត PISA វិទ្យាសាស្ត្រ</h2>
            <div className="flex gap-2 mt-2">
              <button 
                onClick={() => { setActiveGrade(4); setSelectedLesson(null); setExpandedChapters([]); }}
                className={\`px-3 py-1 rounded-full text-sm font-bold font-khmer \${activeGrade === 4 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}\`}
              >
                ថ្នាក់ទី៤
              </button>
              <button 
                onClick={() => { setActiveGrade(5); setSelectedLesson(null); setExpandedChapters([]); }}
                className={\`px-3 py-1 rounded-full text-sm font-bold font-khmer \${activeGrade === 5 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}\`}
              >
                ថ្នាក់ទី៥
              </button>
              <button 
                onClick={() => { setActiveGrade(6); setSelectedLesson(null); setExpandedChapters([]); }}
                className={\`px-3 py-1 rounded-full text-sm font-bold font-khmer \${activeGrade === 6 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}\`}
              >
                ថ្នាក់ទី៦
              </button>
            </div>
          </div>
        </div>`;

const replaceDiv = targetDiv.replace('mb-2', 'mb-6') + `

        {/* Configuration Details Section */}
        <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100/50 mb-8">
          <h4 className="text-sm font-bold text-indigo-900 font-khmer mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            ទម្រង់តេស្ត PISA សម្រាប់ថ្នាក់ទី {activeGrade}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-2">
              <div className="mt-0.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /></div>
              <p className="text-sm text-slate-700 font-khmer">
                {activeGrade === 4 && 'រយៈពេល ៤០នាទី'}
                {activeGrade === 5 && 'រយៈពេល ៥០នាទី'}
                {activeGrade === 6 && 'រយៈពេល ៦០នាទី'}
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-0.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /></div>
              <p className="text-sm text-slate-700 font-khmer">
                {activeGrade === 4 && 'អត្ថបទខ្លីៗ ២ (ប្រហែល ១៧៥ពាក្យ)'}
                {activeGrade === 5 && 'អត្ថបទ ៣ (ប្រហែល ២៥០ពាក្យ)'}
                {activeGrade === 6 && 'អត្ថបទ ៤ (ប្រហែល ២៧៥ពាក្យ)'}
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-0.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /></div>
              <p className="text-sm text-slate-700 font-khmer">
                {activeGrade === 4 && '៩សំណួរ (ពន្យល់ ៣, វាយតម្លៃ/ស៊ើបអង្កេត ៣, បកស្រាយ ៣)'}
                {activeGrade === 5 && '១២សំណួរ (ពន្យល់ ៤, វាយតម្លៃ/ស៊ើបអង្កេត ៤, បកស្រាយ ៤)'}
                {activeGrade === 6 && '១៥សំណួរ (ពន្យល់ ៥, វាយតម្លៃ/ស៊ើបអង្កេត ៥, បកស្រាយ ៥)'}
              </p>
            </div>
          </div>
        </div>`;

content = content.replace(targetDiv, replaceDiv);
fs.writeFileSync('src/components/PisaTestView.tsx', content);
