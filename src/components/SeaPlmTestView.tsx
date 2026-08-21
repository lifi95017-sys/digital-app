import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, Search, Plus, FileText, Trash2, Download, BookOpen, ChevronDown, ChevronRight, X, Loader2, Sparkles
} from 'lucide-react';
import { LibraryFile, Grade } from '../types';
import Markdown from 'react-markdown';
import { saveAs } from 'file-saver';


interface SeaPlmTestViewProps {
  onBack: () => void;
  files: LibraryFile[];
  onSaveFile: (file: LibraryFile) => void;
  onDeleteFile: (id: string) => void;
}

const SEA_PLM_GRADE_4 = [
  {
    chapter: 'មេរៀនទាំងអស់',
    lessons: [
      'មេរៀនទី ១៖ កីឡានិងល្បែងកម្សាន្ត',
      'មេរៀនទី ២៖ សហគមន៍ជឿនលឿន',
      'មេរៀនទី ៣៖ ការគូរសម',
      'មេរៀនទី ៤៖ រុក្ខជាតិប្រទេសយើង',
      'មេរៀនទី ៥៖ មិត្តជិតស្និទ្ធ',
      'មេរៀនទី ៦៖ មធ្យោបាយធ្វើទំនាក់ទំនង',
      'មេរៀនទី ៧៖ ម្ហូបអាហារខ្មែរ',
      'មេរៀនទី ៨៖ សណ្ឋានដីប្រទេសយើង',
      'មេរៀនទី ៩៖ ប្រភពទឹកនៅកម្ពុជា',
      'មេរៀនទី ១០៖ សត្វនៅប្រទេសយើង',
    ]
  }
];

const SEA_PLM_GRADE_5 = [
  {
    chapter: 'មេរៀនទាំងអស់',
    lessons: [
      'មេរៀនទី ១ : វីរជនឆ្នើម',
      'មេរៀនទី ២ : សម្បត្តិអក្សរសិល្ប៍',
      'មេរៀនទី ៣ : កំណាព្យខ្មែរ',
      'មេរៀនទី ៤ : ប្រយោជន៍នៃសារព័ត៌មាន',
      'មេរៀនទី ៥ : ស្មារតីទទួលខុសត្រូវ',
      'មេរៀនទី ៦ : អតីតកាលរបស់យើង',
      'មេរៀនទី ៧ : ទូរគមនាគមន៍នៅកម្ពុជា',
      'មេរៀនទី ៨ : ផលិតផលខ្មែរ',
      'មេរៀនទី ៩ : ពេលវេលាជាមាសប្រាក់',
      'មេរៀនទី ១០ : ប្រយោជន៍នៃវិទ្យាសាស្ត្រ',
    ]
  }
];



const SEA_PLM_GRADE_4_MATH = [
  {
    chapter: 'មេរៀនទាំងអស់',
    lessons: [
      'មេរៀនទី 1 : ចំនួន',
      'មេរៀនទី 2 : ប្រភាគ',
      'មេរៀនទី 3 : វិធីបូក',
      'មេរៀនទី 4 : រូបធរណីមាត្រ',
      'មេរៀនទី 5 : ទម្ងន់',
      'មេរៀនទី 6 : វិធីដក',
      'មេរៀនទី 7 : រូបិយវត្ថុ',
      'មេរៀនទី 8 : វិធីគុណ',
      'មេរៀនទី 9 : វិធីចែក',
      'មេរៀនទី 10 : ពេលវេលា',
      'មេរៀនទី 11 : ប្រវែង',
      'មេរៀនទី 12 : ចំនួនទសភាគ',
      'មេរៀនទី 13 : វិធីបូកចំនួនទសភាគ',
      'មេរៀនទី 14 : វិធីដកចំនួនទសភាគ',
      'មេរៀនទី 15 : មុំ',
      'មេរៀនទី 16 : បន្ទាត់កែងនិងបន្ទាត់ស្រប',
      'មេរៀនទី 17 : ស្ថិតិ',
    ]
  }
];
const SEA_PLM_GRADE_5_MATH = [
  {
    chapter: 'មេរៀនទាំងអស់',
    lessons: [
      'មេរៀនទី 1 : ចំនួន',
      'មេរៀនទី 2 : ប្រភាគ',
      'មេរៀនទី 3 : វិធីបូក',
      'មេរៀនទី 4 : រូបធរណីមាត្រ',
      'មេរៀនទី 5 : ទម្ងន់',
      'មេរៀនទី 6 : វិធីដក',
      'មេរៀនទី 7 : រូបិយវត្ថុ',
      'មេរៀនទី 8 : វិធីគុណ',
      'មេរៀនទី 9 : វិធីចែក',
      'មេរៀនទី 10 : ពេលវេលា',
      'មេរៀនទី 11 : ប្រវែង',
      'មេរៀនទី 12 : ចំនួនទសភាគ',
      'មេរៀនទី 13 : វិធីបូកចំនួនទសភាគ',
      'មេរៀនទី 14 : វិធីដកចំនួនទសភាគ',
      'មេរៀនទី 15 : មុំ',
      'មេរៀនទី 16 : បន្ទាត់កែងនិងបន្ទាត់ស្រប',
      'មេរៀនទី 17 : ស្ថិតិ',
    ]
  }
];

const SEA_PLM_GRADE_6_MATH = [
  {
    chapter: 'មេរៀនទាំងអស់',
    lessons: [
      'មេរៀនទី 1 : ចំនួន',
      'មេរៀនទី 2 : ប្រភាគ',
      'មេរៀនទី 3 : វិធីបូក',
      'មេរៀនទី 4 : រូបធរណីមាត្រ',
      'មេរៀនទី 5 : ទម្ងន់',
      'មេរៀនទី 6 : វិធីដក',
      'មេរៀនទី 7 : រូបិយវត្ថុ',
      'មេរៀនទី 8 : វិធីគុណ',
      'មេរៀនទី 9 : វិធីចែក',
      'មេរៀនទី 10 : ពេលវេលា',
      'មេរៀនទី 11 : ប្រវែង',
      'មេរៀនទី 12 : ចំនួនទសភាគ',
      'មេរៀនទី 13 : វិធីបូកចំនួនទសភាគ',
      'មេរៀនទី 14 : វិធីដកចំនួនទសភាគ',
      'មេរៀនទី 15 : មុំ',
      'មេរៀនទី 16 : បន្ទាត់កែងនិងបន្ទាត់ស្រប',
      'មេរៀនទី 17 : ស្ថិតិ',
    ]
  }
];
const SEA_PLM_GRADE_6 = [
  {
    chapter: 'មេរៀនទាំងអស់',
    lessons: [
      'មេរៀនទី១ : អ្នកមានគុណ',
      'មេរៀនទី២ : កិត្តិយសរបស់កុមារ',
      'មេរៀនទី៣ : ធនធានរ៉ែនៅប្រទេសកម្ពុជា',
      'មេរៀនទី៤ : ប្រយោជន៍នៃធម្មជាតិ',
      'មេរៀនទី៥ : ធនធានជលផលនៅកម្ពុជា',
      'មេរៀនទី៦ : ទំនៀមទម្លាប់ ប្រពៃណីខ្មែរ',
      'មេរៀនទី៧ : តន្ត្រីនិងសិល្បៈបុរាណ',
      'មេរៀនទី៨ : ជំនឿនិងសាសនា',
      'មេរៀនទី៩ : រមណីយដ្ឋានទេសចរណ៍នៅកម្ពុជា',
      'មេរៀនទី១០ : សេចក្តីថ្លៃថ្នូរ',
    ]
  }
];

export default function SeaPlmTestView({ onBack, files, onSaveFile, onDeleteFile }: SeaPlmTestViewProps) {
  const [isGenerating, setIsGenerating] = useState(false);
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
        body: JSON.stringify({ lesson: selectedLesson,
          grade: activeGrade,
          subject: activeSubject === 'math' ? 'គណិតវិទ្យា' : 'ភាសាខ្មែរ', userApiKey: localStorage.getItem("userGeminiApiKey") || undefined }),
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
      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          if (line.trim().startsWith('data: ')) {
            const dataStr = line.trim().slice(6).trim();
            if (dataStr === '[DONE]') continue;
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.error) throw new Error(parsed.error);
              if (parsed.text) { fullText += parsed.text; setGeneratedText(fullText); }
            } catch (e: any) {
              console.error("Error parsing JSON chunk:", e, "Chunk:", dataStr);
            }
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
    
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>${viewingFile ? viewingFile.title : 'តេស្ត_SEA_PLM'}</title>
        <style>
          body { font-family: 'Khmer OS Battambang', sans-serif; font-size: 12pt; line-height: 1.5; }
          h1, h2, h3 { font-family: 'Khmer OS Muol Light', sans-serif; text-align: center; }
          p { margin-bottom: 10pt; }
        </style>
      </head>
      <body>${textToDownload.replace(/\n/g, '<br>')}</body>
      </html>
    `;
    
    const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
    saveAs(blob, `${viewingFile ? viewingFile.title : 'តេស្ត_SEA_PLM'}.doc`);
  };

  const saveGeneratedTest = () => {
    if (!generatedText || !selectedLesson) return;
    
    const newFile: LibraryFile = {
      id: Date.now().toString(),
      title: `តេស្ត SEA-PLM: ${selectedLesson}`,
      grade: activeGrade as Grade,
      subject: activeSubject === 'khmer' ? 'ភាសាខ្មែរ' : activeSubject === 'math' ? 'គណិតវិទ្យា' : 'វិទ្យាសាស្ត្រ',
      fileName: `SEA-PLM_test_${Date.now()}.md`,
      fileData: 'markdown:' + generatedText,
      date: new Date().toLocaleDateString('km-KH'),
    };
    
    onSaveFile(newFile);
    setShowGenerateModal(false);
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [expandedChapters, setExpandedChapters] = useState<string[]>(['មេរៀនទាំងអស់']);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

  const [activeGrade, setActiveGrade] = useState<4 | 5 | 6>(6);
  const [activeSubject, setActiveSubject] = useState<'khmer' | 'math'>('math');

  let currentCurriculum = activeGrade === 4 ? SEA_PLM_GRADE_4 : activeGrade === 5 ? SEA_PLM_GRADE_5 : SEA_PLM_GRADE_6;
  if (activeSubject === 'math') {
    if (activeGrade === 6) {
      currentCurriculum = SEA_PLM_GRADE_6_MATH;
    } else if (activeGrade === 5) {
      currentCurriculum = SEA_PLM_GRADE_5_MATH;
    } else if (activeGrade === 4) {
      currentCurriculum = SEA_PLM_GRADE_4_MATH;
    } else {
      currentCurriculum = [];
    }
  }

  const toggleChapter = (chapter: string) => {

    setExpandedChapters(prev => 
      prev.includes(chapter) ? prev.filter(c => c !== chapter) : [...prev, chapter]
    );
  };

  return (
    <div className="space-y-8 min-h-screen pb-20">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all font-medium border border-slate-200 shadow-sm"
        >
          <ChevronLeft className="w-5 h-5 text-indigo-600" />
          ត្រឡប់ក្រោយ
        </button>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-moul text-slate-800">តេស្ត SEA-PLM</h2>
            <div className="flex flex-col gap-3 mt-3">
              <div className="flex gap-2">
                <button 
                  onClick={() => { setActiveSubject('khmer'); setSelectedLesson(null); setExpandedChapters(['មេរៀនទាំងអស់']); }}
                  className={`px-3 py-1 rounded-full text-sm font-bold font-khmer ${activeSubject === 'khmer' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  ភាសាខ្មែរ
                </button>
                <button 
                  onClick={() => { setActiveSubject('math'); setSelectedLesson(null); setExpandedChapters(['មេរៀនទាំងអស់']); }}
                  className={`px-3 py-1 rounded-full text-sm font-bold font-khmer ${activeSubject === 'math' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  គណិតវិទ្យា
                </button>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => { setActiveGrade(4); setSelectedLesson(null); setExpandedChapters(['មេរៀនទាំងអស់']); }}
                  className={`px-3 py-1 rounded-full text-sm font-bold font-khmer ${activeGrade === 4 ? (activeSubject === 'math' ? 'bg-emerald-600' : 'bg-indigo-600') + ' text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  ថ្នាក់ទី៤
                </button>
                <button 
                  onClick={() => { setActiveGrade(5); setSelectedLesson(null); setExpandedChapters(['មេរៀនទាំងអស់']); }}
                  className={`px-3 py-1 rounded-full text-sm font-bold font-khmer ${activeGrade === 5 ? (activeSubject === 'math' ? 'bg-emerald-600' : 'bg-indigo-600') + ' text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  ថ្នាក់ទី៥
                </button>
                <button 
                  onClick={() => { setActiveGrade(6); setSelectedLesson(null); setExpandedChapters(['មេរៀនទាំងអស់']); }}
                  className={`px-3 py-1 rounded-full text-sm font-bold font-khmer ${activeGrade === 6 ? (activeSubject === 'math' ? 'bg-emerald-600' : 'bg-indigo-600') + ' text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  ថ្នាក់ទី៦
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-4">
            <h3 className="font-moul text-lg text-slate-800 mb-4">ជំពូក និងមេរៀន</h3>
            {currentCurriculum.map((chap, idx) => (
              <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden">
                <button 
                  onClick={() => toggleChapter(chap.chapter)}
                  className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-indigo-50 transition-colors text-left"
                >
                  <span className="font-bold font-khmer text-slate-800">{chap.chapter}</span>
                  {expandedChapters.includes(chap.chapter) ? (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  )}
                </button>
                <AnimatePresence>
                  {expandedChapters.includes(chap.chapter) && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-2 space-y-1 bg-white">
                        {chap.lessons.map((lesson, lIdx) => (
                          <button
                            key={lIdx}
                            onClick={() => setSelectedLesson(lesson)}
                            className={`w-full text-left px-4 py-3 rounded-xl font-khmer text-sm transition-all flex items-center gap-2 ${
                              selectedLesson === lesson 
                                ? 'bg-indigo-100 text-indigo-700 font-bold' 
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <FileText className="w-4 h-4" />
                            {lesson}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2">
            <div className="bg-slate-50 rounded-2xl p-6 h-full min-h-[400px] border border-slate-200">
              
              {selectedLesson ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold font-khmer text-xl text-indigo-900">{selectedLesson}</h3>
                    <button onClick={handleGenerateSeaPlm} className={`flex items-center gap-2 px-4 py-2 ${activeSubject === 'math' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white rounded-xl transition-colors font-khmer text-sm`}>
                      <Plus className="w-4 h-4" />
                      បង្កើតតេស្ត SEA-PLM ថ្មី
                    </button>
                  </div>
                  
                  {files.filter(f => f.title.includes(selectedLesson)).length > 0 ? (
                    <div className="space-y-3">
                      {files.filter(f => f.title.includes(selectedLesson)).map(f => (
                         <div key={f.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors">
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
                         </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                        <BookOpen className="w-8 h-8 text-indigo-400" />
                      </div>
                      <p className="text-slate-500 font-khmer">មិនទាន់មានវិញ្ញាសារតេស្ត SEA-PLM សម្រាប់មេរៀននេះទេ</p>
                      <p className="text-sm text-slate-400 mt-2 font-khmer">សូមប្រើប្រាស់ AI ដើម្បីបង្កើតវិញ្ញាសារថ្មីដោយស្វ័យប្រវត្តិ</p>
                      <button onClick={handleGenerateSeaPlm} className="mt-4 px-6 py-2 bg-indigo-100 text-indigo-700 rounded-xl hover:bg-indigo-200 transition-colors font-khmer font-bold flex items-center gap-2">
                        <Sparkles className="w-5 h-5" /> AI បង្កើតតេស្តថ្មី
                      </button>
                    </div>
                  )}
                </div>
              ) : (

                <div className="flex flex-col items-center justify-center h-full text-center py-20">
                  <BookOpen className="w-16 h-16 text-slate-300 mb-4" />
                  <p className="text-slate-500 font-khmer text-lg">សូមជ្រើសរើសមេរៀនណាមួយ</p>
                  <p className="text-slate-400 font-khmer text-sm mt-2">ដើម្បីមើល ឬបញ្ចូលវិញ្ញាសារតេស្ត SEA-PLM</p>
                </div>
              )}
            </div>
          </div>
        </div>
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
    </div>
  );
}
