import fs from 'fs';

let content = fs.readFileSync('src/components/SeaPlmTestView.tsx', 'utf8');

// We need to add all missing imports and state variables
const newImports = `import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, Search, Plus, FileText, Trash2, Download, BookOpen, ChevronDown, ChevronRight, X, Loader2, Sparkles
} from 'lucide-react';
import { LibraryFile } from '../types';
import Markdown from 'react-markdown';
import { saveAs } from 'file-saver';`;

// Replace old imports
content = content.replace(/import React, { useState } from 'react';[\s\S]*?import { LibraryFile } from '\.\.\/types';/, newImports);

// Find the component function start
const componentStart = `export default function SeaPlmTestView({ onBack, files, onSaveFile, onDeleteFile }: SeaPlmTestViewProps) {`;

const newStates = `  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [viewingFile, setViewingFile] = useState<LibraryFile | null>(null);
  
  const contentRef = useRef<HTMLDivElement>(null);

  const handleGenerateSeaPlm = async () => {
    if (!selectedLesson) return;
    setIsGenerating(true);
    setShowGenerateModal(true);
    setGeneratedText('');
    
    try {
      const response = await fetch('/api/generateSeaPlmTest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lesson: selectedLesson,
          grade: activeGrade,
          subject: 'ភាសាខ្មែរ'
        }),
      });
      
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setGeneratedText('សូមអភ័យទោស មានបញ្ហាក្នុងការបង្កើតតេស្ត SEA-PLM៖ ' + (data.error || 'Server error'));
        return;
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error('No reader');
      
      let fullText = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split('\\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (dataStr === '[DONE]') continue;
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.text) {
                fullText += parsed.text;
                setGeneratedText(fullText);
              }
            } catch (e) {}
          }
        }
      }
    } catch (error) {
      console.error('Error generating SEA-PLM test:', error);
      setGeneratedText('សូមអភ័យទោស មានបញ្ហាក្នុងការបង្កើតតេស្ត SEA-PLM។ សូមសាកល្បងម្ដងទៀត។');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadWord = () => {
    const textToDownload = viewingFile ? viewingFile.fileData.replace('markdown:', '') : generatedText;
    if (!textToDownload) return;
    
    const htmlContent = \`
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>\${viewingFile ? viewingFile.title : 'តេស្ត_SEA_PLM'}</title>
        <style>
          body { font-family: 'Khmer OS Battambang', sans-serif; font-size: 12pt; line-height: 1.5; }
          h1, h2, h3 { font-family: 'Khmer OS Muol Light', sans-serif; text-align: center; }
          p { margin-bottom: 10pt; }
        </style>
      </head>
      <body>\${textToDownload.replace(/\\n/g, '<br>')}</body>
      </html>
    \`;
    
    const blob = new Blob(['\\ufeff', htmlContent], { type: 'application/msword' });
    saveAs(blob, \`\${viewingFile ? viewingFile.title : 'តេស្ត_SEA_PLM'}.doc\`);
  };

  const saveGeneratedTest = () => {
    if (!generatedText || !selectedLesson) return;
    
    const newFile: LibraryFile = {
      id: Date.now().toString(),
      title: \`តេស្ត SEA-PLM: \${selectedLesson}\`,
      type: 'document',
      fileData: 'markdown:' + generatedText,
      date: new Date().toLocaleDateString('km-KH'),
    };
    
    onSaveFile(newFile);
    setShowGenerateModal(false);
  };
`;

content = content.replace(componentStart, componentStart + '\\n' + newStates);

// Replace empty state UI
const oldEmptyState = `<p className="text-slate-500 font-khmer">មិនទាន់មានវិញ្ញាសារតេស្ត SEA-PLM សម្រាប់មេរៀននេះទេ</p>
                      <p className="text-sm text-slate-400 mt-2 font-khmer">សូមចុចប៊ូតុង "បន្ថែមតេស្ត SEA-PLM" ដើម្បីបញ្ចូលឯកសារថ្មី</p>
                    </div>`;
                    
const newEmptyState = `<p className="text-slate-500 font-khmer">មិនទាន់មានវិញ្ញាសារតេស្ត SEA-PLM សម្រាប់មេរៀននេះទេ</p>
                      <p className="text-sm text-slate-400 mt-2 font-khmer">សូមប្រើប្រាស់ AI ដើម្បីបង្កើតវិញ្ញាសារថ្មីដោយស្វ័យប្រវត្តិ</p>
                      <button onClick={handleGenerateSeaPlm} className="mt-4 px-6 py-2 bg-indigo-100 text-indigo-700 rounded-xl hover:bg-indigo-200 transition-colors font-khmer font-bold flex items-center gap-2">
                        <Sparkles className="w-5 h-5" /> AI បង្កើតតេស្តថ្មី
                      </button>
                    </div>`;

content = content.replace(oldEmptyState, newEmptyState);

// Add Modals
const modals = `      {/* Generate Modal */}
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
                    <h3 className="font-moul text-lg text-slate-800">AI បង្កើតតេស្ត SEA-PLM</h3>
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
                    <p className="text-slate-500 font-khmer max-w-md">AI កំពុងវិភាគមេរៀន និងបង្កើតសំណួរតាមស្តង់ដារ SEA-PLM។</p>
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
}`;

content = content.replace(/    <\/div>\s*<\/div>\s*\);\s*}/, modals);

// Replace mapping to show a view button if needed, but wait! The current files map is just showing titles and delete button.
// Let's replace the files mapping to add onClick={() => setViewingFile(f)}
const oldFilesMap = `                         <div key={f.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200">
                           <div className="flex items-center gap-3">
                             <FileText className="w-5 h-5 text-indigo-500" />
                             <div>
                               <p className="font-bold text-slate-800 font-khmer">{f.title}</p>
                               <p className="text-xs text-slate-500">{f.date}</p>
                             </div>
                           </div>
                           <button onClick={() => onDeleteFile(f.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                             <Trash2 className="w-4 h-4" />
                           </button>
                         </div>`;

const newFilesMap = `                         <div key={f.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors">
                           <div 
                             className="flex items-center gap-3 cursor-pointer flex-1"
                             onClick={() => setViewingFile(f)}
                           >
                             <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                               <FileText className="w-5 h-5 text-indigo-500" />
                             </div>
                             <div>
                               <p className="font-bold text-slate-800 font-khmer hover:text-indigo-600 transition-colors">{f.title}</p>
                               <p className="text-xs text-slate-500">{f.date}</p>
                             </div>
                           </div>
                           <button onClick={() => onDeleteFile(f.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors ml-4">
                             <Trash2 className="w-4 h-4" />
                           </button>
                         </div>`;

content = content.replace(oldFilesMap, newFilesMap);

// Replace add button behavior
const oldAddButton = `<button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-khmer text-sm">
                      <Plus className="w-4 h-4" />
                      បន្ថែមតេស្ត SEA-PLM
                    </button>`;
const newAddButton = `<button onClick={handleGenerateSeaPlm} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-khmer text-sm">
                      <Plus className="w-4 h-4" />
                      បង្កើតតេស្ត SEA-PLM ថ្មី
                    </button>`;
content = content.replace(oldAddButton, newAddButton);

fs.writeFileSync('src/components/SeaPlmTestView.tsx', content);
console.log('Patched SeaPlmTestView.tsx');
