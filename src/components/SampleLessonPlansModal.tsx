import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Search, 
  BookOpen, 
  Sparkles, 
  Check, 
  Layers, 
  Gamepad2, 
  Clock, 
  Target, 
  GraduationCap,
  ArrowRight,
  Filter,
  Eye,
  ChevronLeft,
  FileText,
  Printer,
  Columns,
  Maximize2,
  ZoomIn
} from 'lucide-react';
import { GRADE_LESSON_PRESETS, GradePresetItem } from '../data/gradeLessonPresets';
import { Grade, LessonPlan } from '../types';

interface SampleLessonPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGrade: Grade;
  currentSubject: string;
  onSelectPreset: (presetId: string) => void;
  onSelectAndGenerateAI: (presetId: string) => void;
  onGenerateCustomAI: (grade: Grade, subject: string, topic: string) => void;
  isGenerating?: boolean;
}

const ALL_SUBJECTS = [
  'គ្រប់មុខវិជ្ជា',
  'គណិតវិទ្យា',
  'ភាសាខ្មែរ',
  'វិទ្យាសាស្ត្រ',
  'សិក្សាសង្គម',
  'អប់រំកាយ',
  'ភាសាអង់គ្លេស'
];

const SUBJECT_COLORS: Record<string, { bg: string; text: string; border: string; activeBg: string }> = {
  'គណិតវិទ្យា': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', activeBg: 'bg-blue-600 text-white' },
  'ភាសាខ្មែរ': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', activeBg: 'bg-emerald-600 text-white' },
  'វិទ្យាសាស្ត្រ': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', activeBg: 'bg-purple-600 text-white' },
  'សិក្សាសង្គម': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', activeBg: 'bg-amber-600 text-white' },
  'អប់រំកាយ': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', activeBg: 'bg-rose-600 text-white' },
  'ភាសាអង់គ្លេស': { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', activeBg: 'bg-sky-600 text-white' },
};

const parseBlocks = (text: string | null | undefined) => {
  if (!text || text === '...') return [];
  const lines = text.split('\n').filter(l => l.trim().length > 0);
  const blocks: string[][] = [];
  let currentBlock: string[] = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    const isHeaderStart = trimmed.startsWith('•') || /^[oO]\s+/i.test(trimmed) || trimmed.startsWith('o ') || trimmed.startsWith('O ');
    if (isHeaderStart || currentBlock.length === 0) {
      if (currentBlock.length > 0) {
        blocks.push([...currentBlock]);
      }
      currentBlock = [line];
    } else {
      currentBlock.push(line);
    }
  }
  if (currentBlock.length > 0) {
    blocks.push(currentBlock);
  }
  return blocks;
};

const renderBulletedList = (text: string | null | undefined, compact: boolean = false) => {
  if (!text || text === '...') return text || '...';
  const lines = text.split('\n').filter(l => l.trim().length > 0);
  return (
    <div className={`space-y-1 text-left w-full ${compact ? 'text-[9pt]' : 'text-[10pt]'}`}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (/^[oO]\s+/i.test(trimmed) || trimmed.startsWith('o ') || trimmed.startsWith('O ')) {
          return (
            <div key={idx} className={`font-bold text-[#1a3a8f] pt-1 pb-0.5 flex items-center gap-1.5 border-b border-blue-100 mb-1 ${compact ? 'text-[9.5pt]' : 'text-[10.5pt]'}`}>
              <span className="inline-block w-2 h-2 rounded-full border-2 border-[#1a3a8f] bg-blue-50 shrink-0"></span>
              <span>{trimmed.replace(/^[oO]\s*/i, '')}</span>
            </div>
          );
        }

        const leadingWhitespace = line.match(/^\s*/)?.[0] || '';
        const spaceCount = leadingWhitespace.replace(/\t/g, '  ').length;
        const isSubBullet = spaceCount > 0 || trimmed.startsWith('-');
        const cleanLine = trimmed.replace(/^[-*•]\s*/, '');
        
        return (
          <div key={idx} className={`flex items-start gap-1.5 ${isSubBullet ? 'ml-3 text-slate-700' : 'ml-0 text-slate-900'}`}>
            <span className="shrink-0 mt-[2px] font-bold text-slate-500 text-xs">{isSubBullet ? '−' : '•'}</span>
            <span className="flex-1 leading-relaxed">{cleanLine}</span>
          </div>
        );
      })}
    </div>
  );
};

export default function SampleLessonPlansModal({
  isOpen,
  onClose,
  currentGrade,
  currentSubject,
  onSelectPreset,
  onSelectAndGenerateAI,
  onGenerateCustomAI,
  isGenerating = false,
}: SampleLessonPlansModalProps) {
  const [selectedGrade, setSelectedGrade] = useState<Grade | 'all'>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('គ្រប់មុខវិជ្ជា');
  const [searchQuery, setSearchQuery] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [previewPreset, setPreviewPreset] = useState<GradePresetItem | null>(null);
  const [viewMode, setViewMode] = useState<'a4_cards' | 'split'>('a4_cards');

  // Filter presets based on grade, subject, and search query
  const filteredPresets = useMemo(() => {
    return GRADE_LESSON_PRESETS.filter(item => {
      // Grade filter
      if (selectedGrade !== 'all' && item.grade !== selectedGrade) {
        return false;
      }

      // Subject filter
      if (selectedSubject !== 'គ្រប់មុខវិជ្ជា') {
        const itemSub = item.subject || '';
        if (!itemSub.includes(selectedSubject)) {
          return false;
        }
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = item.title?.toLowerCase().includes(q);
        const subMatch = item.subject?.toLowerCase().includes(q);
        const lessonTitleMatch = item.plan.lessonTitle?.toLowerCase().includes(q);
        const chapterTitleMatch = item.plan.chapterTitle?.toLowerCase().includes(q);
        const gameMatch = item.plan.educationalGame?.toLowerCase().includes(q);
        return titleMatch || subMatch || lessonTitleMatch || chapterTitleMatch || gameMatch;
      }

      return true;
    });
  }, [selectedGrade, selectedSubject, searchQuery]);

  // Selected item for split view
  const activeSplitPreset = useMemo(() => {
    if (previewPreset) return previewPreset;
    return filteredPresets[0] || null;
  }, [previewPreset, filteredPresets]);

  if (!isOpen) return null;

  // Render Full A4 Paper Preview of a preset
  const renderFullA4Paper = (item: GradePresetItem, isCompact: boolean = false) => {
    const p = item.plan;
    return (
      <div className={`bg-white rounded-xl shadow-xl border border-slate-300/80 text-slate-900 font-khmer w-full mx-auto transition-all ${
        isCompact 
          ? 'p-5 sm:p-6 text-xs' 
          : 'p-6 sm:p-10 max-w-[210mm] min-h-[297mm] text-xs sm:text-[11pt]'
      }`}>
        {/* Ministry & School Header */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-3 mb-4">
          <div className="flex flex-col items-center text-center">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/MoEYS_Logo.svg/240px-MoEYS_Logo.svg.png" 
              alt="MoEYS Logo" 
              className={`${isCompact ? 'w-10 h-10' : 'w-14 h-14'} object-contain mb-1`} 
            />
            <h3 className="text-[10pt] font-moul text-slate-800">
              {localStorage.getItem('user_school') || 'សាលាបឋមសិក្សា'}
            </h3>
          </div>
          <div className="text-center font-moul text-[10.5pt] text-blue-800 space-y-0.5">
            <p>ព្រះរាជាណាចក្រកម្ពុជា</p>
            <p>ជាតិ សាសនា ព្រះមហាក្សត្រ</p>
          </div>
        </div>

        {/* Lesson Plan Title */}
        <div className="text-center pb-3 mb-4 border-b border-slate-200 space-y-1">
          <h2 className="text-base sm:text-xl font-moul text-red-600 leading-relaxed">
            កិច្ចតែងការបង្រៀន
          </h2>
          <p className="text-xs font-bold text-slate-700">
            ថ្នាក់ទី {item.grade} • {item.subject}
          </p>
        </div>

        {/* General Info List */}
        <div className="bg-slate-50/90 p-3 sm:p-4 rounded-xl border border-slate-200/80 mb-5 leading-relaxed text-[10.5pt]">
          <ul className="list-disc pl-5 space-y-1 text-slate-800">
            <li><span className="font-bold">កាលបរិច្ឆេទ៖</span> {p.date || 'ថ្ងៃ... ខែ... ឆ្នាំ២០២...'}</li>
            <li><span className="font-bold">មុខវិជ្ជា៖</span> {item.subject}</li>
            <li><span className="font-bold">កម្រិតថ្នាក់៖</span> ថ្នាក់ទី {item.grade}</li>
            {p.week && <li><span className="font-bold">សប្តាហ៍៖</span> {p.week}</li>}
            <li><span className="font-bold">ជំពូកទី {p.chapter}៖</span> {p.chapterTitle}</li>
            <li><span className="font-bold">មេរៀនទី {p.lesson}៖</span> {p.lessonTitle}</li>
            <li><span className="font-bold">រយៈពេល៖</span> {p.duration || 40} នាទី</li>
            <li><span className="font-bold">គោលវិធី៖</span> {p.approach || 'សិស្សមជ្ឈមណ្ឌល'}</li>
            <li><span className="font-bold">វិធីសាស្ត្របង្រៀន៖</span> {p.teachingMethods || 'ម៉ូដែល 5E'}</li>
            <li><span className="font-bold">យុទ្ធវិធីបង្រៀន៖</span> {p.strategy || 'ការអនុវត្តផ្ទាល់ដៃ, Think-Pair-Share'}</li>
            {p.educationalGame && (
              <li className="text-emerald-900 font-bold">
                <span className="text-slate-800">ល្បែងសិក្សា (ជំហានទី៤)៖</span> <span className="text-emerald-700">{p.educationalGame}</span>
              </li>
            )}
            <li><span className="font-bold">ឯកសារពិគ្រោះ៖</span> {p.references || 'សៀវភៅសិក្សាគោលក្រសួងអប់រំ យុវជន និងកីឡា'}</li>
          </ul>
        </div>

        {/* 1. Objectives */}
        <div className="space-y-2 mb-5">
          <h4 className="font-moul text-xs sm:text-sm text-slate-800">១. វត្ថុបំណងមេរៀន</h4>
          <div className="pl-3 sm:pl-4 space-y-1 text-slate-800 leading-relaxed bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 text-[10pt]">
            <p><span className="font-bold text-emerald-900">វិជ្ជាសម្បទា៖</span> {p.objectives?.knowledge || '...'}</p>
            <p><span className="font-bold text-emerald-900">បំណិនសម្បទា៖</span> {p.objectives?.skills || '...'}</p>
            <p><span className="font-bold text-emerald-900">ចរិយាសម្បទា៖</span> {p.objectives?.attitude || '...'}</p>
          </div>
        </div>

        {/* 2. Materials */}
        <div className="space-y-1.5 mb-5">
          <h4 className="font-moul text-xs sm:text-sm text-slate-800">២. សម្ភារបង្រៀន</h4>
          <div className="pl-3 sm:pl-4 space-y-1 text-slate-800 leading-relaxed text-[10pt]">
            <p><span className="font-bold">សម្រាប់គ្រូ៖</span> {p.materials?.teacher || '...'}</p>
            <p><span className="font-bold">សម្រាប់សិស្ស៖</span> {p.materials?.student || '...'}</p>
          </div>
        </div>

        {/* 3. Steps Table */}
        <div className="space-y-2 mb-6">
          <h4 className="font-moul text-xs sm:text-sm text-slate-800">៣. ដំណើរការបង្រៀន (៥ ជំហាន)</h4>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-blue-900 font-bold">
                  <th className="border-b border-r border-slate-200 p-2.5 w-1/3 text-center">សកម្មភាពគ្រូ</th>
                  <th className="border-b border-r border-slate-200 p-2.5 w-1/3 text-center">ខ្លឹមសារមេរៀន</th>
                  <th className="border-b border-slate-200 p-2.5 w-1/3 text-center">សកម្មភាពសិស្ស</th>
                </tr>
              </thead>
              <tbody>
                {p.steps && Object.entries(p.steps).map(([key, step], idx) => {
                  const tBlocks = parseBlocks(step.teacherActivity);
                  const cBlocks = parseBlocks(step.content);
                  const sBlocks = parseBlocks(step.studentActivity);
                  const maxBlocks = Math.max(tBlocks.length, cBlocks.length, sBlocks.length, 1);

                  return (
                    <React.Fragment key={key}>
                      <tr className="bg-blue-50/70">
                        <td colSpan={3} className="border-b border-slate-200 px-3 py-1.5 font-bold text-center text-blue-900 text-xs">
                          ជំហានទី {idx + 1} {idx === 3 && p.educationalGame ? ` - ${p.educationalGame}` : ''}
                        </td>
                      </tr>
                      {Array.from({ length: maxBlocks }).map((_, bIdx) => {
                        const isLast = bIdx === maxBlocks - 1;
                        return (
                          <tr key={`${key}-${bIdx}`} className="hover:bg-slate-50/50">
                            <td className={`border-r border-slate-200 p-2.5 align-top ${isLast ? 'border-b' : ''}`}>
                              {tBlocks[bIdx] ? renderBulletedList(tBlocks[bIdx].join('\n'), isCompact) : (bIdx === 0 && (!step.teacherActivity || step.teacherActivity === '...') ? '...' : null)}
                            </td>
                            <td className={`border-r border-slate-200 p-2.5 align-top ${isLast ? 'border-b' : ''}`}>
                              {cBlocks[bIdx] ? renderBulletedList(cBlocks[bIdx].join('\n'), isCompact) : (bIdx === 0 && (!step.content || step.content === '...') ? '...' : null)}
                            </td>
                            <td className={`border-slate-200 p-2.5 align-top ${isLast ? 'border-b' : ''}`}>
                              {sBlocks[bIdx] ? renderBulletedList(sBlocks[bIdx].join('\n'), isCompact) : (bIdx === 0 && (!step.studentActivity || step.studentActivity === '...') ? '...' : null)}
                            </td>
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Signatures */}
        <div className="pt-4 grid grid-cols-2 text-center text-xs font-khmer border-t border-slate-100">
          <div>
            <p className="font-bold">បានឃើញ និងឯកភាព</p>
            <p className="text-slate-600 mt-1">នាយកសាលា / គ្រូឧទ្ទេស</p>
            <div className="h-10 flex items-center justify-center text-slate-300">
              ..............................
            </div>
          </div>
          <div>
            <p className="italic">ថ្ងៃទី.......ខែ.......ឆ្នាំ២០២...</p>
            <p className="text-slate-600 mt-1 font-bold">គ្រូបង្រៀន</p>
            <div className="h-10 flex items-center justify-center text-slate-300">
              ..............................
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-6xl max-h-[95vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white p-4 sm:p-5 shrink-0 relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between relative z-10 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shrink-0">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg sm:text-xl font-black font-kantumruy tracking-tight">
                    ទិដ្ឋភាពគំរូកិច្ចតែងការបង្រៀន (A4)
                  </h2>
                  <span className="text-[11px] bg-white/25 px-2.5 py-0.5 rounded-full font-khmer font-bold border border-white/30">
                    ថ្នាក់ទី១ ដល់ទី៦ • គ្រប់មុខវិជ្ជា
                  </span>
                </div>
                <p className="text-xs text-amber-50 font-khmer mt-0.5">
                  មើល និងជ្រើសរើសទម្រង់ក្រដាសកិច្ចតែងការ A4 ស្តង់ដារក្រសួងអប់រំ និង TEC មកប្រើប្រាស់
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Toggle view mode */}
              <div className="flex items-center bg-black/20 p-1 rounded-xl text-xs font-khmer font-bold border border-white/20">
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('a4_cards');
                    setPreviewPreset(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'a4_cards' && !previewPreset
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>ក្រដាស A4 នីមួយៗ</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('split');
                    if (!previewPreset && filteredPresets[0]) {
                      setPreviewPreset(filteredPresets[0]);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'split'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span>មើលផ្ទាល់ពេញអេក្រង់</span>
                </button>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20 shrink-0"
                title="បិទ"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-slate-50 border-b border-slate-200/90 p-3.5 sm:p-4 space-y-3 shrink-0">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="ស្វែងរកចំណងជើងមេរៀន មុខវិជ្ជា ឬល្បែងសិក្សា..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-khmer text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold font-khmer cursor-pointer"
              >
                សម្អាត
              </button>
            )}
          </div>

          {/* Grade selection row */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            <span className="text-xs font-bold text-slate-500 font-khmer shrink-0 mr-1 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
              <span>កម្រិតថ្នាក់៖</span>
            </span>
            <button
              type="button"
              onClick={() => setSelectedGrade('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-khmer transition-all cursor-pointer shrink-0 ${
                selectedGrade === 'all'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              ទាំងអស់ (១-៦)
            </button>
            {[1, 2, 3, 4, 5, 6].map(g => (
              <button
                key={g}
                type="button"
                onClick={() => setSelectedGrade(g as Grade)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-khmer transition-all cursor-pointer shrink-0 ${
                  selectedGrade === g
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                ថ្នាក់ទី {g}
              </button>
            ))}
          </div>

          {/* Subject selection row */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            <span className="text-xs font-bold text-slate-500 font-khmer shrink-0 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-amber-600" />
              <span>មុខវិជ្ជា៖</span>
            </span>
            {ALL_SUBJECTS.map(sub => {
              const isActive = selectedSubject === sub;
              return (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setSelectedSubject(sub)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold font-khmer transition-all cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col bg-slate-100/70">
          {/* IF FULL PREVIEW OVERLAY IS ACTIVE */}
          {previewPreset && viewMode === 'a4_cards' ? (
            <div className="flex-1 flex flex-col overflow-hidden animate-in fade-in duration-200">
              {/* Action Toolbar */}
              <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between gap-3 shrink-0 font-khmer shadow-xs">
                <button
                  type="button"
                  onClick={() => setPreviewPreset(null)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>ត្រឡប់ទៅមើលក្រដាស A4 ទាំងអស់វិញ</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-bold hidden sm:inline">
                    ថ្នាក់ទី {previewPreset.grade} • {previewPreset.subject}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectPreset(previewPreset.id);
                      onClose();
                    }}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>យកគំរូ A4 នេះទៅប្រើប្រាស់</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectAndGenerateAI(previewPreset.id);
                      onClose();
                    }}
                    disabled={isGenerating}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4 text-amber-100" />
                    <span>បង្កើត AI បន្ត</span>
                  </button>
                </div>
              </div>

              {/* Scrollable Paper Preview */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-slate-200/60 no-scrollbar">
                {renderFullA4Paper(previewPreset, false)}
              </div>
            </div>
          ) : viewMode === 'split' ? (
            /* SPLIT / LIVE PREVIEW VIEW */
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* Left Column: Preset List */}
              <div className="w-full md:w-80 lg:w-96 border-r border-slate-200 bg-white overflow-y-auto p-3 space-y-2 shrink-0 no-scrollbar">
                <div className="text-xs text-slate-500 font-khmer pb-1 font-bold">
                  ជ្រើសរើសដើម្បីមើលទិដ្ឋភាពក្រដាស A4 ផ្ទាល់ ({filteredPresets.length})៖
                </div>
                {filteredPresets.map(preset => {
                  const isSelected = activeSplitPreset?.id === preset.id;
                  const subColors = SUBJECT_COLORS[preset.subject] || {
                    bg: 'bg-emerald-50',
                    text: 'text-emerald-700',
                    border: 'border-emerald-200',
                    activeBg: 'bg-emerald-600 text-white'
                  };

                  return (
                    <div
                      key={preset.id}
                      onClick={() => setPreviewPreset(preset)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer font-khmer space-y-1.5 ${
                        isSelected
                          ? 'bg-amber-50/80 border-amber-400 shadow-sm ring-1 ring-amber-400'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10.5px] font-black px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full">
                            ថ្នាក់ទី {preset.grade}
                          </span>
                          <span className={`text-[10.5px] font-black px-2 py-0.5 rounded-full border ${subColors.bg} ${subColors.text} ${subColors.border}`}>
                            {preset.subject}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">{preset.plan.duration || 40} នាទី</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-800 font-kantumruy leading-tight">
                        {preset.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">
                        ជំពូកទី {preset.plan.chapter} • មេរៀនទី {preset.plan.lesson}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Full A4 Render of Selected Plan */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-200/60 flex flex-col items-center no-scrollbar">
                {activeSplitPreset && (
                  <div className="w-full max-w-[210mm] space-y-4">
                    <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between gap-2 font-khmer shadow-sm sticky top-0 z-20">
                      <div>
                        <span className="text-xs font-bold text-slate-500">កំពុងមើលទិដ្ឋភាព A4 គំរូ៖</span>
                        <h4 className="text-sm font-black text-slate-800 font-kantumruy">{activeSplitPreset.title}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            onSelectPreset(activeSplitPreset.id);
                            onClose();
                          }}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          <span>យកគំរូនេះ</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onSelectAndGenerateAI(activeSplitPreset.id);
                            onClose();
                          }}
                          disabled={isGenerating}
                          className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                        >
                          <Sparkles className="w-4 h-4 text-amber-100" />
                          <span>បង្កើត AI</span>
                        </button>
                      </div>
                    </div>
                    {renderFullA4Paper(activeSplitPreset, false)}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* A4 PAPER CARDS GALLERY VIEW (Each card rendered as authentic A4 sheet) */
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 no-scrollbar">
              {/* Counter Banner */}
              <div className="flex items-center justify-between text-xs text-slate-500 font-khmer flex-wrap gap-2">
                <span className="font-medium">
                  ទិដ្ឋភាពក្រដាសកិច្ចតែងការ A4 ចំនួន <strong className="text-amber-700 font-bold">{filteredPresets.length} គំរូ</strong>
                  {selectedGrade !== 'all' ? ` (ថ្នាក់ទី ${selectedGrade})` : ''}
                  {selectedSubject !== 'គ្រប់មុខវិជ្ជា' ? ` (${selectedSubject})` : ''}
                </span>
                <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  ចុចលើក្រដាស A4 ណាមួយដើម្បី <strong>«មើលពេញលេញ»</strong> ឬចុច <strong>«យកគំរូនេះ»</strong>
                </span>
              </div>

              {filteredPresets.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center space-y-3 font-khmer">
                  <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-slate-600 font-bold text-sm">
                    មិនមានគំរូកិច្ចតែងការដែលត្រូវនឹងលក្ខខណ្ឌស្វែងរកនេះឡើយ
                  </p>
                  <p className="text-xs text-slate-400">
                    លោកអ្នកអាចជ្រើសរើស «ទាំងអស់» ឬបង្កើតកិច្ចតែងការថ្មីដោយ AI នៅខាងក្រោម
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                  {filteredPresets.map(preset => {
                    const subColors = SUBJECT_COLORS[preset.subject] || {
                      bg: 'bg-emerald-50',
                      text: 'text-emerald-700',
                      border: 'border-emerald-200',
                      activeBg: 'bg-emerald-600 text-white'
                    };

                    return (
                      <div
                        key={preset.id}
                        className="bg-white rounded-2xl border border-slate-300 shadow-md hover:shadow-xl hover:border-amber-400 transition-all flex flex-col justify-between overflow-hidden group"
                      >
                        {/* Realistic Mini A4 Paper Sheet Header */}
                        <div className="bg-slate-100/90 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between font-khmer">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-black px-2.5 py-0.5 bg-amber-100 text-amber-900 rounded-full border border-amber-200">
                              ថ្នាក់ទី {preset.grade}
                            </span>
                            <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border ${subColors.bg} ${subColors.text} ${subColors.border}`}>
                              {preset.subject}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 font-bold flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{preset.plan.duration || 40} នាទី</span>
                          </span>
                        </div>

                        {/* A4 Sheet Content Preview */}
                        <div 
                          onClick={() => setPreviewPreset(preset)}
                          className="p-5 space-y-3 cursor-pointer hover:bg-slate-50/50 transition-colors"
                          title="ចុចដើម្បីពង្រីកមើលទម្រង់ A4 ពេញលេញ"
                        >
                          {/* Formal MoEYS Title in Red */}
                          <div className="text-center border-b border-slate-100 pb-2">
                            <p className="text-[10px] font-moul text-blue-800">ព្រះរាជាណាចក្រកម្ពុជា • ជាតិ សាសនា ព្រះមហាក្សត្រ</p>
                            <h3 className="text-sm font-moul text-red-600 mt-0.5">
                              កិច្ចតែងការបង្រៀន
                            </h3>
                            <h4 className="text-sm font-black text-slate-900 font-kantumruy mt-1 text-left line-clamp-1 group-hover:text-amber-700 transition-colors">
                              {preset.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 font-khmer text-left mt-0.5">
                              ជំពូកទី {preset.plan.chapter}៖ {preset.plan.chapterTitle} • មេរៀនទី {preset.plan.lesson}
                            </p>
                          </div>

                          {/* 1. Objectives in paper format */}
                          <div className="text-[11px] font-khmer space-y-1 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
                            <p className="font-bold text-emerald-900">១. វត្ថុបំណងមេរៀន៖</p>
                            <p className="text-slate-700 line-clamp-2">
                              • <strong>វិជ្ជាសម្បទា៖</strong> {preset.plan.objectives?.knowledge}
                            </p>
                            {preset.plan.objectives?.skills && (
                              <p className="text-slate-600 line-clamp-1 text-[10.5px]">
                                • <strong>បំណិនសម្បទា៖</strong> {preset.plan.objectives?.skills}
                              </p>
                            )}
                          </div>

                          {/* 2. Process Preview / 5 Steps preview */}
                          <div className="space-y-1 text-[11px] font-khmer">
                            <div className="flex items-center justify-between text-slate-700 font-bold pb-1 border-b border-slate-100">
                              <span>២. ដំណើរការបង្រៀន (៥ ជំហាន)</span>
                              <span className="text-[10.5px] text-indigo-700 font-normal">{preset.plan.teachingMethods || 'ម៉ូដែល 5E'}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-1 text-[10px] text-center pt-1">
                              <span className="bg-slate-100 py-1 rounded border border-slate-200">ជំហាន១: រដ្ឋបាល</span>
                              <span className="bg-slate-100 py-1 rounded border border-slate-200">ជំហាន២: រំឭកចាស់</span>
                              <span className="bg-blue-50 text-blue-900 font-bold py-1 rounded border border-blue-200">ជំហាន៣: 5E មេរៀនថ្មី</span>
                            </div>
                            <div className="grid grid-cols-2 gap-1 text-[10px] text-center pt-1">
                              <span className="bg-emerald-50 text-emerald-900 font-bold py-1 rounded border border-emerald-200 truncate px-1">
                                ជំហាន៤: {preset.plan.educationalGame ? preset.plan.educationalGame : 'ពង្រឹងពុទ្ធិ'}
                              </span>
                              <span className="bg-slate-100 py-1 rounded border border-slate-200">ជំហាន៥: បណ្តាំផ្ញើ</span>
                            </div>
                          </div>
                        </div>

                        {/* A4 Sheet Footer with 3 action buttons */}
                        <div className="bg-slate-50 border-t border-slate-200/90 p-3 grid grid-cols-3 gap-2 font-khmer">
                          {/* 1. View Full A4 */}
                          <button
                            type="button"
                            onClick={() => setPreviewPreset(preset)}
                            className="py-2 px-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer shadow-2xs"
                          >
                            <Eye className="w-3.5 h-3.5 text-blue-600" />
                            <span>មើល A4 ធំ</span>
                          </button>

                          {/* 2. Select this plan */}
                          <button
                            type="button"
                            onClick={() => {
                              onSelectPreset(preset.id);
                              onClose();
                            }}
                            className="py-2 px-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1 shadow-xs transition-all active:scale-95 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>យកគំរូនេះ</span>
                          </button>

                          {/* 3. Generate AI */}
                          <button
                            type="button"
                            onClick={() => {
                              onSelectAndGenerateAI(preset.id);
                              onClose();
                            }}
                            disabled={isGenerating}
                            className="py-2 px-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                            <span>បង្កើត AI</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Custom Topic Generator */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-4 sm:p-5 font-khmer space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-800">
                      បង្កើតកិច្ចតែងការថ្មីលើប្រធានបទផ្សេងទៀតដោយ AI
                    </h4>
                    <p className="text-xs text-slate-500">
                      បញ្ចូលចំណងជើងមេរៀនដែលលោកអ្នកចង់បង្រៀនសម្រាប់ {selectedGrade !== 'all' ? `ថ្នាក់ទី ${selectedGrade}` : `ថ្នាក់ទី ${currentGrade}`} មុខវិជ្ជា {selectedSubject !== 'គ្រប់មុខវិជ្ជា' ? selectedSubject : currentSubject}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={customTopic}
                    onChange={e => setCustomTopic(e.target.value)}
                    placeholder="ឧទាហរណ៍៖ ការបូកលេខមានត្រីត្រាង, វដ្តជីវិតមេអំបៅ, រឿងទន្សាយនិងអណ្តើក..."
                    className="flex-1 px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs font-khmer text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customTopic.trim()) {
                        const gradeToUse = selectedGrade !== 'all' ? selectedGrade : currentGrade;
                        const subToUse = selectedSubject !== 'គ្រប់មុខវិជ្ជា' ? selectedSubject : currentSubject;
                        onGenerateCustomAI(gradeToUse, subToUse, customTopic.trim());
                        onClose();
                      }
                    }}
                    disabled={!customTopic.trim() || isGenerating}
                    className="px-5 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 text-white rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                    <span>បង្កើតកិច្ចតែងការថ្មី</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-slate-200 flex items-center justify-between shrink-0 font-khmer">
          <p className="text-xs text-slate-500 hidden sm:block">
            * ទម្រង់ក្រដាសកិច្ចតែងការ A4 ទាំងអស់ត្រូវបានរៀបចំឡើងតាមក្បួនខ្នាតគរុកោសល្យ និងកម្មវិធីសិក្សាជាតិរបស់ក្រសួងអប់រំ
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-all cursor-pointer ml-auto"
          >
            បិទផ្ទាំង
          </button>
        </div>
      </motion.div>
    </div>
  );
}
