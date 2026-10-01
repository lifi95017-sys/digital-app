import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  RotateCcw, 
  Timer, 
  CheckCircle2, 
  XCircle, 
  Play, 
  Sparkles, 
  ChevronRight,
  ArrowLeft,
  Users,
  Volume2,
  Award,
  HelpCircle,
  Zap,
  Flame
} from 'lucide-react';
import { EducationalGameInfo } from '../data/educationalGamesList';
import { getGameConfig, GameInteractiveType } from '../data/interactiveGamesConfig';

interface Props {
  game: EducationalGameInfo;
  onClose: () => void;
}

export default function GamePlayModal({ game, onClose }: Props) {
  const config = getGameConfig(game.id);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  // --- Sub-game specific state ---

  // 1. Synonym Matcher (Game 1, 14, 50)
  const synonymQuestions = [
    { word: 'រៀនសូត្រ', correct: 'សិក្សា', options: ['លេងកម្សាន្ត', 'សិក្សា', 'ធ្វើការ', 'ដេកលក់'] },
    { word: 'មហាសមុទ្រ', correct: 'សាគរ', options: ['ភ្នំធំ', 'សាគរ', 'ព្រៃស្ដុក', 'វាលខ្សាច់'] },
    { word: 'ព្រះអាទិត្យ', correct: 'សូរិយា', options: ['ចន្ទ្រា', 'សូរិយា', 'តារា', 'ពពក'] },
    { word: 'បណ្ឌិត', correct: 'អ្នកប្រាជ្ញ', options: ['អ្នកជំនួញ', 'អ្នកចម្បាំង', 'អ្នកប្រាជ្ញ', 'កសិករ'] },
    { word: 'មិត្តភក្តិ', correct: 'សម្លាញ់', options: ['សត្រូវ', 'សម្លាញ់', 'មនុស្សចម្លែក', 'សាច់ញាតិ'] }
  ];
  const [synonymIdx, setSynonymIdx] = useState(0);

  // 2. Word Builder (Game 2)
  const wordBuilderLevels = [
    { target: 'សាលារៀន', letters: ['សា', 'លា', 'រៀន', 'កា'], fullWord: 'សាលារៀន' },
    { target: 'កម្ពុជា', letters: ['កម្ពុ', 'ជា', 'ណា', 'ដី'], fullWord: 'កម្ពុជា' },
    { target: 'ចំណេះដឹង', letters: ['ចំ', 'ណេះ', 'ដឹង', 'រៀន'], fullWord: 'ចំណេះដឹង' },
    { target: 'គ្រូបង្រៀន', letters: ['គ្រូ', 'បង្រៀន', 'សិស្ស', 'សាលា'], fullWord: 'គ្រូបង្រៀន' },
  ];
  const [wordIdx, setWordIdx] = useState(0);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);

  // 3. Number Finder (Game 3)
  const numberFinderRounds = [
    { rule: 'ជ្រើសរើសលេខគូ (Even Numbers)', targetValues: [2, 4, 8, 12, 16], options: [2, 3, 5, 8, 9, 12, 15, 17] },
    { rule: 'ជ្រើសរើសលេខធំជាង ១០', targetValues: [12, 15, 20, 25], options: [4, 7, 12, 9, 15, 8, 20, 5] },
    { rule: 'ជ្រើសរើសលេខចែកដាច់នឹង ៥', targetValues: [5, 10, 15, 25], options: [5, 8, 10, 14, 15, 18, 25, 22] }
  ];
  const [numFinderIdx, setNumFinderIdx] = useState(0);
  const [pickedNumbers, setPickedNumbers] = useState<number[]>([]);

  // 4. Math Challenge (Game 4, 28, 30, 36)
  const mathQuestions = [
    { question: '២៥ + ៣៧ = ?', options: ['៥២', '៦២', '៦០', '៦៣'], correct: 1 },
    { question: '៨ × ៧ = ?', options: ['៥៤', '៥៦', '៦៤', '៤៨'], correct: 1 },
    { question: '១០០ - ៤៥ = ?', options: ['៥៥', '៦៥', '៤៥', '៥០'], correct: 0 },
    { question: '៧២ ÷ ៩ = ?', options: ['៧', '៨', '៩', '៦'], correct: 1 },
    { question: '១៥ × ៤ = ?', options: ['៥០', '៦០', '៧០', '៤៥'], correct: 1 }
  ];
  const [mathIdx, setMathIdx] = useState(0);

  // 5. Math Gravity / Chain (Game 5)
  const chainSteps = [
    { prompt: 'ចាប់ផ្តើមពីលេខ ៥៖ បូក ៧', expected: 12, options: [10, 12, 14, 15] },
    { prompt: 'បន្តពី ១២៖ គុណនឹង ៣', expected: 36, options: [32, 36, 40, 24] },
    { prompt: 'បន្តពី ៣៦៖ ដក ៦', expected: 30, options: [28, 30, 32, 20] },
    { prompt: 'បន្តពី ៣០៖ ចែកនឹង ៥', expected: 6, options: [5, 6, 7, 4] }
  ];
  const [chainIdx, setChainIdx] = useState(0);

  // 6. Board Slap (Game 6)
  const boardSlapQuestions = [
    { q: 'តើត្រីដកដង្ហើមតាមអ្វី?', options: ['សួត', 'ស្រកី', 'ស្បែក', 'ច្រមុះ'], correct: 'ស្រកី' },
    { q: 'តើទង់ជាតិកម្ពុជាមានប៉ុន្មានពណ៌?', options: ['២ពណ៌', '៣ពណ៌', '៤ពណ៌', '៥ពណ៌'], correct: '៣ពណ៌' },
    { q: 'តើ ៩ × ៦ ស្មើនឹងប៉ុន្មាន?', options: ['៤៥', '៥៤', '៦៣', '៥២'], correct: '៥៤' },
    { q: 'តើប្រទេសកម្ពុជាមានប៉ុន្មានរាជធានី-ខេត្ត?', options: ['២៤', '២៥', '២៦', '២៣'], correct: '២៥' }
  ];
  const [boardIdx, setBoardIdx] = useState(0);

  // 7. Memory Card (Game 7, 27)
  const initialCards = [
    { id: 1, val: 'ព្រះអាទិត្យ', matchId: 1, flipped: false, matched: false },
    { id: 2, val: '☀️', matchId: 1, flipped: false, matched: false },
    { id: 3, val: 'សៀវភៅ', matchId: 2, flipped: false, matched: false },
    { id: 4, val: '📖', matchId: 2, flipped: false, matched: false },
    { id: 5, val: 'ផ្កាឈូក', matchId: 3, flipped: false, matched: false },
    { id: 6, val: '🪷', matchId: 3, flipped: false, matched: false },
    { id: 7, val: 'ដើមឈើ', matchId: 4, flipped: false, matched: false },
    { id: 8, val: '🌳', matchId: 4, flipped: false, matched: false },
  ];
  const [cards, setCards] = useState(initialCards.sort(() => Math.random() - 0.5));
  const [flippedCards, setFlippedCards] = useState<number[]>([]);

  // 8. Hangman (Game 8)
  const hangmanWords = ['សាលារៀន', 'កម្ពុជា', 'អបអរ', 'មិត្តភាព', 'គណិតវិទ្យា'];
  const [hangmanTarget, setHangmanTarget] = useState(hangmanWords[0]);
  const [guessedChars, setGuessedChars] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);

  // 9. Sentence Order (Game 9, 43)
  const sentenceRounds = [
    {
      pieces: ['ពេលព្រឹកព្រលឹម', 'សិស្សានុសិស្ស', 'ដើរទៅសាលារៀន', 'ដោយទឹកមុខរីករាយ'],
      correctOrder: ['ពេលព្រឹកព្រលឹម', 'សិស្សានុសិស្ស', 'ដើរទៅសាលារៀន', 'ដោយទឹកមុខរីករាយ']
    },
    {
      pieces: ['សិស្សត្រូវ', 'ខិតខំរៀនសូត្រ', 'ដើម្បីក្លាយជា', 'ទំពាំងស្នងឫស្សី'],
      correctOrder: ['សិស្សត្រូវ', 'ខិតខំរៀនសូត្រ', 'ដើម្បីក្លាយជា', 'ទំពាំងស្នងឫស្សី']
    }
  ];
  const [sentenceIdx, setSentenceIdx] = useState(0);
  const [userOrderedPieces, setUserOrderedPieces] = useState<string[]>([]);

  // 10. Puzzle Jigsaw (Game 10)
  const [puzzleTiles, setPuzzleTiles] = useState(['៣', '១', '៤', '២']);

  // 16. Odd One Out (Game 16)
  const oddRounds = [
    { q: 'តើមួយណាខុសគេ?', items: ['មាន់', 'ទា', 'ក្ងាន', 'ត្រីបាឡែន'], odd: 'ត្រីបាឡែន', reason: 'ត្រីបាឡែនរស់ក្នុងទឹក ឯសត្វឯទៀតជាសត្វស្លាប' },
    { q: 'តើមួយណាខុសគេ?', items: ['ស្វាយ', 'ចេក', 'ការ៉ុត', 'ក្រូច'], odd: 'ការ៉ុត', reason: 'ការ៉ុតជាបន្លែមើម ឯឯទៀតជាផ្លែឈើ' },
    { q: 'តើមួយណាខុសគេ?', items: ['៤', '៨', '១២', '១៥'], odd: '១៥', reason: '១៥ ជាលេខសេស ឯឯទៀតជាលេខគូ' }
  ];
  const [oddIdx, setOddIdx] = useState(0);

  // 18. Banana Game (Game 18)
  const bananaRounds = [
    { prompt: 'រៀងរាល់ព្រឹក សិស្សានុសិស្សតែងតែជិះកង់ទៅ [ផ្លែចេក]។', options: ['ផ្សារ', 'សាលារៀន', 'មន្ទីរពេទ្យ', 'វាលស្រែ'], correct: 'សាលារៀន' },
    { prompt: 'ព្រះអាទិត្យរះនៅទិស [ផ្លែចេក] និងលិចនៅទិសខាងលិច។', options: ['ខាងកើត', 'ខាងជើង', 'ខាងត្បូង', 'កណ្តាល'], correct: 'ខាងកើត' },
    { prompt: 'យើងត្រូវតែ [ផ្លែចេក] ដៃជាមួយសាប៊ូមុនពេលញ៉ាំអាហារ។', options: ['លុប', 'លាង', 'កាត់', 'ចង'], correct: 'លាង' }
  ];
  const [bananaIdx, setBananaIdx] = useState(0);

  // 20. Fruit Market (Game 20)
  const fruitOrders = [
    { item: 'ផ្លែប៉ោម ៣ ផ្លែ (១ផ្លែ ២០០០៛)', cost: 6000, paid: 10000, options: [3000, 4000, 5000, 2000], correct: 4000 },
    { item: 'ផ្លែក្រូច ៥ ផ្លែ (១ផ្លែ ១០០០៛)', cost: 5000, paid: 10000, options: [5000, 4000, 6000, 3000], correct: 5000 },
    { item: 'ផ្លែចេក ១ស្និត (៤០០០៛)', cost: 4000, paid: 5000, options: [2000, 1000, 1500, 500], correct: 1000 }
  ];
  const [marketIdx, setMarketIdx] = useState(0);

  // 31. Traffic Light (Game 31)
  const [trafficColor, setTrafficColor] = useState<'green' | 'red' | 'yellow'>('green');
  const [trafficMessage, setTrafficMessage] = useState('ភ្លើងបៃតង៖ ចុចប៊ូតុង "ទៅមុខ"!');

  // 41/55. True/False (Game 41, 55)
  const tfQuestions = [
    { q: 'ភ្នំពេញ ជារាជធានីនៃប្រទេសកម្ពុជា។', isTrue: true },
    { q: '៧ + ៨ = ១៦', isTrue: false },
    { q: 'ទឹកបង្កកជាទឹកកកនៅសីតុណ្ហភាព ០°C។', isTrue: true },
    { q: 'មួយសប្តាហ៍មាន ៨ ថ្ងៃ។', isTrue: false },
    { q: 'ភាសាខ្មែរមានព្យញ្ជនៈ ៣៣ តួ។', isTrue: true }
  ];
  const [tfIdx, setTfIdx] = useState(0);

  // 58. Secret Code (Game 58)
  const [codeIdx, setCodeIdx] = useState(0);
  const codePuzzles = [
    { cipher: '១-២-៣', legend: '១=សា, ២=លា, ៣=រៀន', answer: 'សាលារៀន', options: ['សាលារៀន', 'សាលាឃុំ', 'រៀនសូត្រ', 'កម្ពុជា'] },
    { cipher: '៤-៥', legend: '៤=កម្ពុ, ៥=ជា', answer: 'កម្ពុជា', options: ['កម្ពុជា', 'ប្រទេស', 'ជាតិយើង', 'ទឹកដី'] }
  ];

  // Classroom Timer Engine (for timer-based games)
  useEffect(() => {
    let interval: any;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(s => s - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      setIsGameOver(true);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const triggerFeedback = (isCorrect: boolean) => {
    if (isCorrect) {
      setFeedback('correct');
      setScore(s => s + 10);
    } else {
      setFeedback('wrong');
    }
    setTimeout(() => {
      setFeedback(null);
    }, 700);
  };

  const handleRestart = () => {
    setScore(0);
    setRound(1);
    setIsGameOver(false);
    setTimerSeconds(60);
    setIsTimerRunning(false);
    setSynonymIdx(0);
    setWordIdx(0);
    setSelectedLetters([]);
    setPickedNumbers([]);
    setMathIdx(0);
    setChainIdx(0);
    setBoardIdx(0);
    setCards(initialCards.sort(() => Math.random() - 0.5).map(c => ({ ...c, flipped: false, matched: false })));
    setFlippedCards([]);
    setOddIdx(0);
    setBananaIdx(0);
    setMarketIdx(0);
    setTfIdx(0);
    setCodeIdx(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col my-auto max-h-[95vh]"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 p-6 sm:p-8 text-white flex items-center justify-between relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center gap-4 z-10">
            <button
              onClick={onClose}
              className="w-11 h-11 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center transition-all shrink-0 active:scale-95"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                  ល្បែងសិក្សាទី {game.id}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/80 text-xs font-bold text-white flex items-center gap-1">
                  <Zap className="w-3 h-3" /> ដំណើរការលេងផ្ទាល់
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-moul mt-1.5 flex items-center gap-2 drop-shadow-sm">
                {game.title}
              </h2>
            </div>
          </div>

          {/* Score & Controls */}
          <div className="flex items-center gap-3 z-10">
            <div className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-right">
              <span className="text-[11px] font-bold text-orange-200 block uppercase">ពិន្ទុសរុប</span>
              <span className="text-2xl font-black font-mono text-white flex items-center gap-1.5 justify-end">
                <Trophy className="w-5 h-5 text-amber-300 fill-amber-300" /> {score}
              </span>
            </div>
          </div>
        </div>

        {/* Instructions banner */}
        <div className="bg-orange-50/80 border-b border-orange-100 px-6 py-3 flex items-center justify-between gap-4 text-xs font-bold text-orange-800 shrink-0">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-orange-500 shrink-0" />
            <span>{config.instructions}</span>
          </div>
          <button 
            onClick={handleRestart}
            className="flex items-center gap-1 text-slate-500 hover:text-orange-600 transition-colors shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" /> លេងឡើងវិញ
          </button>
        </div>

        {/* Modal Body / Playground Area */}
        <div className="p-6 sm:p-10 overflow-y-auto flex-1 flex flex-col justify-center items-center relative">
          
          {/* Feedback Overlay Flash */}
          <AnimatePresence>
            {feedback === 'correct' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-emerald-500/20 backdrop-blur-xs flex items-center justify-center z-20 pointer-events-none"
              >
                <div className="bg-emerald-600 text-white px-8 py-4 rounded-3xl font-black font-kantumruy text-2xl shadow-2xl flex items-center gap-3 animate-bounce">
                  <CheckCircle2 className="w-8 h-8" /> ត្រឹមត្រូវ! +១០ ពិន្ទុ
                </div>
              </motion.div>
            )}
            {feedback === 'wrong' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-rose-500/20 backdrop-blur-xs flex items-center justify-center z-20 pointer-events-none"
              >
                <div className="bg-rose-600 text-white px-8 py-4 rounded-3xl font-black font-kantumruy text-2xl shadow-2xl flex items-center gap-3">
                  <XCircle className="w-8 h-8" /> មិនទាន់ត្រឹមត្រូវទេ!
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Game Over Screen */}
          {isGameOver ? (
            <div className="text-center py-8 space-y-6 max-w-md mx-auto">
              <div className="w-24 h-24 bg-amber-100 text-amber-500 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                <Award className="w-14 h-14" />
              </div>
              <div>
                <h3 className="text-2xl font-black font-moul text-slate-800">អបអរសាទរ! បញ្ចប់ការលេង</h3>
                <p className="text-slate-500 text-sm mt-1">អ្នកទទួលបានពិន្ទុប្រកួតសរុប</p>
                <p className="text-5xl font-black font-mono text-orange-600 mt-2">{score} ពិន្ទុ</p>
              </div>
              <div className="flex justify-center gap-4 pt-2">
                <button
                  onClick={handleRestart}
                  className="px-8 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/20 hover:from-orange-600 hover:to-amber-600 transition flex items-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" /> លេងម្តងទៀត
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition"
                >
                  ចាកចេញ
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-2xl">
              
              {/* GAME TYPE: SYNONYM (1, 14, 50) */}
              {config.type === 'synonym' && (
                <div className="space-y-6 text-center">
                  <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-8 shadow-inner">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2 font-kantumruy">
                      ស្វែងរកពាក្យវេវចនសព្ទ (ន័យដូច) នឹង៖
                    </span>
                    <h3 className="text-4xl font-black font-moul text-orange-600">
                      «{synonymQuestions[synonymIdx].word}»
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {synonymQuestions[synonymIdx].options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          const isMatch = opt === synonymQuestions[synonymIdx].correct;
                          triggerFeedback(isMatch);
                          if (synonymIdx < synonymQuestions.length - 1) {
                            setSynonymIdx(i => i + 1);
                          } else {
                            setIsGameOver(true);
                          }
                        }}
                        className="p-5 bg-white border-2 border-slate-200 hover:border-orange-500 hover:bg-orange-50/50 rounded-2xl font-bold font-kantumruy text-lg text-slate-800 transition active:scale-95 shadow-sm hover:shadow"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* GAME TYPE: WORD BUILDER (2) */}
              {config.type === 'word-builder' && (
                <div className="space-y-6 text-center">
                  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2 font-kantumruy">
                      ផ្គុំបណ្ណអក្សរឱ្យចេញជាពាក្យ៖
                    </span>
                    <div className="min-h-16 flex items-center justify-center gap-2 flex-wrap bg-white p-4 rounded-2xl border-2 border-dashed border-orange-300">
                      {selectedLetters.length === 0 ? (
                        <span className="text-slate-400 font-bold text-sm">ចុចលើបណ្ណអក្សរខាងក្រោមដើម្បីផ្គុំ</span>
                      ) : (
                        selectedLetters.map((l, idx) => (
                          <span key={idx} className="px-4 py-2 bg-orange-500 text-white font-black text-xl rounded-xl shadow">
                            {l}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="flex justify-center gap-3 flex-wrap">
                    {wordBuilderLevels[wordIdx].letters.map((letter, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          const nextArr = [...selectedLetters, letter];
                          setSelectedLetters(nextArr);
                          if (nextArr.join('') === wordBuilderLevels[wordIdx].fullWord) {
                            triggerFeedback(true);
                            setSelectedLetters([]);
                            if (wordIdx < wordBuilderLevels.length - 1) {
                              setWordIdx(i => i + 1);
                            } else {
                              setIsGameOver(true);
                            }
                          } else if (nextArr.length >= wordBuilderLevels[wordIdx].letters.length) {
                            triggerFeedback(false);
                            setSelectedLetters([]);
                          }
                        }}
                        className="w-16 h-16 bg-white border-2 border-slate-200 hover:border-orange-500 hover:bg-orange-50 rounded-2xl font-black text-xl text-slate-800 shadow transition active:scale-90 flex items-center justify-center"
                      >
                        {letter}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setSelectedLetters([])}
                    className="text-xs font-bold text-rose-500 hover:underline inline-block mt-2"
                  >
                    លុបការជ្រើសរើសឡើងវិញ
                  </button>
                </div>
              )}

              {/* GAME TYPE: NUMBER FINDER (3) */}
              {config.type === 'number-finder' && (
                <div className="space-y-6 text-center">
                  <div className="bg-purple-50 border border-purple-200 rounded-3xl p-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-600 block mb-1">
                      លក្ខខណ្ឌស្វែងរក (ជុំទី {numFinderIdx + 1})
                    </span>
                    <h3 className="text-2xl font-black text-purple-900 font-kantumruy">
                      {numberFinderRounds[numFinderIdx].rule}
                    </h3>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    {numberFinderRounds[numFinderIdx].options.map((num, idx) => {
                      const isPicked = pickedNumbers.includes(num);
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            if (isPicked) return;
                            const isTarget = numberFinderRounds[numFinderIdx].targetValues.includes(num);
                            triggerFeedback(isTarget);
                            const updated = [...pickedNumbers, num];
                            setPickedNumbers(updated);
                            const remaining = numberFinderRounds[numFinderIdx].targetValues.filter(v => !updated.includes(v));
                            if (remaining.length === 0) {
                              if (numFinderIdx < numberFinderRounds.length - 1) {
                                setNumFinderIdx(i => i + 1);
                                setPickedNumbers([]);
                              } else {
                                setIsGameOver(true);
                              }
                            }
                          }}
                          className={`h-20 rounded-2xl font-black text-2xl flex items-center justify-center transition shadow border-2 ${
                            isPicked 
                              ? 'bg-purple-600 text-white border-purple-700 opacity-60' 
                              : 'bg-white border-slate-200 hover:border-purple-500 text-slate-800 hover:bg-purple-50 active:scale-95'
                          }`}
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* GAME TYPE: MATH CHALLENGE (4, 28, 30, 36) */}
              {config.type === 'math-challenge' && (
                <div className="space-y-6 text-center">
                  <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-2 font-kantumruy">
                      គណនាលំហាត់ឱ្យបានរហ័ស
                    </span>
                    <h3 className="text-4xl font-black text-amber-900 font-mono">
                      {mathQuestions[mathIdx].question}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {mathQuestions[mathIdx].options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          const isCorrect = idx === mathQuestions[mathIdx].correct;
                          triggerFeedback(isCorrect);
                          if (mathIdx < mathQuestions.length - 1) {
                            setMathIdx(i => i + 1);
                          } else {
                            setIsGameOver(true);
                          }
                        }}
                        className="p-6 bg-white border-2 border-slate-200 hover:border-amber-500 hover:bg-amber-50 rounded-2xl font-black text-2xl text-slate-800 transition active:scale-95 shadow"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* GAME TYPE: MATH GRAVITY / CHAIN (5) */}
              {config.type === 'math-gravity' && (
                <div className="space-y-6 text-center">
                  <div className="bg-rose-50 border border-rose-200 rounded-3xl p-8">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-500 block mb-2 font-kantumruy">
                      សង្វាក់ទំនាញលេខ (ជំហានទី {chainIdx + 1})
                    </span>
                    <h3 className="text-2xl font-black text-rose-900 font-kantumruy">
                      {chainSteps[chainIdx].prompt}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {chainSteps[chainIdx].options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          const isMatch = opt === chainSteps[chainIdx].expected;
                          triggerFeedback(isMatch);
                          if (chainIdx < chainSteps.length - 1) {
                            setChainIdx(i => i + 1);
                          } else {
                            setIsGameOver(true);
                          }
                        }}
                        className="p-6 bg-white border-2 border-slate-200 hover:border-rose-500 hover:bg-rose-50 rounded-2xl font-black text-2xl text-slate-800 shadow transition active:scale-95"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* GAME TYPE: BOARD SLAP (6) */}
              {config.type === 'board-slap' && (
                <div className="space-y-6 text-center">
                  <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl border-4 border-amber-900">
                    <div className="inline-block px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-bold mb-3 uppercase">
                      ក្តារខៀនសិស្ស - ចុចទះលើចម្លើយត្រឹមត្រូវ!
                    </div>
                    <h3 className="text-2xl font-black font-kantumruy text-amber-100">
                      {boardSlapQuestions[boardIdx].q}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {boardSlapQuestions[boardIdx].options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          const isCorrect = opt === boardSlapQuestions[boardIdx].correct;
                          triggerFeedback(isCorrect);
                          if (boardIdx < boardSlapQuestions.length - 1) {
                            setBoardIdx(i => i + 1);
                          } else {
                            setIsGameOver(true);
                          }
                        }}
                        className="p-6 bg-amber-50 border-2 border-amber-300 hover:bg-amber-500 hover:text-white rounded-2xl font-black font-kantumruy text-xl text-slate-800 transition active:scale-90 shadow-md flex items-center justify-center gap-2"
                      >
                        <Zap className="w-5 h-5 text-amber-600 group-hover:text-white" /> {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* GAME TYPE: MEMORY CARD (7, 27) */}
              {config.type === 'memory-card' && (
                <div className="space-y-6 text-center">
                  <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-lg mx-auto">
                    {cards.map((c) => {
                      const isShown = c.flipped || c.matched;
                      return (
                        <button
                          key={c.id}
                          onClick={() => {
                            if (isShown || flippedCards.length >= 2) return;
                            const nextCards = cards.map(item => item.id === c.id ? { ...item, flipped: true } : item);
                            setCards(nextCards);
                            const nextFlipped = [...flippedCards, c.id];
                            setFlippedCards(nextFlipped);

                            if (nextFlipped.length === 2) {
                              const c1 = nextCards.find(item => item.id === nextFlipped[0])!;
                              const c2 = nextCards.find(item => item.id === nextFlipped[1])!;
                              if (c1.matchId === c2.matchId) {
                                triggerFeedback(true);
                                setCards(prev => prev.map(item => (item.id === c1.id || item.id === c2.id) ? { ...item, matched: true } : item));
                                setFlippedCards([]);
                                // check if all matched
                                const unMatched = nextCards.filter(item => !item.matched && item.id !== c1.id && item.id !== c2.id);
                                if (unMatched.length === 0) {
                                  setTimeout(() => setIsGameOver(true), 600);
                                }
                              } else {
                                triggerFeedback(false);
                                setTimeout(() => {
                                  setCards(prev => prev.map(item => (item.id === c1.id || item.id === c2.id) ? { ...item, flipped: false } : item));
                                  setFlippedCards([]);
                                }, 800);
                              }
                            }
                          }}
                          className={`h-24 sm:h-28 rounded-2xl font-black text-base sm:text-lg flex items-center justify-center transition-all duration-300 shadow-md border-2 ${
                            c.matched 
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300 scale-95 opacity-80' 
                              : isShown 
                                ? 'bg-white text-slate-800 border-teal-500 shadow-lg' 
                                : 'bg-gradient-to-br from-teal-500 to-cyan-600 text-white border-teal-600 hover:scale-105 active:scale-95'
                          }`}
                        >
                          {isShown ? c.val : '❓'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* GAME TYPE: HANGMAN (8) */}
              {config.type === 'hangman' && (
                <div className="space-y-6 text-center">
                  <div className="bg-indigo-50 border border-indigo-200 rounded-3xl p-8">
                    <div className="flex justify-between items-center text-xs font-bold text-indigo-600 mb-3">
                      <span>ពាក្យអាថ៌កំបាំង ({hangmanTarget.length} តួ)</span>
                      <span>ទាយខុស៖ {wrongGuesses}/៦</span>
                    </div>
                    <div className="flex justify-center gap-2 flex-wrap">
                      {hangmanTarget.split('').map((char, idx) => {
                        const isRevealed = guessedChars.includes(char);
                        return (
                          <span key={idx} className="w-12 h-14 border-b-4 border-indigo-500 text-2xl font-black text-indigo-900 flex items-center justify-center">
                            {isRevealed ? char : '_'}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Letter keyboard */}
                  <div className="flex flex-wrap gap-2 justify-center max-w-lg mx-auto">
                    {['ក', 'ខ', 'គ', 'ង', 'ច', 'ឆ', 'ជ', 'ញ', 'ដ', 'ឋ', 'ឌ', 'ឍ', 'ណ', 'ត', 'ថ', 'ទ', 'ធ', 'ន', 'ប', 'ផ', 'ព', 'ភ', 'ម', 'យ', 'រ', 'ល', 'វ', 'ស', 'ហ', 'ឡ', 'អ'].map((ch, idx) => {
                      const used = guessedChars.includes(ch);
                      return (
                        <button
                          key={idx}
                          disabled={used}
                          onClick={() => {
                            setGuessedChars(prev => [...prev, ch]);
                            if (hangmanTarget.includes(ch)) {
                              triggerFeedback(true);
                              const allFound = hangmanTarget.split('').every(c => [...guessedChars, ch].includes(c));
                              if (allFound) {
                                setIsGameOver(true);
                              }
                            } else {
                              triggerFeedback(false);
                              const nextWrongs = wrongGuesses + 1;
                              setWrongGuesses(nextWrongs);
                              if (nextWrongs >= 6) {
                                setIsGameOver(true);
                              }
                            }
                          }}
                          className={`w-10 h-10 rounded-xl font-black text-sm flex items-center justify-center border transition ${
                            used 
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' 
                              : 'bg-white hover:bg-indigo-50 hover:border-indigo-400 text-slate-800 border-slate-300 shadow-sm active:scale-90'
                          }`}
                        >
                          {ch}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* GAME TYPE: SENTENCE ORDER (9, 43) */}
              {config.type === 'sentence-order' && (
                <div className="space-y-6 text-center">
                  <div className="bg-cyan-50 border border-cyan-200 rounded-3xl p-6">
                    <span className="text-xs font-bold text-cyan-600 block mb-2 font-kantumruy">ប្រយោគដែលបានរៀប៖</span>
                    <div className="min-h-16 flex items-center justify-center gap-2 flex-wrap bg-white p-4 rounded-2xl border-2 border-dashed border-cyan-300">
                      {userOrderedPieces.length === 0 ? (
                        <span className="text-slate-400 text-sm font-bold">ចុចលើបំណែកខាងក្រោមដើម្បីតម្រៀប</span>
                      ) : (
                        userOrderedPieces.map((p, idx) => (
                          <span key={idx} className="px-3 py-1.5 bg-cyan-600 text-white font-bold rounded-xl text-sm">
                            {p}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center gap-3">
                    {sentenceRounds[sentenceIdx].pieces.map((piece, idx) => {
                      const isUsed = userOrderedPieces.includes(piece);
                      return (
                        <button
                          key={idx}
                          disabled={isUsed}
                          onClick={() => {
                            const nextOrder = [...userOrderedPieces, piece];
                            setUserOrderedPieces(nextOrder);
                            if (nextOrder.length === sentenceRounds[sentenceIdx].pieces.length) {
                              const isCorrect = nextOrder.every((val, i) => val === sentenceRounds[sentenceIdx].correctOrder[i]);
                              triggerFeedback(isCorrect);
                              if (isCorrect) {
                                setUserOrderedPieces([]);
                                if (sentenceIdx < sentenceRounds.length - 1) {
                                  setSentenceIdx(i => i + 1);
                                } else {
                                  setIsGameOver(true);
                                }
                              } else {
                                setUserOrderedPieces([]);
                              }
                            }
                          }}
                          className={`p-4 rounded-2xl border-2 font-bold font-kantumruy text-sm transition ${
                            isUsed 
                              ? 'bg-slate-100 text-slate-400 border-slate-200' 
                              : 'bg-white hover:bg-cyan-50 hover:border-cyan-400 text-slate-800 border-slate-200 shadow-sm active:scale-95'
                          }`}
                        >
                          {piece}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setUserOrderedPieces([])}
                    className="text-xs font-bold text-rose-500 hover:underline inline-block mt-2"
                  >
                    រៀបសារជាថ្មី
                  </button>
                </div>
              )}

              {/* GAME TYPE: ODD ONE OUT (16) */}
              {config.type === 'odd-one-out' && (
                <div className="space-y-6 text-center">
                  <div className="bg-fuchsia-50 border border-fuchsia-200 rounded-3xl p-6">
                    <span className="text-xs font-bold text-fuchsia-600 block mb-1 font-kantumruy">ស្វែងរកពាក្យខុសគេ</span>
                    <h3 className="text-2xl font-black text-fuchsia-900 font-kantumruy">{oddRounds[oddIdx].q}</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {oddRounds[oddIdx].items.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          const isOdd = item === oddRounds[oddIdx].odd;
                          triggerFeedback(isOdd);
                          if (oddIdx < oddRounds.length - 1) {
                            setOddIdx(i => i + 1);
                          } else {
                            setIsGameOver(true);
                          }
                        }}
                        className="p-6 bg-white border-2 border-slate-200 hover:border-fuchsia-500 hover:bg-fuchsia-50 rounded-2xl font-black text-xl text-slate-800 transition active:scale-95 shadow"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* GAME TYPE: BANANA GAME (18) */}
              {config.type === 'banana-game' && (
                <div className="space-y-6 text-center">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-3xl p-8">
                    <span className="text-xs font-bold text-yellow-700 block mb-2 font-kantumruy">តើ «ផ្លែចេក» តំណាងឱ្យពាក្យអ្វី?</span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-800 font-kantumruy leading-relaxed">
                      {bananaRounds[bananaIdx].prompt}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {bananaRounds[bananaIdx].options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          const isCorrect = opt === bananaRounds[bananaIdx].correct;
                          triggerFeedback(isCorrect);
                          if (bananaIdx < bananaRounds.length - 1) {
                            setBananaIdx(i => i + 1);
                          } else {
                            setIsGameOver(true);
                          }
                        }}
                        className="p-5 bg-white border-2 border-slate-200 hover:border-yellow-500 hover:bg-yellow-50 rounded-2xl font-bold font-kantumruy text-lg text-slate-800 transition active:scale-95 shadow"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* GAME TYPE: FRUIT MARKET (20) */}
              {config.type === 'fruit-market' && (
                <div className="space-y-6 text-center">
                  <div className="bg-lime-50 border border-lime-200 rounded-3xl p-6 text-left">
                    <span className="text-xs font-bold text-lime-700 block mb-2 uppercase font-kantumruy">តុគិតលុយលក់ផ្លែឈើ</span>
                    <p className="font-bold text-slate-700 text-lg">🛒 ទំនិញទិញ៖ <span className="text-slate-900">{fruitOrders[marketIdx].item}</span></p>
                    <p className="font-bold text-slate-700 text-lg mt-1">💵 អតិថិជនហុចប្រាក់៖ <span className="text-emerald-600 font-mono font-black">{fruitOrders[marketIdx].paid.toLocaleString()} ៛</span></p>
                    <div className="mt-4 p-3 bg-white rounded-xl border border-lime-200 font-black text-lime-800 text-center font-kantumruy">
                      តើត្រូវអាប់ប្រាក់ជូនអតិថិជនចំនួនប៉ុន្មាន?
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {fruitOrders[marketIdx].options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          const isCorrect = opt === fruitOrders[marketIdx].correct;
                          triggerFeedback(isCorrect);
                          if (marketIdx < fruitOrders.length - 1) {
                            setMarketIdx(i => i + 1);
                          } else {
                            setIsGameOver(true);
                          }
                        }}
                        className="p-5 bg-white border-2 border-slate-200 hover:border-lime-500 hover:bg-lime-50 rounded-2xl font-black text-xl text-slate-800 transition active:scale-95 shadow font-mono"
                      >
                        {opt.toLocaleString()} ៛
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* GAME TYPE: TRAFFIC LIGHT (31) */}
              {config.type === 'traffic-light' && (
                <div className="space-y-6 text-center">
                  <div className="bg-slate-900 p-8 rounded-3xl max-w-xs mx-auto border-4 border-slate-700 shadow-2xl flex flex-col items-center gap-4">
                    <div className={`w-20 h-20 rounded-full transition-all duration-300 ${trafficColor === 'red' ? 'bg-rose-500 shadow-lg shadow-rose-500/80 scale-110' : 'bg-rose-950 opacity-40'}`} />
                    <div className={`w-20 h-20 rounded-full transition-all duration-300 ${trafficColor === 'yellow' ? 'bg-amber-400 shadow-lg shadow-amber-400/80 scale-110' : 'bg-amber-950 opacity-40'}`} />
                    <div className={`w-20 h-20 rounded-full transition-all duration-300 ${trafficColor === 'green' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/80 scale-110' : 'bg-emerald-950 opacity-40'}`} />
                  </div>

                  <p className="text-lg font-black font-kantumruy text-slate-800">{trafficMessage}</p>

                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => {
                        if (trafficColor === 'green') {
                          triggerFeedback(true);
                          // switch light
                          const colors: ('red' | 'yellow' | 'green')[] = ['red', 'yellow', 'green'];
                          const nextC = colors[Math.floor(Math.random() * colors.length)];
                          setTrafficColor(nextC);
                          if (nextC === 'green') setTrafficMessage('ភ្លើងបៃតង៖ ចុចប៊ូតុង "ទៅមុខ"!');
                          if (nextC === 'yellow') setTrafficMessage('ភ្លើងលឿង៖ ត្រៀមឈប់ (ហាមចុច)!');
                          if (nextC === 'red') setTrafficMessage('ភ្លើងក្រហម៖ ឈប់ជាដាច់ខាត (ហាមចុច)!');
                        } else {
                          triggerFeedback(false);
                        }
                      }}
                      className="px-10 py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black font-kantumruy text-xl shadow-lg active:scale-95"
                    >
                      🚗 ទៅមុខ (Go)!
                    </button>
                  </div>
                </div>
              )}

              {/* GAME TYPE: TRUE / FALSE (41, 55) */}
              {config.type === 'true-false' && (
                <div className="space-y-6 text-center">
                  <div className="bg-violet-50 border border-violet-200 rounded-3xl p-8">
                    <span className="text-xs font-bold text-violet-600 block mb-2 font-kantumruy">សំណួរទី {tfIdx + 1}៖ វិភាគប្រយោគ</span>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-800 font-kantumruy leading-relaxed">
                      «{tfQuestions[tfIdx].q}»
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => {
                        const isMatch = tfQuestions[tfIdx].isTrue === true;
                        triggerFeedback(isMatch);
                        if (tfIdx < tfQuestions.length - 1) {
                          setTfIdx(i => i + 1);
                        } else {
                          setIsGameOver(true);
                        }
                      }}
                      className="p-6 bg-emerald-50 border-2 border-emerald-500 hover:bg-emerald-500 hover:text-white rounded-2xl font-black font-kantumruy text-2xl text-emerald-700 transition active:scale-95 shadow flex items-center justify-center gap-3"
                    >
                      <CheckCircle2 className="w-8 h-8" /> ត្រឹមត្រូវ (ទះដៃ)
                    </button>
                    <button
                      onClick={() => {
                        const isMatch = tfQuestions[tfIdx].isTrue === false;
                        triggerFeedback(isMatch);
                        if (tfIdx < tfQuestions.length - 1) {
                          setTfIdx(i => i + 1);
                        } else {
                          setIsGameOver(true);
                        }
                      }}
                      className="p-6 bg-rose-50 border-2 border-rose-500 hover:bg-rose-500 hover:text-white rounded-2xl font-black font-kantumruy text-2xl text-rose-700 transition active:scale-95 shadow flex items-center justify-center gap-3"
                    >
                      <XCircle className="w-8 h-8" /> មិនត្រឹមត្រូវ (ស្ងៀម)
                    </button>
                  </div>
                </div>
              )}

              {/* GAME TYPE: SECRET CODE (58) */}
              {config.type === 'secret-code' && (
                <div className="space-y-6 text-center">
                  <div className="bg-slate-100 border border-slate-300 rounded-3xl p-6">
                    <span className="text-xs font-bold text-slate-500 block mb-1">តារាងលេខកូដសម្ងាត់</span>
                    <p className="font-black text-slate-700 text-lg">{codePuzzles[codeIdx].legend}</p>
                    <div className="mt-4 p-4 bg-white rounded-2xl border-2 border-slate-300">
                      <span className="text-xs font-bold text-slate-400 block mb-1 font-kantumruy">កូដដែលត្រូវបំប្លែង</span>
                      <h4 className="text-3xl font-black font-mono text-orange-600">{codePuzzles[codeIdx].cipher}</h4>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {codePuzzles[codeIdx].options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          const isMatch = opt === codePuzzles[codeIdx].answer;
                          triggerFeedback(isMatch);
                          if (codeIdx < codePuzzles.length - 1) {
                            setCodeIdx(i => i + 1);
                          } else {
                            setIsGameOver(true);
                          }
                        }}
                        className="p-5 bg-white border-2 border-slate-200 hover:border-slate-800 hover:bg-slate-50 rounded-2xl font-black font-kantumruy text-lg text-slate-800 transition active:scale-95 shadow"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* GAME TYPE: CLASSROOM TIMER & RUNNER (All other games) */}
              {config.type === 'classroom-timer' && (
                <div className="space-y-6 text-center">
                  <div className="bg-orange-50 border border-orange-200 rounded-3xl p-6 text-left space-y-3">
                    <h3 className="text-lg font-black font-kantumruy text-orange-800 flex items-center gap-2">
                      <Flame className="w-5 h-5 text-orange-600" /> សកម្មភាពលេងជាក់ស្តែងក្នុងថ្នាក់រៀន
                    </h3>
                    <div>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block font-kantumruy">របៀបលេង</span>
                      <p className="text-sm font-bold text-slate-700 leading-relaxed font-khmer mt-0.5">{game.howToPlay}</p>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block font-kantumruy">លក្ខខណ្ឌ</span>
                      <p className="text-sm text-slate-600 leading-relaxed font-khmer mt-0.5">{game.condition}</p>
                    </div>
                  </div>

                  {/* Classroom Timer Box */}
                  <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl flex flex-col items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                      <Timer className="w-4 h-4 text-orange-400" /> នាឡិការាប់ថយក្រោយសម្រាប់សិស្ស
                    </span>
                    <div className="text-6xl font-black font-mono text-amber-400 py-3">
                      {Math.floor(timerSeconds / 60)}:{String(timerSeconds % 60).padStart(2, '0')}
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => setIsTimerRunning(!isTimerRunning)}
                        className={`px-8 py-3 rounded-2xl font-bold font-kantumruy text-sm transition shadow-lg flex items-center gap-2 ${
                          isTimerRunning 
                            ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/30' 
                            : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30'
                        }`}
                      >
                        {isTimerRunning ? 'ផ្អាកនាឡិកា (Pause)' : 'ចាប់ផ្តើមលេង (Start)'}
                      </button>
                      <button
                        onClick={() => {
                          setIsTimerRunning(false);
                          setTimerSeconds(60);
                        }}
                        className="px-5 py-3 bg-white/10 hover:bg-white/20 rounded-2xl font-bold text-sm text-white"
                      >
                        កំណត់ឡើងវិញ
                      </button>
                    </div>
                  </div>

                  {/* Quick Score Adder for Teachers */}
                  <div className="pt-2 flex items-center justify-center gap-3">
                    <span className="text-xs font-bold text-slate-500 font-kantumruy">កត់ត្រាពិន្ទុសិស្សឆ្លើយត្រូវ៖</span>
                    <button
                      onClick={() => {
                        triggerFeedback(true);
                      }}
                      className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl text-sm shadow hover:scale-105 active:scale-95 transition flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> ថែម +១០ ពិន្ទុ
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-100 p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 font-kantumruy">
            <span>លទ្ធផលទទួលបាន៖</span>
            <span className="text-emerald-700">{game.result}</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl font-bold text-xs transition"
          >
            បិទផ្ទាំង
          </button>
        </div>

      </motion.div>
    </div>
  );
}

function Plus(props: any) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}
