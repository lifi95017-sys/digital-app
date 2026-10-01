import React, { useState, useEffect } from 'react';
import { X, FileText, Download, Printer, Loader2 } from 'lucide-react';
import { LessonPlan } from '../types';
import Markdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
// @ts-ignore
import html2pdf from 'html2pdf.js';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  plan: LessonPlan;
  type: 'student' | 'teacher';
}

export default function WorksheetModal({ isOpen, onClose, plan, type }: Props) {
  const [content, setContent] = useState('');
  const [isDone, setIsDone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (isOpen && !hasGenerated) {
      setIsDone(false);
      const storageKey = `worksheet_${type}_${plan.lessonTitle || 'draft'}`;
      const savedContent = localStorage.getItem(storageKey);
      if (savedContent) {
        setContent(savedContent);
        setIsDone(true);
        setHasGenerated(true);
      } else {
        generateWorksheet();
        setHasGenerated(true);
      }
    }
  }, [isOpen]);

  const generateWorksheet = async () => {
    setIsLoading(true);
    setContent('');
    try {
      const isStudent = type === 'student';
      
      const step3 = plan.steps.step3 || plan.steps['step3']; // New Lesson step
      const contentStr = step3 ? step3.content : Object.values(plan.steps).map((s:any) => s.content).filter(Boolean).join('\n');
      
      const isSecondary = typeof plan.grade === 'number' ? plan.grade >= 7 : false;
      const teacherRole = isSecondary ? 'គ្រូបង្រៀនកម្រិតមធ្យមសិក្សាដ៏ចំណានម្នាក់នៅកម្ពុជា' : 'គ្រូបង្រៀនកម្រិតបឋមដ៏ចំណានម្នាក់នៅកម្ពុជា';

      const existingStudentKey = `worksheet_student_${plan.lessonTitle || 'draft'}`;
      const existingTeacherKey = `worksheet_teacher_${plan.lessonTitle || 'draft'}`;
      
      const existingStudentContent = localStorage.getItem(existingStudentKey);
      const existingTeacherContent = localStorage.getItem(existingTeacherKey);

      let promptText = '';

      if (isStudent) {
          if (existingTeacherContent) {
              promptText = `អ្នកគឺជា${teacherRole}។ 
នេះគឺជា «សន្លឹកកិច្ចការគ្រូ និងអត្រាកំណែ (Teacher Worksheet)» នៃមេរៀន ${plan.lessonTitle} ថ្នាក់ទី ${plan.grade}៖

${existingTeacherContent}

សូមបង្កើត «សន្លឹកកិច្ចការសិស្ស (Student Worksheet)» ដោយផ្អែកលើសន្លឹកកិច្ចការគ្រូខាងលើ។
ទម្រង់ទាមទារ៖
១. សូមចម្លងសំណួរ និងទម្រង់ទាំងស្រុងពី "សន្លឹកកិច្ចការគ្រូ" ខាងលើ (ដូចគ្នាបេះបិទ) ប៉ុន្តែត្រូវលុបចម្លើយចេញ និងទុកចន្លោះប្រហោងសម្រាប់ឲ្យសិស្សសរសេរចម្លើយ។
២. ផ្នែកក្បាលត្រូវមាន៖ ឈ្មោះសិស្ស, ថ្នាក់ទី, ថ្ងៃខែ, ពិន្ទុ។

សូមសរសេរចេញជាទម្រង់ Markdown ដែលមានរបៀបរៀបរយល្អ។ មិនបាច់សរសេរពាក្យណែនាំទេ ចាប់ផ្តើមសរសេរយកតែម្តង។`;
          } else {
              promptText = `អ្នកគឺជា${teacherRole}។ សូមបង្កើត «សន្លឹកកិច្ចការសិស្ស (Student Worksheet)» ដោយផ្អែកលើកិច្ចតែងការបង្រៀន (ផ្តោតសំខាន់លើមេរៀនថ្មី) ខាងក្រោមនេះ។
{មុខវិជ្ជា៖ ${plan.subject}, មេរៀនទី ${plan.lesson}៖ ${plan.lessonTitle}, ថ្នាក់ទី៖ ${plan.grade}, រយៈពេល៖ ${plan.duration}នាទី}

វត្ថុបំណងមេរៀន៖
- វិជ្ជាសម្បទា៖ ${plan.objectives.knowledge}
- បំណិនសម្បទា៖ ${plan.objectives.skills}

ខ្លឹមសារមេរៀនថ្មី (ពីកិច្ចតែងការ)៖
${contentStr}

គោលបំណងសន្លឹកកិច្ចការ៖ សម្រាប់សិស្សអនុវត្តក្នុងថ្នាក់លើមេរៀនថ្មីនេះ។
ទម្រង់ទាមទារ៖
១. ផ្នែកក្បាល៖ ឈ្មោះសិស្ស, ថ្នាក់ទី, ថ្ងៃខែ, ពិន្ទុ
២. ផ្នែកលំហាត់/សំនួរ៖ បង្កើតសំនួរ លំហាត់ ផ្គូផ្គង ឬលំហាត់អនុវត្ត ដែលទាញចេញពី "ខ្លឹមសារមេរៀនថ្មី" ខាងលើ។ រៀបចំឲ្យមានចន្លោះសម្រាប់ឆ្លើយ។

សូមសរសេរចេញជាទម្រង់ Markdown ដែលមានរបៀបរៀបរយល្អ។ មិនបាច់សរសេរពាក្យណែនាំទេ ចាប់ផ្តើមសរសេរយកតែម្តង។`;
          }
      } else {
          if (existingStudentContent) {
              promptText = `អ្នកគឺជា${teacherRole}។ 
នេះគឺជា «សន្លឹកកិច្ចការសិស្ស (Student Worksheet)» នៃមេរៀន ${plan.lessonTitle} ថ្នាក់ទី ${plan.grade}៖

${existingStudentContent}

សូមបង្កើត «សន្លឹកកិច្ចការគ្រូ និងអត្រាកំណែ (Teacher Worksheet)» ដោយផ្អែកលើសន្លឹកកិច្ចការសិស្សខាងលើ។ 
ខ្លឹមសារមេរៀនពីកិច្ចតែងការ៖
${contentStr}

ទម្រង់ទាមទារ៖
១. សូមចម្លងសំណួរ និងទម្រង់ទាំងស្រុងពី "សន្លឹកកិច្ចការសិស្ស" ខាងលើ (ដូចគ្នាបេះបិទ) ប៉ុន្តែត្រូវបំពេញចម្លើយត្រឹមត្រូវសម្រាប់សំណួរនីមួយៗ (ផ្អែកលើខ្លឹមសារមេរៀនខាងលើ)។
២. អាចបំពេញចម្លើយជាអក្សរដិត (bold) ឬសរសេរក្នុងវង់ក្រចកដើម្បីងាយស្រួលចំណាំ។

សូមសរសេរចេញជាទម្រង់ Markdown ដែលមានរបៀបរៀបរយល្អ។ មិនបាច់សរសេរពាក្យណែនាំទេ ចាប់ផ្តើមសរសេរយកតែម្តង។`;
          } else {
              promptText = `អ្នកគឺជា${teacherRole}។ សូមបង្កើត «សន្លឹកកិច្ចការគ្រូ និងអត្រាកំណែ (Teacher Worksheet)» ដោយផ្អែកលើកិច្ចតែងការបង្រៀន (ផ្តោតសំខាន់លើមេរៀនថ្មី) ខាងក្រោមនេះ។
{មុខវិជ្ជា៖ ${plan.subject}, មេរៀនទី ${plan.lesson}៖ ${plan.lessonTitle}, ថ្នាក់ទី៖ ${plan.grade}, រយៈពេល៖ ${plan.duration}នាទី}

វត្ថុបំណងមេរៀន៖
- វិជ្ជាសម្បទា៖ ${plan.objectives.knowledge}
- បំណិនសម្បទា៖ ${plan.objectives.skills}

ខ្លឹមសារមេរៀនថ្មី (ពីកិច្ចតែងការ)៖
${contentStr}

គោលបំណងសន្លឹកកិច្ចការគ្រូ៖ ជាសន្លឹកកិច្ចការសិស្ស ដែលមានរួមបញ្ចូលនូវចម្លើយ (អត្រាកំណែ) សម្រាប់គ្រូ។
ទម្រង់ទាមទារ៖
១. ផ្នែកក្បាល៖ ឈ្មោះសិស្ស, ថ្នាក់ទី, ថ្ងៃខែ, ពិន្ទុ
២. ផ្នែកលំហាត់/សំនួរ៖ បង្កើតសំនួរ លំហាត់ ផ្គូផ្គង ឬលំហាត់អនុវត្ត ដែលទាញចេញពី "ខ្លឹមសារមេរៀនថ្មី" ខាងលើ ដោយមានបំពេញចម្លើយត្រឹមត្រូវជាអក្សរដិត (bold) ឬសរសេរក្នុងវង់ក្រចក។

សូមសរសេរចេញជាទម្រង់ Markdown ដែលមានរបៀបរៀបរយល្អ។ មិនបាច់សរសេរពាក្យណែនាំទេ ចាប់ផ្តើមសរសេរយកតែម្តង។`;
          }
      }

      const response = await fetch('/api/generateLessonPlan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptText, userApiKey: localStorage.getItem("userGeminiApiKey") || undefined })
      });
      
      
      if (!response.ok) {
        let errStr = 'API request failed';
        try {
          const errData = await response.json();
          errStr = errData.error || errStr;
        } catch(e) {}
        throw new Error(errStr);
      }
      
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error('No reader available');
      
      let text = '';
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
              if (parsed.text) text += parsed.text;
            } catch (e: any) {
              console.error("Error parsing JSON chunk:", e, "Chunk:", dataStr);
            }
          }
        }
      }
      setContent(text);
      setIsDone(true);
      
      if (isStudent) {
          localStorage.setItem(existingStudentKey, text);
      } else {
          localStorage.setItem(existingTeacherKey, text);
      }
    } catch (error) {
      console.error(error);
      setContent('*មានបញ្ហាក្នុងការបង្កើតមាតិកា។ សូមព្យាយាមម្ដងទៀត។*');
    }
    setIsLoading(false);
  };

  
  const handleDownloadPDF = () => {
    setIsDownloading(true);
    const element = document.getElementById('worksheet-content');
    if (!element) return;
    
    // Add print styling temporarily
    const originalClass = element.className;
    element.className = "bg-white w-full max-w-[210mm] min-h-[297mm] mx-auto p-[1cm] sm:p-[1.5cm] text-[11pt] leading-relaxed text-slate-800 font-khmer";
    
    const opt = {
      margin:       10,
      filename:     `${type === 'student' ? 'សន្លឹកកិច្ចការសិស្ស' : 'សន្លឹកកិច្ចការគ្រូ'}_${plan.lessonTitle}.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
    };

    html2pdf().set(opt).from(element).save().then(() => {
        setIsDownloading(false);
        element.className = originalClass;
    }).catch(err => {
        console.error("PDF generation failed:", err);
        setIsDownloading(false);
        element.className = originalClass;
        alert('មានបញ្ហាក្នុងការទាញយក PDF។');
    });
  };

  const handleExportWord = () => {
    const contentElement = document.getElementById("worksheet-content");
    if (!contentElement) return;

    const clone = contentElement.cloneNode(true) as HTMLElement;
    const hideElements = clone.querySelectorAll('.print\\:hidden');
    hideElements.forEach(el => el.remove());

    const htmlContent = clone.innerHTML;

    const preHtml = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>សន្លឹកកិច្ចការ</title>
      <style>
        body { font-family: 'Khmer OS Siemreap', 'Moul', sans-serif; font-size: 11pt; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        th, td { border: 1px solid black; padding: 8px; text-align: left; vertical-align: top; }
        th { font-family: 'Moul', sans-serif; background-color: #f8fafc; }
        h1 { font-size: 16pt; font-family: 'Moul', sans-serif; text-align: center; }
        h2 { font-size: 14pt; font-weight: bold; }
        h3 { font-size: 12pt; font-weight: bold; }
        ul, ol { margin-left: 20px; }
      </style>
    </head>
    <body>`;
    const postHtml = "</body></html>";
    const html = preHtml + htmlContent + postHtml;

    const blob = new Blob(['\ufeff', html], {
      type: 'application/msword'
    });
    const blobUrl = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `សន្លឹកកិច្ចការ_${type === 'student' ? 'សិស្ស' : 'គ្រូ'}_${plan.lessonTitle || 'ថ្មី'}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  };

  const handleDelete = () => {
    setContent('');
    onClose();
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    const storageKey = `worksheet_${type}_${plan.lessonTitle || 'draft'}`;
    localStorage.setItem(storageKey, content);
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 pb-20 sm:pb-6 print:p-0 print:block print:relative print:z-0">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity print:hidden" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl flex flex-col h-[90vh] print:h-auto print:shadow-none print:rounded-none animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0 print:hidden rounded-t-3xl rounded-b-none flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${type === 'student' ? 'bg-sky-100 text-sky-600' : 'bg-rose-100 text-rose-600'}`}>
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800 font-khmer">
                {type === 'student' ? 'សន្លឹកកិច្ចការសិស្ស' : 'សន្លឹកកិច្ចការគ្រូ'}
              </h2>
              <p className="text-sm text-slate-500 font-khmer mt-0.5">{plan.subject} - {plan.lessonTitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
             <button 
                onClick={generateWorksheet}
                disabled={isLoading}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-sm font-bold text-slate-700 transition"
              >
                បង្កើតម្ដងទៀត
             </button>
             <button 
                onClick={handleSave}
                disabled={isLoading || !content || isSaving}
                className={`px-4 py-2 text-white rounded-lg text-sm font-bold transition-colors disabled:opacity-50 ${isSaving ? 'bg-emerald-500' : 'bg-emerald-600 hover:bg-emerald-700'}`}
              >
                {isSaving ? 'បានរក្សាទុក' : 'រក្សាទុក'}
             </button>
             <button 
                onClick={handleExportWord}
                disabled={isLoading || !content}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                ទាញយក Word
             </button>
             <button 
                onClick={handleDownloadPDF}
                disabled={isLoading || !content || isDownloading}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
                title="ទាញយក PDF (Print)"
              >
                {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />} {isDownloading ? 'កំពុងទាញយក...' : 'ទាញយក PDF'}
             </button>
             <button 
                onClick={handleDelete}
                className="px-4 py-2 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg text-sm font-bold transition-colors"
              >
                លុប
             </button>
             <button 
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors ml-2"
              >
                <X className="w-5 h-5" />
              </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 print:p-0 bg-slate-100 print:bg-white flex justify-center">
          <div id="worksheet-content" className="bg-white w-full max-w-[210mm] min-h-[297mm] mx-auto p-[1cm] sm:p-[1.5cm] rounded shadow-sm print:shadow-none print:p-0 print:block">
            {isLoading ? (
               <div className="flex flex-col items-center justify-center h-full space-y-4 print:hidden">
                  <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
                  <p className="text-slate-500 font-khmer">កំពុងបង្កើត{type === 'student' ? 'សន្លឹកកិច្ចការសិស្ស' : 'សន្លឹកកិច្ចការគ្រូ'}...</p>
               </div>
            ) : (
               <div className="font-khmer text-[11pt] leading-relaxed text-slate-800">
                  <div className="markdown-body space-y-3">
                    <Markdown
                      remarkPlugins={[remarkMath, remarkGfm]}
                      rehypePlugins={[rehypeKatex]}
                      components={{
                        h1: ({node, ...props}) => <h1 className="text-xl font-moul text-center mb-6" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-lg font-bold mt-6 mb-3" {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-base font-bold mt-4 mb-2" {...props} />,
                        p: ({node, ...props}) => <p className="mb-3" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-3 space-y-1" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-3 space-y-1" {...props} />,
                        li: ({node, ...props}) => <li className="" {...props} />,
                        table: ({node, ...props}) => <table className="w-full border-collapse border border-slate-300 mb-4" {...props} />,
                        th: ({node, ...props}) => <th className="border border-slate-300 p-2 bg-slate-50 font-bold" {...props} />,
                        td: ({node, ...props}) => <td className="border border-slate-300 p-2" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                        blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-slate-300 pl-4 italic text-slate-600 mb-3" {...props} />,
                      }}
                    >
                      {content}
                    </Markdown>
                  </div>
                  
                  {type === 'student' && content && (
                     <div className="mt-16 pt-8 border-t border-dashed border-slate-300 flex justify-between text-slate-400 text-xs italic print:flex text-center">
                        <p>បង្កើតដោយ៖ ប្រព័ន្ធ AI កិច្ចតែងការបង្រៀន</p>
                        <p>សម្រាប់ប្រើប្រាស់នៅក្នុងថ្នាក់រៀន</p>
                     </div>
                  )}
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
