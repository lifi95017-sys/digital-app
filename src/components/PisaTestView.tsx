import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, Search, Plus, FileText, Trash2, Download, BookOpen, ChevronDown, ChevronRight, X, Loader2, Sparkles, CheckCircle2
} from 'lucide-react';
import { LibraryFile } from '../types';
import Markdown from 'react-markdown';
import { saveAs } from 'file-saver';

interface PisaTestViewProps {
  onBack: () => void;
  files: LibraryFile[];
  onSaveFile: (file: LibraryFile) => void;
  onDeleteFile: (id: string) => void;
}

const SCIENCE_GRADE_4 = [
  {
    chapter: 'ជំពូកទី១៖ រុក្ខជាតិ',
    lessons: [
      'មេរៀនទី១៖ បរិស្ថានធម្មជាតិ',
      'មេរៀនទី២៖ ផលប្រយោជន៍រុក្ខជាតិ',
      'មេរៀនទី៣៖ វដ្ដជីវិតរបស់រុក្ខជាតិ',
      'មេរៀនទី៤៖ ចំណែកថ្នាក់សត្វ',
    ]
  },
  {
    chapter: 'ជំពូកទី២៖ មនុស្សនិងសុខភាព',
    lessons: [
      'មេរៀនទី១៖ គ្រោងឆ្អឹងនិងសាច់ដុំ',
      'មេរៀនទី២៖ ភ្នែក',
      'មេរៀនទី៣៖ ជំងឺគ្រុនឈាមនិងគ្រុនចាញ់',
    ]
  },
  {
    chapter: 'ជំពូកទី៣៖ រូបធាតុនិងថាមពល',
    lessons: [
      'មេរៀនទី១៖ លក្ខណៈនៃរូបធាតុ',
      'មេរៀនទី២៖ កម្លាំងនិងចលនា',
      'មេរៀនទី៣៖ ឃ្នាស់',
    ]
  },
  {
    chapter: 'ជំពូកទី៤៖ ផែនដីនិងបរិស្ថាន',
    lessons: [
      'មេរៀនទី១៖ កង្វក់ទឹក',
      'មេរៀនទី២៖ រង្វិលរបស់ផែនដី',
    ]
  }
];


const SCIENCE_GRADE_5 = [
  {
    chapter: 'ជំពូកទី១៖ រុក្ខជាតិនិងសត្វ',
    lessons: [
      'មេរៀនទី១៖ ការបន្តពូករបស់រុក្ខជាតិ',
      'មេរៀនទី២៖ ការលូតលាស់របស់គ្រាប់ពូជ',
      'មេរៀនទី៣៖ ការបន្តពូជរបស់សត្វ',
    ]
  },
  {
    chapter: 'ជំពូកទី២៖ បរិស្ថាន',
    lessons: [
      'មេរៀនទី១៖ បរិស្ថានធម្មជាតិ',
      'មេរៀនទី២៖ ការកាត់បន្ថយកង្វក់និងសារធាតុបំពុលបរិស្ថាន',
      'មេរៀនទី៣៖ ដី',
    ]
  },
  {
    chapter: 'ជំពូកទី៣៖ មនុស្សនិងជំងឺ',
    lessons: [
      'មេរៀនទី១៖ អាហារដើម្បីសុខភាព',
      'មេរៀនទី២៖ ការបរិភោគអាហារនិងទឹកគ្មានអនាម័យ',
      'មេរៀនទី៣៖ ការចាក់វ៉ាក់សាំង',
    ]
  },
  {
    chapter: 'ជំពូកទី៤៖ រូបធាតុនិងថាមពល',
    lessons: [
      'មេរៀនទី១៖ រង្វាស់ រូបធាតុ និងកម្ដៅ',
      'មេរៀនទី២៖ កម្លាំងកកិត',
      'មេរៀនទី៣៖ អគ្គិសនី',
    ]
  },
  {
    chapter: 'ជំពូកទី៥៖ លំហ',
    lessons: [
      'មេរៀនទី១៖ ព្រះអាទិត្យ',
      'មេរៀនទី២៖ ប្រព័ន្ធព្រះអាទិត្យនិងភពរណបផ្សេងៗ',
    ]
  }
];


const SCIENCE_GRADE_6 = [
  {
    chapter: 'ជំពូកទី ១៖ រុក្ខជាតិនិងសត្វ',
    lessons: [
      'មេរៀនទី ១៖ ការរៀបចំខ្លួនរបស់រុក្ខជាតិ',
      'មេរៀនទី ២៖ ការដកដង្ហើម',
      'មេរៀនទី ៣៖ ការបន្តពូជរបស់សត្វ',
    ]
  },
  {
    chapter: 'ជំពូកទី ២៖ បរិស្ថាន',
    lessons: [
      'មេរៀនទី ៤៖ បរិស្ថានធម្មជាតិ',
      'មេរៀនទី ៥៖ ធនធានធម្មជាតិ',
    ]
  },
  {
    chapter: 'ជំពូកទី ៣៖ មនុស្សនិងសុខភាព',
    lessons: [
      'មេរៀនទី ៦៖ ប្រព័ន្ធបន្តពូជមនុស្ស',
      'មេរៀនទី ៧៖ ការការពារខ្លួន',
      'មេរៀនទី ៨៖ ការការពារការគំរាមកំហែងផ្លូវភេទ',
      'មេរៀនទី ៩៖ សុខភាពបន្តពូជ',
      'មេរៀនទី ១០៖ ប្រព័ន្ធរំលាយអាហារ',
      'មេរៀនទី ១១៖ ប្រព័ន្ធរបត់ឈាម',
    ]
  },
  {
    chapter: 'ជំពូកទី ៤៖ រូបធាតុ',
    lessons: [
      'មេរៀនទី ១២៖ ការប្រែប្រួលរូបធាតុ',
      'មេរៀនទី ១៣៖ អង្គធាតុសុទ្ធនិងល្បាយ',
    ]
  },
  {
    chapter: 'ជំពូកទី ៥៖ ម៉ាស៊ីនងាយនិងអគ្គិសនី',
    lessons: [
      'មេរៀនទី ១៤៖ ម៉ាស៊ីនងាយ',
      'មេរៀនទី ១៥៖ អគ្គិសនី',
    ]
  },
  {
    chapter: 'ជំពូកទី ៦៖ ផែនដី',
    lessons: [
      'មេរៀនទី ១៦៖ អាកាសធាតុ',
      'មេរៀនទី ១៧៖ ក្រុមផ្កាយ',
    ]
  }
];

export default function PisaTestView

({ onBack, files, onSaveFile, onDeleteFile }: PisaTestViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedChapters, setExpandedChapters] = useState<string[]>(['ជំពូកទី១៖ រុក្ខជាតិ']);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

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
      
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setGeneratedText('សូមអភ័យទោស មានបញ្ហាក្នុងការបង្កើតតេស្ត PISA៖ ' + (data.error || 'Server error'));
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
        const lines = chunk.split('\n');
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
      title: `តេស្ត PISA: ${selectedLesson}`,
      grade: activeGrade,
      subject: 'វិទ្យាសាស្ត្រ',
      date: new Date().toLocaleDateString('en-GB'),
      fileName: `PISA_Test_${selectedLesson}.doc`,
      fileData: 'markdown:' + generatedText
    };
    onSaveFile(newFile);
    setShowGenerateModal(false);
  };
  
  const exportToWord = (htmlContent: string, fileName: string) => {
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + "<div style='font-family: Khmer OS Siemreap, Arial; font-size: 14pt; line-height: 1.5;'>" + htmlContent + "</div>" + footer;
    const blob = new Blob(['\ufeff', sourceHTML], { type: 'application/msword' });
    saveAs(blob, fileName);
  };

  const handleDownloadWord = () => {
    if (contentRef.current) {
      exportToWord(contentRef.current.innerHTML, `PISA_${selectedLesson}.doc`);
    }
  };

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
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-moul text-slate-800">តេស្ត PISA វិទ្យាសាស្ត្រ</h2>
            <div className="flex gap-2 mt-2">
              <button 
                onClick={() => { setActiveGrade(4); setSelectedLesson(null); setExpandedChapters([]); }}
                className={`px-3 py-1 rounded-full text-sm font-bold font-khmer ${activeGrade === 4 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                ថ្នាក់ទី៤
              </button>
              <button 
                onClick={() => { setActiveGrade(5); setSelectedLesson(null); setExpandedChapters([]); }}
                className={`px-3 py-1 rounded-full text-sm font-bold font-khmer ${activeGrade === 5 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                ថ្នាក់ទី៥
              </button>
              <button 
                onClick={() => { setActiveGrade(6); setSelectedLesson(null); setExpandedChapters([]); }}
                className={`px-3 py-1 rounded-full text-sm font-bold font-khmer ${activeGrade === 6 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                ថ្នាក់ទី៦
              </button>
            </div>
          </div>
        </div>

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
                                        <button onClick={handleGeneratePisa} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-khmer text-sm shadow-sm">
                      <Sparkles className="w-4 h-4" />
                      AI បង្កើតតេស្ត PISA
                    </button>
                  </div>
                  
                  {files.filter(f => f.title.includes(selectedLesson)).length > 0 ? (
                    <div className="space-y-3">
                      {files.filter(f => f.title.includes(selectedLesson)).map(f => (
                         <div key={f.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200">
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
                         </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                        <BookOpen className="w-8 h-8 text-indigo-400" />
                      </div>
                      <p className="text-slate-500 font-khmer">មិនទាន់មានវិញ្ញាសារតេស្ត PISA សម្រាប់មេរៀននេះទេ</p>
                      <p className="text-sm text-slate-400 mt-2 font-khmer">សូមប្រើប្រាស់ AI ដើម្បីបង្កើតវិញ្ញាសារថ្មីដោយស្វ័យប្រវត្តិ</p>
                      <button onClick={handleGeneratePisa} className="mt-4 px-6 py-2 bg-indigo-100 text-indigo-700 rounded-xl hover:bg-indigo-200 transition-colors font-khmer font-bold flex items-center gap-2">
                        <Sparkles className="w-5 h-5" /> AI បង្កើតតេស្តថ្មី
                      </button>
                    </div>
                  )}
                </div>
              ) : (

                <div className="flex flex-col items-center justify-center h-full text-center py-20">
                  <BookOpen className="w-16 h-16 text-slate-300 mb-4" />
                  <p className="text-slate-500 font-khmer text-lg">សូមជ្រើសរើសមេរៀនណាមួយ</p>
                  <p className="text-slate-400 font-khmer text-sm mt-2">ដើម្បីមើល ឬបញ្ចូលវិញ្ញាសារតេស្ត PISA</p>
                </div>
              )}
            </div>
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

}
