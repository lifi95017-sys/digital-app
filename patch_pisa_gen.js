import fs from 'fs';
let content = fs.readFileSync('src/components/PisaTestView.tsx', 'utf8');

const imports = `import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, Search, Plus, FileText, Trash2, Download, BookOpen, ChevronDown, ChevronRight, X, Loader2, Sparkles
} from 'lucide-react';
import { LibraryFile } from '../types';
import Markdown from 'react-markdown';
import { saveAs } from 'file-saver';`;

content = content.replace(/import React, \{ useState \} from 'react';\nimport \{ motion, AnimatePresence \} from 'motion\/react';\nimport \{[\s\S]*?\} from 'lucide-react';\nimport \{ LibraryFile \} from '\.\.\/types';/, imports);

const states = `  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

  const [activeGrade, setActiveGrade] = useState<4 | 5 | 6>(6);
  const currentCurriculum = activeGrade === 4 ? SCIENCE_GRADE_4 : activeGrade === 5 ? SCIENCE_GRADE_5 : SCIENCE_GRADE_6;
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [viewingFile, setViewingFile] = useState<LibraryFile | null>(null);
  
  const contentRef = useRef<HTMLDivElement>(null);

  const handleGeneratePisa = async () => {
    if (!selectedLesson) return;
    setIsGenerating(true);
    setShowGenerateModal(true);
    setGeneratedText('');
    
    try {
      const response = await fetch('/api/generatePisaTest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lesson: selectedLesson,
          grade: activeGrade,
          subject: 'វិទ្យាសាស្ត្រ'
        }),
      });
      
      const data = await response.json();
      if (response.ok) {
        setGeneratedText(data.text);
      } else {
        setGeneratedText('សូមអភ័យទោស មានបញ្ហាក្នុងការបង្កើតតេស្ត PISA៖ ' + (data.error || ''));
      }
    } catch (err) {
      setGeneratedText('សូមអភ័យទោស មានបញ្ហាក្នុងការបង្កើតតេស្ត PISA។');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveGeneratedTest = () => {
    if (!generatedText) return;
    const newFile: LibraryFile = {
      id: Date.now().toString(),
      title: \`តេស្ត PISA: \${selectedLesson}\`,
      grade: activeGrade,
      subject: 'វិទ្យាសាស្ត្រ',
      date: new Date().toLocaleDateString('en-GB'),
      fileName: \`PISA_Test_\${selectedLesson}.doc\`,
      fileData: 'markdown:' + generatedText
    };
    onSaveFile(newFile);
    setShowGenerateModal(false);
  };
  
  const exportToWord = (htmlContent: string, fileName: string) => {
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + "<div style='font-family: Khmer OS Siemreap, Arial; font-size: 14pt; line-height: 1.5;'>" + htmlContent + "</div>" + footer;
    const blob = new Blob(['\\ufeff', sourceHTML], { type: 'application/msword' });
    saveAs(blob, fileName);
  };

  const handleDownloadWord = () => {
    if (contentRef.current) {
      exportToWord(contentRef.current.innerHTML, \`PISA_\${selectedLesson}.doc\`);
    }
  };
  
  const handleDownloadExistingWord = (file: LibraryFile) => {
    // If we are viewing it, we can use the ref. If not, we have to render it first.
    // For simplicity, we just download it from the viewing modal.
  };
`;

content = content.replace(/  const \[selectedLesson, setSelectedLesson\] = useState<string \| null>\(null\);\n\n  const \[activeGrade, setActiveGrade\] = useState<4 \| 5 \| 6>\(6\);\n  const currentCurriculum = activeGrade === 4 \? SCIENCE_GRADE_4 : activeGrade === 5 \? SCIENCE_GRADE_5 : SCIENCE_GRADE_6;/, states);

const buttonReplace = `                    <button onClick={handleGeneratePisa} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-khmer text-sm shadow-sm">
                      <Sparkles className="w-4 h-4" />
                      AI បង្កើតតេស្ត PISA
                    </button>`;
content = content.replace(/<button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-khmer text-sm">\s*<Plus className="w-4 h-4" \/>\s*បន្ថែមតេស្ត PISA\s*<\/button>/, buttonReplace);

const emptyButtonReplace = `                      <button onClick={handleGeneratePisa} className="mt-4 px-6 py-2 bg-indigo-100 text-indigo-700 rounded-xl hover:bg-indigo-200 transition-colors font-khmer font-bold flex items-center gap-2">
                        <Sparkles className="w-5 h-5" /> AI បង្កើតតេស្តថ្មី
                      </button>`;
content = content.replace(/<p className="text-sm text-slate-400 mt-2 font-khmer">សូមចុចប៊ូតុង "បន្ថែមតេស្ត PISA" ដើម្បីបញ្ចូលឯកសារថ្មី<\/p>/, `<p className="text-sm text-slate-400 mt-2 font-khmer">សូមប្រើប្រាស់ AI ដើម្បីបង្កើតវិញ្ញាសារថ្មីដោយស្វ័យប្រវត្តិ</p>\n` + emptyButtonReplace);

const fileListReplace = `                      {files.filter(f => f.title.includes(selectedLesson)).map(f => (
                         <div key={f.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setViewingFile(f)}>
                           <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                               <FileText className="w-5 h-5 text-indigo-500" />
                             </div>
                             <div>
                               <p className="font-bold text-slate-800 font-khmer">{f.title}</p>
                               <p className="text-xs text-slate-500">{f.date}</p>
                             </div>
                           </div>
                           <button onClick={(e) => { e.stopPropagation(); onDeleteFile(f.id); }} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                             <Trash2 className="w-4 h-4" />
                           </button>
                         </div>
                      ))}`;
content = content.replace(/\{files\.filter\(f => f\.title\.includes\(selectedLesson\)\)\.map\(f => \([\s\S]*?\}\)\)/, fileListReplace);

const modalRender = `
      {/* Generate Modal */}
      <AnimatePresence>
        {showGenerateModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-indigo-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-moul text-lg text-slate-800">AI បង្កើតតេស្ត PISA</h3>
                    <p className="text-sm font-khmer text-slate-500">{selectedLesson}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowGenerateModal(false)}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-8 flex-1 overflow-y-auto bg-slate-50">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
                    <h4 className="font-moul text-lg text-indigo-900 mb-2">កំពុងរៀបចំវិញ្ញាសារតេស្ត...</h4>
                    <p className="text-slate-500 font-khmer max-w-md">AI កំពុងវិភាគមេរៀន និងបង្កើតសំណួរតាមស្តង់ដារ PISA ដែលមាន ៣ កម្រិត (ពន្យល់បាតុភូត វាយតម្លៃការស៊ើបអង្កេត និងបកស្រាយទិន្នន័យ)។</p>
                  </div>
                ) : (
                  <div className="bg-white p-10 rounded-xl shadow-sm border border-slate-200 min-h-[297mm] max-w-[210mm] mx-auto text-slate-800">
                    <div ref={contentRef} className="markdown-body font-khmer">
                      <Markdown>{generatedText}</Markdown>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-6 border-t border-slate-100 bg-white flex justify-between items-center">
                <div className="text-sm text-slate-500 font-khmer">
                  {!isGenerating && generatedText && "វិញ្ញាសារត្រូវបានបង្កើតដោយជោគជ័យ"}
                </div>
                <div className="flex gap-3">
                  {!isGenerating && generatedText && (
                    <>
                      <button 
                        onClick={handleDownloadWord}
                        className="px-6 py-2.5 rounded-xl font-bold font-khmer flex items-center gap-2 border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Download className="w-5 h-5" />
                        ទាញយកជា Word
                      </button>
                      <button 
                        onClick={saveGeneratedTest}
                        className="px-6 py-2.5 rounded-xl font-bold font-khmer flex items-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm"
                      >
                        <FileText className="w-5 h-5" />
                        រក្សាទុកក្នុង App
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Modal */}
      <AnimatePresence>
        {viewingFile && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-bold font-khmer text-lg text-slate-800">{viewingFile.title}</h3>
                    <p className="text-sm font-khmer text-slate-500">{viewingFile.date}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setViewingFile(null)}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-8 flex-1 overflow-y-auto bg-slate-100">
                <div className="bg-white p-10 rounded-xl shadow-sm border border-slate-200 min-h-[297mm] max-w-[210mm] mx-auto text-slate-800">
                  <div ref={contentRef} className="markdown-body font-khmer">
                    <Markdown>{viewingFile.fileData.replace('markdown:', '')}</Markdown>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-slate-100 bg-white flex justify-end">
                <button 
                  onClick={handleDownloadWord}
                  className="px-6 py-2.5 rounded-xl font-bold font-khmer flex items-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  <Download className="w-5 h-5" />
                  ទាញយកជា Word
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
`;

content = content.replace(/    <\/div>\n  \);\n\}/, modalRender + '\n}');

fs.writeFileSync('src/components/PisaTestView.tsx', content);
