import React, { useState } from 'react';
import { BookOpen, Search, ChevronDown, ChevronRight, FileQuestion } from 'lucide-react';

const QUESTION_BANK_DATA = [
  {
    chapter: "ជំពូកទី ១៖ ចំនួន និងប្រមាណវិធី",
    lessons: [
      {
        title: "មេរៀនទី១៖ ទំហំ",
        subtitles: [
          "ការប្រៀបធៀបទំហំវត្ថុ៖ ធំ តូច",
          "ការប្រៀបធៀបពាក្យ៖ ធំជាង តូចជាង",
          "ការកំណត់អត្តសញ្ញាណ៖ ធំជាងគេ តូចជាងគេ"
        ]
      },
      {
        title: "មេរៀនទី២៖ ទីតាំង",
        subtitles: [
          "ការប្រាប់ទីតាំង៖ លើ ក្រោម, ក្នុង ក្រៅ",
          "ការប្រាប់ទិសដៅ៖ ឆ្វេង ស្តាំ, ជិត ឆ្ងាយ",
          "លំដាប់លំដោយ៖ មុន ក្រោយ, កណ្តាល និងចន្លោះ"
        ]
      },
      {
        title: "មេរៀនទី៣៖ ចំនួនពី ១ ដល់ ៥",
        subtitles: [
          "ការរាប់ចំនួនជាក់ស្តែងពី ១ ដល់ ៥",
          "ការអាន និងការសរសេរអក្សរខ្មែរ លេខខ្មែរ និងលេខអារ៉ាប់",
          "ការសរសេរតាមការណែនាំ"
        ]
      },
      {
        title: "មេរៀនទី៤៖ ចំនួន ០ ដល់ ១០",
        subtitles: [
          "ការស្គាល់តម្លៃសូន្យ (០) - គ្មានវត្ថុសោះ",
          "ការរាប់ចំនួនវត្ថុពី ៦ ដល់ ១០",
          "ការអាន និងសរសេរលេខខ្មែរ និងលេខអារ៉ាប់ចាប់ពី ៦ ដល់ ១០"
        ]
      },
      {
        title: "មេរៀនទី៥៖ ការប្រៀបធៀបចំនួន និងលំដាប់ចំនួន",
        subtitles: [
          "គំនិតប្រៀបធៀប៖ ស្មើគ្នា មិនស្មើគ្នា, ច្រើនជាង តិចជាង",
          "ការប្រើប្រាស់សញ្ញាប្រៀបធៀប៖ ស្មើ (=), ធំជាង (>), តូចជាង (<)",
          "ការរៀបលំដាប់ចំនួនពីតូចទៅធំ (លំដាប់កើន) និងពីធំទៅតូច (លំដាប់ចុះ)"
        ]
      },
      {
        title: "មេរៀនទី៦៖ វិធីបូក និងវិធីដក ចំនួនមានលទ្ធផលមិនលើសពី ៩",
        subtitles: [
          "វិធីបូក៖ ការរួមបញ្ចូលគ្នានៃក្រុមវត្ថុពីរ",
          "វិធីដក៖ ការដកចេញ ការបំបែក ឬការបាត់បង់",
          "ការដោះស្រាយលំហាត់ និងចំណោទរូបភាពសាមញ្ញ"
        ]
      },
      {
        title: "មេរៀនទី៧៖ វិធីបូក និងវិធីដក ចំនួនមានលទ្ធផលមិនលើសពី ១០",
        subtitles: [
          "ប្រមាណវិធីបូកដែលមានផលបូកស្មើនឹង ១០",
          "ប្រមាណវិធីដកចេញពីចំនួន ១០",
          "ការគណនាប្រមាណវិធីបូក និងដកជាមួយចំនួនសូន្យ (០)"
        ]
      },
      {
        title: "មេរៀនទី៨៖ ចំនួនពី ១០ ដល់ ២០",
        subtitles: [
          "ការរាប់ ការអាន និងការសរសេរចំនួនចាប់ពី ១០ ដល់ ២០",
          "ការយល់ដឹងអំពីបន្ទាត់ចំនួន",
          "ការរៀបលំដាប់ចំនួន និងការយល់ដឹងពីតម្លៃលេខតាមខ្ទង់ (ខ្ទង់ដប់ និងខ្ទង់រាយ)"
        ]
      },
      {
        title: "មេរៀនទី១០៖ វិធីបូក និងវិធីដក ចំនួនមិនលើសពី ២០",
        subtitles: [
          "វិធីបូកចំនួនពីរខ្ទង់នឹងមួយខ្ទង់ (គ្មានត្រួត)",
          "វិធីដកចំនួនពីរខ្ទង់នឹងមួយខ្ទង់ (គ្មានខ្ចី)",
          "ការដោះស្រាយលំហាត់គណនាប្រចាំថ្ងៃ"
        ]
      },
      {
        title: "មេរៀនទី១១៖ ចំនួនរហូតដល់ ១០០",
        subtitles: [
          "ការរាប់ចំនួនទសសិប (១០, ២០, ៣០, ៤០, ៥០, ៦០, ៧០, ៨០, ៩០, ១០០)",
          "ការអាន និងសរសេរចំនួនទសសិបជាលេខខ្មែរ និងលេខអារ៉ាប់",
          "ការរាប់ ការអាន និងសរសេរចំនួនបន្តបន្ទាប់រហូតដល់ ១០០"
        ]
      },
      {
        title: "មេរៀនទី១៧៖ វិធីបូក និងវិធីដក ចំនួនមិនលើសពី ១០០",
        subtitles: [
          "ប្រមាណវិធីបូកចំនួនពីរខ្ទង់នឹងពីរខ្ទង់ (គ្មានត្រួត)",
          "ប្រមាណវិធីដកចំនួនពីរខ្ទង់នឹងពីរខ្ទង់ (គ្មានខ្ចី)",
          "ការសរសេរចំនួនក្នុងទម្រង់ពង្រាយ (ឧទាហរណ៍៖ ២៥ = ២០ + ៥)"
        ]
      }
    ]
  },
  {
    chapter: "ជំពូកទី ២៖ រង្វាស់រង្វាល់",
    lessons: [
      {
        title: "មេរៀនទី១២៖ ប្រវែង",
        subtitles: [
          "ការប្រៀបធៀបប្រវែង៖ វែង ខ្លី, វែងជាង ខ្លីជាង, វែងជាងគេ ខ្លីជាងគេ",
          "ការវាស់ប្រវែងដោយប្រើប្រាស់ឧបករណ៍មិនស្តង់ដា (ចំអាម ជំហាន ខ្ទង់ដៃ)"
        ]
      },
      {
        title: "មេរៀនទី១៣៖ ទម្ងន់",
        subtitles: [
          "ការប្រៀបធៀបទម្ងន់៖ ធ្ងន់ ស្រាល, ធ្ងន់ជាង ស្រាលជាង, ធ្ងន់ជាងគេ ស្រាលជាងគេ",
          "ការប្រើប្រាស់ជញ្ជីងពីរថាសដើម្បីប្រៀបធៀបទម្ងន់វត្ថុពីរ"
        ]
      },
      {
        title: "មេរៀនទី១៤៖ ចំណុះ",
        subtitles: [
          "ការប្រៀបធៀបចំណុះ៖ ច្រើនជាង តិចជាង ស្មើគ្នា",
          "ការវាស់ចំណុះដប កែវ និងធុងដោយប្រើប្រាស់កែវខ្នាតសាមញ្ញ"
        ]
      },
      {
        title: "មេរៀនទី១៥៖ ពេលវេលា",
        subtitles: [
          "ការស្គាល់ពេលវេលា៖ ពេលព្រឹក ពេលថ្ងៃ ពេលល្ងាច ពេលយប់",
          "ថ្ងៃនៃសប្តាហ៍ទាំង ៧ ថ្ងៃ (ចន្ទ អង្គារ ពុធ ... អាទិត្យ)",
          "ការអាន និងប្រាប់ម៉ោងគត់នៅលើនាឡិកា"
        ]
      },
      {
        title: "មេរៀនទី១៨៖ រូបិយវត្ថុ",
        subtitles: [
          "ការស្គាល់ប្រភេទក្រដាសប្រាក់រៀលខ្មែរ៖ ៥០រៀល, ១០០រៀល, ៥០០រៀល",
          "ការប្តូរប្រាក់ និងប្រមាណវិធីទិញលក់ងាយៗនៅក្នុងជីវភាពជាក់ស្តែង"
        ]
      }
    ]
  },
  {
    chapter: "ជំពូកទី ៣៖ ធរណីមាត្រ",
    lessons: [
      {
        title: "មេរៀនទី៩៖ ធរណីមាត្រ",
        subtitles: [
          "ការស្គាល់ចំណុច ខ្សែកោង និងខ្សែត្រង់",
          "បន្ទាត់ត្រង់ និងការសរសេរឈ្មោះបន្ទាត់ (ដូចជា បន្ទាត់កខ ឬបន្ទាត់ខក)",
          "រូបធរណីមាត្រវិមាត្រពីរ៖ ការេ ត្រីកោណ រង្វង់ និងចតុកោណកែង",
          "រូបធរណីមាត្រវិមាត្របី៖ គូប ប្រអប់ (ប្រលេពីប៉ែតកែង) ស៊ីឡាំង និងស្វែរ"
        ]
      }
    ]
  },
  {
    chapter: "ជំពូកទី ៤៖ ស្ថិតិ",
    lessons: [
      {
        title: "មេរៀនទី១៦៖ ក្រាបរូបភាព",
        subtitles: [
          "ការប្រមូលទិន្នន័យជាក់ស្តែង (ឧទាហរណ៍៖ ចំនួនសត្វ ឬផ្លែឈើ)",
          "ការតម្រៀបទិន្នន័យ និងការចាត់ក្រុមរូបភាពនៅក្នុងតារាង",
          "ការអាន និងបកស្រាយព័ត៌មានពីក្រាបរូបភាពសាមញ្ញ"
        ]
      }
    ]
  },
  {
    chapter: "ជំពូកទី ៥៖ លំនាំគំរូ",
    lessons: [
      {
        title: "មេរៀនទី១៩៖ លំនាំគំរូ",
        subtitles: [
          "ការស្វែងយល់ពីលំនាំគំរូតម្រៀបតាមពណ៌",
          "ការស្វែងយល់ពីលំនាំគំរូតម្រៀបតាមរូបរាងធរណីមាត្រ",
          "ការស្វែងយល់ពីលំនាំគំរូតម្រៀបតាមទំហំ និងចំនួន"
        ]
      }
    ]
  }
];

import { ArrowLeft } from 'lucide-react';

interface Props {
  onBack?: () => void;
}

export default function QuestionBankView({ onBack }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedChapters, setExpandedChapters] = useState<Record<number, boolean>>({
    0: true // Open first chapter by default
  });

  const toggleChapter = (index: number) => {
    setExpandedChapters(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const filteredData = QUESTION_BANK_DATA.map(chapter => {
    return {
      ...chapter,
      lessons: chapter.lessons.filter(lesson => 
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.subtitles.some(sub => sub.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    };
  }).filter(chapter => chapter.lessons.length > 0 || chapter.chapter.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        
        {onBack && (
        <button 
          onClick={onBack}
          className="mb-6 w-12 h-12 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center text-slate-500 hover:text-slate-700 shadow-sm transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center relative">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
              <FileQuestion className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 font-khmer tracking-tight">Question Bank</h1>
              <p className="text-slate-500 mt-1 font-khmer">កម្រងសំណួរ និងខ្លឹមសារមេរៀនតាមជំពូក</p>
            </div>
          </div>
          
          <div className="relative w-full md:w-auto">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="ស្វែងរកមេរៀន ឬចំណងជើង..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-80 pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-khmer text-sm transition-all"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {filteredData.map((chapter, chapterIdx) => (
          <div key={chapterIdx} className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden transition-all">
            <button 
              onClick={() => toggleChapter(chapterIdx)}
              className="w-full px-6 py-5 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
            >
              <h2 className="text-lg font-bold text-slate-800 font-khmer text-left">
                {chapter.chapter}
              </h2>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-200 ${expandedChapters[chapterIdx] || searchQuery ? 'rotate-180 bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                <ChevronDown className="w-5 h-5" />
              </div>
            </button>
            
            {(expandedChapters[chapterIdx] || searchQuery) && (
              <div className="px-6 pb-6 pt-2 border-t border-slate-100">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {chapter.lessons.map((lesson, lessonIdx) => (
                    <div key={lessonIdx} className="bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:border-emerald-200 transition-colors group">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                          <BookOpen className="w-3.5 h-3.5" />
                        </div>
                        <h3 className="font-bold text-slate-800 font-khmer leading-snug group-hover:text-emerald-700 transition-colors">
                          {lesson.title}
                        </h3>
                      </div>
                      
                      <div className="pl-9">
                        <ul className="space-y-2">
                          {lesson.subtitles.map((subtitle, subIdx) => (
                            <li key={subIdx} className="flex items-start gap-2 text-sm text-slate-600 font-khmer leading-relaxed">
                              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                              <span>{subtitle}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredData.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/60 shadow-sm">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 font-khmer mb-1">រកមិនឃើញលទ្ធផល</h3>
            <p className="text-slate-500 font-khmer">សូមសាកល្បងពាក្យគន្លឹះផ្សេងទៀត</p>
          </div>
        )}
      </div>
    </div>
  );
}
