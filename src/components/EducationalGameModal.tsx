import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Gamepad2, 
  Sparkles, 
  Check, 
  BookOpen, 
  Target, 
  Award, 
  Layers, 
  Filter, 
  Search,
  CheckCircle2,
  Info
} from 'lucide-react';
import { Grade } from '../types';
import { PRIMARY_EDUCATIONAL_GAMES, EducationalGame, analyzeAndRecommendGame } from '../data/educationalGames';

interface EducationalGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGrade: Grade;
  currentSubject: string;
  currentMethodology?: string;
  currentStrategy?: string;
  selectedGameName?: string;
  onSelectGame: (game: EducationalGame) => void;
  onAIAnalyzeGame: () => void;
  isAnalyzingAI?: boolean;
}

export default function EducationalGameModal({
  isOpen,
  onClose,
  currentGrade,
  currentSubject,
  currentMethodology,
  currentStrategy,
  selectedGameName,
  onSelectGame,
  onAIAnalyzeGame,
  isAnalyzingAI = false
}: EducationalGameModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGrade, setFilterGrade] = useState<number | 'all'>(currentGrade);

  if (!isOpen) return null;

  // Recommended game based on current teaching methods and strategies
  const recommendedGame = analyzeAndRecommendGame(
    currentMethodology,
    currentStrategy,
    currentGrade,
    currentSubject
  );

  const filteredGames = PRIMARY_EDUCATIONAL_GAMES.filter(game => {
    const matchesSearch = 
      game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.pedagogicalPurpose.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesGrade = filterGrade === 'all' || game.grades.includes(filterGrade as Grade);

    return matchesSearch && matchesGrade;
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 p-6 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/20 shadow-inner">
                <Gamepad2 className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-moul tracking-wide flex items-center gap-2">
                  បណ្ណាល័យល្បែងសិក្សា (ជំហានទី៤)
                </h3>
                <p className="text-xs text-emerald-100 font-khmer mt-1">
                  វិភាគស្របតាមវិធីសាស្ត្រ និងយុទ្ធវិធីបង្រៀនសម្រាប់ថ្នាក់ទី១ ដល់ទី៦
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* AI Recommendation Banner */}
          <div className="bg-amber-50 border-b border-amber-200 p-4 shrink-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-amber-900 font-khmer flex items-center gap-1.5">
                  <span>ល្បែងដែលត្រូវគ្នានឹងវិធីសាស្ត្រ និងយុទ្ធវិធីបច្ចុប្បន្ន៖</span>
                  <span className="text-emerald-700 underline font-black">{recommendedGame.name}</span>
                </div>
                <p className="text-[11px] text-amber-800 font-khmer mt-0.5">
                  វិធីសាស្ត្រ៖ {currentMethodology || 'ម៉ូដែល 5E'} | យុទ្ធវិធី៖ {currentStrategy || 'ការអនុវត្តផ្ទាល់'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              <button
                onClick={() => {
                  onSelectGame(recommendedGame);
                  onClose();
                }}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold font-khmer flex items-center gap-1 shadow-sm transition-all"
              >
                <Check className="w-3.5 h-3.5" /> ជ្រើសរើសល្បែងនេះ
              </button>
              <button
                onClick={onAIAnalyzeGame}
                disabled={isAnalyzingAI}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold font-khmer flex items-center gap-1 shadow-sm transition-all"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isAnalyzingAI ? 'animate-spin' : ''}`} />
                {isAnalyzingAI ? 'កំពុងវិភាគ...' : 'AI វិភាគលម្អិត'}
              </button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between shrink-0">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ស្វែងរកឈ្មោះល្បែង ឬគោលបំណង..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-khmer focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Grade Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar pb-1 sm:pb-0">
              <span className="text-xs text-slate-500 font-bold font-khmer shrink-0 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> ថ្នាក់៖
              </span>
              <button
                onClick={() => setFilterGrade('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold font-khmer transition-colors shrink-0 ${
                  filterGrade === 'all'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                ទាំងអស់
              </button>
              {[1, 2, 3, 4, 5, 6].map(g => (
                <button
                  key={g}
                  onClick={() => setFilterGrade(g)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold font-khmer transition-colors shrink-0 ${
                    filterGrade === g
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  ថ្នាក់ទី {g}
                </button>
              ))}
            </div>
          </div>

          {/* Games List */}
          <div className="p-6 overflow-y-auto space-y-4 flex-grow">
            {filteredGames.length === 0 ? (
              <div className="text-center py-12 text-slate-400 font-khmer">
                <Info className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p>មិនមានល្បែងដែលត្រូវនឹងការស្វែងរកនេះទេ។</p>
              </div>
            ) : (
              filteredGames.map((game) => {
                const isCurrent = selectedGameName?.includes(game.name) || game.name.includes(selectedGameName || '___none___');
                const isRecommended = recommendedGame.id === game.id;

                return (
                  <div
                    key={game.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      isCurrent
                        ? 'border-emerald-500 bg-emerald-50/40 shadow-md ring-2 ring-emerald-500/20'
                        : isRecommended
                        ? 'border-amber-300 bg-amber-50/20 hover:border-amber-400'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h4 className="text-base font-bold text-slate-800 font-moul">
                            {game.name}
                          </h4>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold font-khmer flex items-center gap-1 border border-emerald-300">
                              <CheckCircle2 className="w-3 h-3" /> កំពុងជ្រើសរើស
                            </span>
                          )}
                          {isRecommended && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold font-khmer flex items-center gap-1 border border-amber-300">
                              <Sparkles className="w-3 h-3" /> ស័ក្តិសមបំផុត
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 font-sans italic">
                          {game.englishName}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          onSelectGame(game);
                          onClose();
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold font-khmer flex items-center gap-1.5 shrink-0 transition-all ${
                          isCurrent
                            ? 'bg-emerald-700 text-white cursor-default'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow active:scale-95'
                        }`}
                      >
                        <Check className="w-4 h-4" />
                        {isCurrent ? 'បានជ្រើសរួច' : 'ជ្រើសរើសល្បែងនេះ'}
                      </button>
                    </div>

                    <p className="text-xs text-slate-700 font-khmer leading-relaxed mb-3">
                      {game.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs font-khmer">
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="font-bold text-slate-700 flex items-center gap-1 mb-1">
                          <Target className="w-3.5 h-3.5 text-blue-600" /> គោលបំណងគរុកោសល្យ៖
                        </span>
                        <p className="text-slate-600 leading-relaxed text-[11.5px]">
                          {game.pedagogicalPurpose}
                        </p>
                      </div>

                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="font-bold text-slate-700 flex items-center gap-1 mb-1">
                          <Layers className="w-3.5 h-3.5 text-indigo-600" /> របៀបលេង (Rules)៖
                        </span>
                        <p className="text-slate-600 leading-relaxed text-[11.5px]">
                          {game.rules}
                        </p>
                      </div>
                    </div>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2 text-[11px] font-khmer">
                      <span className="text-slate-400 font-medium">កម្រិតថ្នាក់៖</span>
                      {game.grades.map(g => (
                        <span key={g} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                          ថ្នាក់ទី {g}
                        </span>
                      ))}
                      <span className="text-slate-300 mx-1">|</span>
                      <span className="text-slate-400 font-medium">ត្រូវគ្នានឹង៖</span>
                      {game.suitedMethods.slice(0, 2).map((m, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100 font-medium">
                          {m.split('(')[0].trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
            <p className="text-xs text-slate-500 font-khmer">
              សរុប {filteredGames.length} ល្បែងសិក្សាសម្រាប់បឋមសិក្សា (ថ្នាក់ទី១ ដល់ទី៦)
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold font-khmer transition-colors"
            >
              បិទ
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
