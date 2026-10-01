import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  Gamepad2, 
  List,
  Download,
  Search,
  Zap,
  Play
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { educationalGamesListData, EducationalGameInfo } from '../data/educationalGamesList';
import GamePlayModal from './GamePlayModal';

export default function EducationalGamesView({ onBack }: { onBack: () => void }) {
  const handleExportExcel = () => {
    const worksheetData = educationalGamesListData.map(game => ({
      'ល.រ': game.id,
      'ឈ្មោះល្បែង': game.title,
      'របៀបលេង': game.howToPlay,
      'លក្ខខណ្ឌ': game.condition,
      'លទ្ធផលទទួលបាន': game.result
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    
    // Set column widths for A4-ish format
    worksheet['!cols'] = [
      { wch: 5 },   // ល.រ
      { wch: 25 },  // ឈ្មោះល្បែង
      { wch: 50 },  // របៀបលេង
      { wch: 35 },  // លក្ខខណ្ឌ
      { wch: 35 }   // លទ្ធផល
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Games');
    
    XLSX.writeFile(workbook, 'បញ្ជីល្បែងសិក្សា_A4.xlsx');
  };

  const [selectedGamePlay, setSelectedGamePlay] = useState<EducationalGameInfo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-[2rem] p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex items-center gap-4 z-10">
          <button
            onClick={onBack}
            className="w-12 h-12 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center transition-all shrink-0"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                ផ្នែកផែនការ និងការបង្រៀន
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black font-moul mt-2 tracking-wide flex items-center gap-3">
              <Gamepad2 className="w-8 h-8" /> ដំណើរការល្បែងទាំង ៥៨
            </h1>
            <p className="text-orange-100 text-sm mt-1 font-kantumruy">
              បង្កើតបរិយាកាសរីករាយ និងជំរុញការចូលរួមរបស់សិស្សក្នុងថ្នាក់រៀន
            </p>
          </div>
        </div>

        {/* Counter Badge */}
        <div className="flex items-center gap-3 z-10">
          <div className="bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-2xl text-xs font-black text-white flex items-center gap-2 shadow-inner">
            <Gamepad2 className="w-4 h-4" /> សរុប ៥៨ ល្បែង
          </div>
        </div>
      </div>

      {/* Main Content: 58 Educational Games */}
      <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-xl border border-slate-100 w-full mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center shadow-inner shrink-0">
              <List className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black font-kantumruy text-slate-800">បញ្ជីល្បែងសិក្សាទាំង ៥៨</h2>
              <p className="text-slate-500 text-sm mt-1">ជ្រើសរើសល្បែងណាមួយដើម្បី <strong className="text-orange-600">ដំណើរការលេងផ្ទាល់</strong> ក្នុងថ្នាក់រៀន</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ស្វែងរកឈ្មោះល្បែង..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:border-orange-500 w-52"
              />
            </div>
            <button
              onClick={handleExportExcel}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4" /> ទាញយកជា Excel (A4)
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {educationalGamesListData
            .filter(game => 
              searchTerm.trim() === '' || 
              game.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
              game.howToPlay.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((game) => (
            <div key={game.id} className="flex flex-col justify-between gap-4 p-5 rounded-3xl hover:bg-orange-50/40 transition-all border border-slate-200 hover:border-orange-300 bg-slate-50/30 group">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-lg font-black font-kantumruy text-orange-700 group-hover:text-orange-600 transition-colors">
                    {game.title}
                  </h3>
                  <button
                    onClick={() => setSelectedGamePlay(game)}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 flex items-center gap-1.5 transition active:scale-95 shrink-0"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> លេងល្បែងនេះ
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1 font-kantumruy">របៀបលេង</span>
                    <p className="text-sm text-slate-700 leading-relaxed font-khmer">{game.howToPlay}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1 font-kantumruy">លក្ខខណ្ឌ</span>
                    <p className="text-sm text-slate-600 leading-relaxed font-khmer">{game.condition}</p>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100/80">
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1 font-kantumruy">លទ្ធផល</span>
                    <p className="text-sm text-emerald-800 leading-relaxed font-khmer font-medium">{game.result}</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400">ល្បែងទី {game.id} នៃ ៥៨</span>
                <button
                  onClick={() => setSelectedGamePlay(game)}
                  className="text-xs font-black text-orange-600 hover:text-orange-700 flex items-center gap-1 font-kantumruy"
                >
                  <Zap className="w-3.5 h-3.5" /> បើកដំណើរការលេង & ដាក់ពិន្ទុ &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Game Play Modal */}
      <AnimatePresence>
        {selectedGamePlay && (
          <GamePlayModal
            game={selectedGamePlay}
            onClose={() => setSelectedGamePlay(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
