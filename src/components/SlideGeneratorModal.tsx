import React, { useState, useEffect } from 'react';
import { X, Presentation, Download, Loader2 } from 'lucide-react';
import { LessonPlan } from '../types';
import pptxgen from 'pptxgenjs';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  plan: LessonPlan;
}

interface SlideData {
  title: string;
  subtitle?: string;
  content: string[];
  type: 'intro' | 'content' | 'activity' | 'summary';
  imageKeyword?: string;
  design?: {
    bgColor?: string;
    titleColor?: string;
    contentColor?: string;
    imagePos?: 'left' | 'right' | 'top' | 'bottom' | 'background' | 'none';
  }
}

export default function SlideGeneratorModal({ isOpen, onClose, plan }: Props) {
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen && !hasGenerated) {
      const storageKey = `slides_${plan.lessonTitle || 'draft'}`;
      const savedSlides = localStorage.getItem(storageKey);
      if (savedSlides) {
        try {
          const parsed = JSON.parse(savedSlides);
          if (parsed && parsed.length > 0) {
            setSlides(parsed);
            setHasGenerated(true);
            return;
          }
        } catch(e) {
          console.error(e);
        }
      } 
      generateSlideOutline();
      setHasGenerated(true);
    }
  }, [isOpen]);

  const generateSlideOutline = async () => {
    setIsLoading(true);
    try {
      const stepsArr = Object.values(plan.steps);
      const contentStr = stepsArr.map(s => s.content).filter(Boolean).join('\n');
      
      const promptText = `អ្នកគឺជាអ្នកបង្កើតស្លាយបទបង្ហាញដ៏ចំណានម្នាក់។ សូមប្រែសម្រួលកិច្ចតែងការបង្រៀននេះទៅជាស្លាយបទបង្ហាញដ៏ទាក់ទាញ (Presentation Outline)។
ម៉ោងសិក្សា៖ ${plan.subject}, មេរៀន៖ ${plan.lessonTitle}, ថ្នាក់ទី៖ ${plan.grade}

ខ្លឹមសារមេរៀនពីកិច្ចតែងការ៖
${contentStr}

សូមបង្កើតជាស្លាយបទបង្ហាញ ដោយយកតាមលំដាប់លំដោយនៃខ្លឹមសារមេរៀនពីកិច្ចតែងការខាងលើ (ពិសេសផ្តោតលើមេរៀនថ្មី និងសកម្មភាពពង្រឹងចំណេះដឹង)។
សូមបង្កើតជាទម្រង់ JSON Array ដោយមិនមានពាក្យណែនាំអ្វីផ្សេង ដូចទម្រង់ខាងក្រោម៖
[
  {
    "title": "ចំណងជើងស្លាយ",
    "subtitle": "ចំណងជើងរង (មានឬគ្មានក៏បាន)",
    "content": ["ចំណុចទី១", "ចំណុចទី២", "ចំណុចខ្លីៗនីមួយៗអោយខ្លីៗ ច្បាស់ៗ"],
    "type": "intro",
    "imageKeyword": "ពាក្យគន្លឹះជាភាសាអង់គ្លេសសម្រាប់ស្វែងរករូបភាព (ឧទាហរណ៍៖ cute kids studying cartoon, beautiful nature landscape, colorful math symbols)",
    "design": {
      "bgColor": "កូដពណ៌ Hex សម្រាប់ផ្ទៃខាងក្រោយ (ឧទាហរណ៍៖ #FDF4FF)",
      "titleColor": "កូដពណ៌ Hex សម្រាប់ចំណងជើង (ឧទាហរណ៍៖ #4C1D95)",
      "contentColor": "កូដពណ៌ Hex សម្រាប់អត្ថបទ (ឧទាហរណ៍៖ #334155)",
      "imagePos": "left" // ជ្រើសរើសមួយ៖ left, right, top, bottom, background, ឫ none
    }
  }
]

កំណត់សម្គាល់៖
- type អាចជា៖ intro, content, activity, summary។
- ការរចនា (design) ត្រូវមានពណ៌ចម្រុះ ស្រស់ស្អាត ទាក់ទាញសិស្សកុមារតូចៗ។
- រូបភាព (imageKeyword) ត្រូវតែពាក់ព័ន្ធនឹងខ្លឹមសារមេរៀន។ បើចង់បានរូបភាពតុក្កតា សូមបញ្ជាក់ពាក្យ 'cartoon' ក្នុង keyword។
- imagePos គឺទីតាំងរូបភាព៖ left, right, top, bottom, background ឬ none (មិនដាក់រូបភាព)។`;

      const response = await fetch('/api/generateLessonPlan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptText, isJson: true })
      });
      
      if (!response.ok) throw new Error('Failed to generate slides outline');
      
      const data = await response.json();
      let text = data.text || '';
      text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      const match = text.match(/\[[\s\S]*\]/);
      if (match) {
        text = match[0];
      }
      const parsedSlides = JSON.parse(text);
      setSlides(parsedSlides);
    } catch (error) {
      console.error(error);
      alert('មានបញ្ហាក្នុងការបង្កើតស្លាយ។ សូមព្យាយាមម្ដងទៀត។');
    }
    setIsLoading(false);
  };

  const handleDownloadPPTX = async () => {
    setIsDownloading(true);
    try {
      let pres = new pptxgen();
      pres.author = 'AI Lesson Plan';
      pres.company = 'MoEYS';
      pres.title = plan.lessonTitle;
      pres.layout = 'LAYOUT_16x9'; // 10 x 5.625 inches

      slides.forEach((slide) => {
        let presSlide = pres.addSlide();
        
        let bgColor = (slide.design?.bgColor || '#FFFFFF').replace('#', '');
        let titleColor = (slide.design?.titleColor || '#1E293B').replace('#', '');
        let contentColor = (slide.design?.contentColor || '#334155').replace('#', '');
        let imagePos = slide.design?.imagePos || 'none';

        presSlide.background = { color: bgColor };

        let imagePath = '';
        if (slide.imageKeyword && imagePos !== 'none') {
          imagePath = `https://image.pollinations.ai/prompt/${encodeURIComponent(slide.imageKeyword)}?nologo=true`;
        }

        if (imagePos === 'background' && imagePath) {
           presSlide.addImage({ path: imagePath + '&width=1920&height=1080', x: 0, y: 0, w: '100%', h: '100%' });
           presSlide.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: '100%', h: '100%', fill: { color: bgColor, transparency: 15 } });
           imagePos = 'none';
        }

        let textX = 0.5, textY = 0.5, textW = 9, textH = 4.5;
        let imgX = 0, imgY = 0, imgW = 0, imgH = 0;

        if (imagePos === 'left' && imagePath) {
           imgX = 0.5; imgY = 1; imgW = 4; imgH = 4;
           textX = 5; textY = 1; textW = 4.5; textH = 4;
        } else if (imagePos === 'right' && imagePath) {
           textX = 0.5; textY = 1; textW = 4.5; textH = 4;
           imgX = 5.5; imgY = 1; imgW = 4; imgH = 4;
        } else if (imagePos === 'top' && imagePath) {
           imgX = 3; imgY = 0.3; imgW = 4; imgH = 2.5;
           textX = 0.5; textY = 3.0; textW = 9; textH = 2.5;
        } else if (imagePos === 'bottom' && imagePath) {
           textX = 0.5; textY = 0.3; textW = 9; textH = 2.5;
           imgX = 3; imgY = 3.0; imgW = 4; imgH = 2.5;
        }

        // Add Image
        if (imagePath && imagePos !== 'none' && imagePos !== 'background') {
           presSlide.addImage({ path: imagePath + `&width=800&height=800`, x: imgX, y: imgY, w: imgW, h: imgH });
        }

        // Add Title
        let titleY = imagePos === 'top' ? textY : 0.5;
        let contentY = titleY + 1.0;
        if (imagePos === 'left' || imagePos === 'right') {
           titleY = 1;
           contentY = 2;
        }

        if (slide.type === 'intro' || slide.type === 'summary') {
            presSlide.addText(slide.title, {
              x: textX, y: titleY, w: textW, h: 1.2, align: 'center', fontSize: slide.type === 'intro' ? 44 : 36, bold: true, color: titleColor, fontFace: 'Khmer OS Muol Light'
            });
            if (slide.subtitle) {
               presSlide.addText(slide.subtitle, {
                 x: textX, y: titleY + 1.2, w: textW, h: 0.8, align: 'center', fontSize: 24, color: contentColor, fontFace: 'Khmer OS Battambang'
               });
               contentY = titleY + 2.0;
            }
            if (slide.content && slide.content.length > 0) {
                let contentText = slide.content.map(c => `• ${c}`).join('\n');
                presSlide.addText(contentText, {
                  x: textX, y: contentY, w: textW, h: textH - (contentY - textY), fontSize: 22, color: contentColor, fontFace: 'Khmer OS Battambang', align: 'center'
                });
            }
        } else {
            presSlide.addText(slide.title, {
              x: textX, y: titleY, w: textW, h: 0.8, align: 'left', fontSize: 32, bold: true, color: titleColor, fontFace: 'Khmer OS Muol Light'
            });
            if (slide.content && slide.content.length > 0) {
              let contentText = slide.content.map(c => c).join('\n\n');
              presSlide.addText(contentText, {
                x: textX, y: contentY, w: textW, h: textH - (contentY - textY), fontSize: 24, color: contentColor, fontFace: 'Khmer OS Battambang', align: 'left', bullet: true
              });
            }
        }
      });

      await pres.writeFile({ fileName: `Lesson_${plan.lessonTitle}_Presentation.pptx` });

    } catch (error) {
      console.error(error);
      alert('មានបញ្ហាក្នុងការទាញយកស្លាយបទបង្ហាញ។ សូមព្យាយាមម្តងទៀត។');
    }
    setIsDownloading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 pb-20 sm:pb-6 print:hidden">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl flex flex-col h-[95vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0 rounded-t-3xl rounded-b-none">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-violet-100 text-violet-600">
              <Presentation className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800 font-khmer">បង្កើតស្លាយមេរៀន (PowerPoint)</h2>
              <p className="text-sm text-slate-500 font-khmer mt-0.5">{plan.subject} - {plan.lessonTitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
             <button 
                onClick={generateSlideOutline}
                disabled={isLoading || isDownloading}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-sm font-bold text-slate-700 transition"
              >
                ចងក្រងម្ដងទៀត
             </button>
             <button 
                onClick={() => {
                  const storageKey = `slides_${plan.lessonTitle || 'draft'}`;
                  localStorage.setItem(storageKey, JSON.stringify(slides));
                  setIsSaving(true);
                  setTimeout(() => setIsSaving(false), 2000);
                }}
                disabled={isLoading || slides.length === 0 || isSaving}
                className={`px-4 py-2 text-white rounded-lg text-sm font-bold transition disabled:opacity-50 ${isSaving ? 'bg-emerald-500' : 'bg-emerald-600 hover:bg-emerald-700'}`}
              >
                {isSaving ? 'បានរក្សាទុក' : 'រក្សាទុក'}
             </button>
             <button 
                onClick={handleDownloadPPTX}
                disabled={isLoading || isDownloading || slides.length === 0}
                className="px-4 py-2 flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-bold transition disabled:opacity-50"
              >
                {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} ទាញយក PPTX
             </button>
             <button 
                onClick={() => window.print()}
                disabled={isLoading || slides.length === 0}
                className="px-4 py-2 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold transition disabled:opacity-50"
              >
                ទាញយក PDF
             </button>
             <button 
                onClick={() => { setSlides([]); onClose(); }}
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

        {/* Content Preview */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100">
            {isLoading ? (
               <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <Loader2 className="w-12 h-12 animate-spin text-violet-500" />
                  <p className="text-slate-500 font-khmer">AI កំពុងរៀបរចនាសម្ព័ន្ធស្លាយបទបង្ហាញ និងរូបភាព...</p>
               </div>
            ) : slides.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                 {slides.map((slide, index) => {
                   const hasImage = slide.imageKeyword && slide.design?.imagePos !== 'none';
                   const imgUrl = hasImage ? `https://image.pollinations.ai/prompt/${encodeURIComponent(slide.imageKeyword!)}?width=400&height=400&nologo=true` : '';
                   const bgUrl = slide.design?.imagePos === 'background' ? `https://image.pollinations.ai/prompt/${encodeURIComponent(slide.imageKeyword!)}?width=800&height=600&nologo=true` : '';

                   return (
                     <div 
                       key={index} 
                       className="aspect-[16/9] rounded-xl shadow-md overflow-hidden border border-slate-200 flex flex-col relative"
                       style={{ 
                         backgroundColor: slide.design?.bgColor || '#FFFFFF',
                         backgroundImage: bgUrl ? `url(${bgUrl})` : 'none',
                         backgroundSize: 'cover',
                         backgroundPosition: 'center'
                       }}
                     >
                       {bgUrl && <div className="absolute inset-0 bg-white/70" style={{ backgroundColor: slide.design?.bgColor ? slide.design.bgColor + 'CC' : '#FFFFFFCC' }} />}
                       
                       {/* Preview Slide Header */}
                       <div className="px-4 border-b py-2 bg-black/5 relative z-10">
                         <div className="text-xs font-bold text-slate-600" style={{ color: slide.design?.titleColor }}>
                           ស្លាយទី {index + 1} - {slide.type.toUpperCase()}
                         </div>
                       </div>
                       
                       {/* Preview Slide Body */}
                       <div className={`p-4 flex-1 flex ${slide.design?.imagePos === 'left' ? 'flex-row-reverse' : slide.design?.imagePos === 'right' ? 'flex-row' : slide.design?.imagePos === 'top' ? 'flex-col-reverse' : 'flex-col'} gap-4 relative z-10 overflow-hidden`}>
                         
                         <div className={`flex-1 flex flex-col ${slide.type === 'intro' || slide.type === 'summary' ? 'justify-center items-center text-center' : 'justify-start'}`}>
                           <h3 
                             className={`font-moul mb-2 ${slide.type === 'intro' ? 'text-2xl' : 'text-lg'}`}
                             style={{ color: slide.design?.titleColor || '#1E293B' }}
                           >
                             {slide.title}
                           </h3>
                           {slide.subtitle && (
                             <p 
                               className="text-sm mb-4 font-bold"
                               style={{ color: slide.design?.contentColor || '#334155' }}
                             >
                               {slide.subtitle}
                             </p>
                           )}
                           {slide.content && slide.content.length > 0 && (
                             <ul 
                               className={`${slide.type === 'intro' || slide.type === 'summary' ? 'list-none space-y-2' : 'list-disc pl-5 space-y-1'} text-sm overflow-y-auto custom-scrollbar`}
                               style={{ color: slide.design?.contentColor || '#334155' }}
                             >
                               {slide.content.map((item, i) => (
                                 <li key={i}>{item}</li>
                               ))}
                             </ul>
                           )}
                         </div>

                         {/* Image Preview */}
                         {hasImage && slide.design?.imagePos !== 'background' && (
                           <div className={`flex items-center justify-center ${(slide.design?.imagePos === 'left' || slide.design?.imagePos === 'right') ? 'w-1/3' : 'h-1/2'}`}>
                             <img src={imgUrl} alt="Slide Graphic" className="rounded-lg object-cover max-h-full max-w-full shadow-sm" crossOrigin="anonymous" />
                           </div>
                         )}
                       </div>
                     </div>
                   );
                 })}
               </div>
            ) : (
               <div className="flex flex-col items-center justify-center h-full text-slate-400 font-khmer">
                  មិនទាន់មានទិន្នន័យស្លាយ។ សូមចុច "ចងក្រងម្ដងទៀត"។
               </div>
            )}
        </div>
      </div>
    </div>
  );
}
