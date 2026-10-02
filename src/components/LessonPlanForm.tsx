import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  Sparkles, 
  Save, 
  Download, 
  BookOpen, 
  RefreshCw,
  Plus,
  Trash2,
  AlertCircle,
  Target,
  Layers,
  FileDown,
  Lightbulb,
  Presentation,
  Loader2,
  CheckCircle2,
  Gamepad2,
  Calendar,
  Clock,
  MapPin,
  User,
  FileText,
  ChevronRight,
  Check,
  Calculator,
  FlaskConical,
  Activity,
  Globe,
  RotateCcw,
  School,
  PenLine,
  X,
  Printer
} from 'lucide-react';
import { LessonPlan, Grade, StepContent } from '../types';
import TeachingGlossaryModal from './TeachingGlossaryModal';
import WorksheetModal from './WorksheetModal';
import SlideGeneratorModal from './SlideGeneratorModal';
import EducationalGameModal from './EducationalGameModal';
import SampleLessonPlansModal from './SampleLessonPlansModal';
import { EducationalGame, PRIMARY_EDUCATIONAL_GAMES, analyzeAndRecommendGame } from '../data/educationalGames';
import { analyzeLessonPedagogy, LessonPedagogyResult } from '../utils/lessonPedagogy';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, BorderStyle, WidthType } from 'docx';
import { saveAs } from 'file-saver';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import { GRADE_LESSON_PRESETS } from '../data/gradeLessonPresets';

interface LessonPlanFormProps {
  onBack: () => void;
}

const defaultPreset = GRADE_LESSON_PRESETS.find(p => p.id === 'math-g4')?.plan || GRADE_LESSON_PRESETS[0]?.plan;

const INITIAL_PLAN: LessonPlan = {
  grade: 4,
  chapter: defaultPreset?.chapter || '៣',
  chapterTitle: defaultPreset?.chapterTitle || 'វិធីសាស្ត្រគណិតវិទ្យា',
  lesson: defaultPreset?.lesson || '២៩',
  lessonTitle: defaultPreset?.lessonTitle || 'វិធីកត់ត្រានៃវិធីសាស្ត្រគណិតវិទ្យា',
  subject: defaultPreset?.subject || 'គណិតវិទ្យា (ពង្រឹងចំណេះដឹងមូលដ្ឋាន)',
  week: defaultPreset?.week || 'សប្តាហ៍ទី២៩',
  methodology: defaultPreset?.methodology || 'ម៉ូដែលបង្រៀនបែប 5E (5E Instructional Model)',
  teachingMethods: defaultPreset?.teachingMethods || 'ម៉ូដែលបង្រៀនបែប 5E (5E Instructional Model)',
  strategy: defaultPreset?.strategy || 'ការអនុវត្តផ្ទាល់ (Hands-on Activity), ការគិត-ចាប់គូ-ចែករំលែក (Think-Pair-Share)',
  approach: defaultPreset?.approach || 'សិស្សមជ្ឈមណ្ឌល',
  educationalGame: defaultPreset?.educationalGame || 'ល្បែង «សំបុកកញ្ចាញ់ចេក និងដើរមើលវិចិត្រសាល (Gallery Walk Challenge)»',
  institutionName: localStorage.getItem('user_school') || 'វិទ្យាស្ថានគរុកោសល្យរាជធានីភ្នំពេញ',
  englishInstitutionName: 'Phnom Penh Teacher Education College',
  generationCohort: 'គរុនិស្សិតបឋមសិក្សា ១២+៤ ឆ្នាំទី២ ជំនាន់ទី៤ ឆមាសទី១',
  evaluatorTeacher: 'ហាច មន',
  preparedBy: 'សមាជិកក្រុមទី៧ (ណុះ សើហ្វីអ៊ូ, នឿន សុគុណ, ជូន វិសាល, ម៉ុន សុជាតិ)',
  subTitle: '',
  objectives: defaultPreset?.objectives || {
    knowledge: 'ពន្យល់បានអំពីអត្ថបទទាំង ៣ នៃការកត់ត្រាក្នុងគណិតវិទ្យា (កត់ត្រាភ្លាមៗ, កត់ត្រាជាសុក្រិត, និងកត់ត្រាសម្រាប់អ្នកដទៃ) តាមរយៈការពិភាក្សា។',
    skills: 'ប្រើប្រាស់រូបគំរូ ឬតារាង ដើម្បីដោះស្រាយបញ្ហា និងបង្ហាញដំណោះស្រាយឱ្យបានច្បាស់លាស់ក្រោយចប់មេរៀន។',
    attitude: 'មានការជឿជាក់លើគំនិតខ្លួន ហ៊ានចូលរួម និងឱ្យតម្លៃដំណោះស្រាយអ្នកដទៃ។',
  },
  materials: defaultPreset?.materials || {
    teacher: 'សៀវភៅសិក្សាគោល សន្លឹកកិច្ចការ កិច្ចតែងការបង្រៀន រូបធរណីមាត្រ និង ហ្វឺត។',
    student: 'សម្ភារៈគ្រប់គ្រាន់ (សៀវភៅ ប៊ិច ខ្មៅដៃ បន្ទាត់)។',
  },
  duration: 45,
  date: 'ថ្ងៃចន្ទ ១០រោច ខែមិគសិរ ឆ្នាំម្សាញ់ សប្តស័ក ព.ស ២៥៦៩ ត្រូវនឹងថ្ងៃទី ១៥ ខែធ្នូ ឆ្នាំ ២០២៥',
  lessonContent: {
    text: 'វិធីកត់ត្រានៃវិធីសាស្ត្រគណិតវិទ្យា៖ ការកត់ត្រាភ្លាមៗ ការកត់ត្រាជាសុក្រិត និងការកត់ត្រាសម្រាប់អ្នកដទៃ។ បញ្ហាចាប់ដៃមនុស្ស ៥នាក់ (សរុប ១០ដង)។',
  },
  steps: defaultPreset?.steps || {
    step1: { teacherActivity: '', content: '', studentActivity: '' },
    step2: { teacherActivity: '', content: '', studentActivity: '' },
    step3: { teacherActivity: '', content: '', studentActivity: '' },
    step4: { teacherActivity: '', content: '', studentActivity: '' },
    step5: { teacherActivity: '', content: '', studentActivity: '' },
  },
  references: 'សៀវភៅសិក្សាគោលគណិតវិទ្យា កិច្ចតែងការគំរូវិទ្យាស្ថានគរុកោសល្យរាជធានីភ្នំពេញ (TEC)',
  location: 'បន្ទប់សិក្សា',
  taughtBy: localStorage.getItem('user_teacher') || 'គ្រូបង្រៀន',
  showCoverPage: false,
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

const renderBulletedList = (text: string | null | undefined) => {
  if (!text || text === '...') return text || '...';
  const lines = text.split('\n').filter(l => l.trim().length > 0);
  return (
    <div className="space-y-1 text-left w-full">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        
        // Phase headers like "o ចូលរួម (Engage)៖" or "o ការរុករក (Explore)៖"
        if (/^[oO]\s+/i.test(trimmed) || trimmed.startsWith('o ') || trimmed.startsWith('O ')) {
          return (
            <div key={idx} className="font-bold text-[#1a3a8f] pt-1.5 pb-0.5 flex items-center gap-1.5 text-[10.5pt] border-b border-blue-100 mb-1">
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
          <div key={idx} className={`flex items-start gap-1.5 ${isSubBullet ? 'ml-4 text-slate-700' : 'ml-0 text-slate-900'}`}>
            <span className="shrink-0 mt-[2px] font-bold text-slate-600 text-xs">{isSubBullet ? '−' : '•'}</span>
            <span className="flex-1 leading-relaxed">{cleanLine}</span>
          </div>
        );
      })}
    </div>
  );
};

const TEACHING_METHODS = [
  "វិធីសាស្ត្ររៀនតាមបែបរិះរក (Inquiry-Based Learning - IBL)",
  "ម៉ូដែលបង្រៀនបែប 5E (5E Instructional Model)",
  "វិធីសាស្ត្ររៀនតាមបែបដោះស្រាយបញ្ហា (Problem-Based Learning - PBL)",
  "វិធីសាស្ត្ររៀនតាមបែបគម្រោង (Project-Based Learning)",
  "បច្ចេកទេសរៀនតាមបែបសហការ (Cooperative Learning Techniques)",
  "ថ្នាក់រៀនត្រឡប់ (Flipped Classroom)",
  "ការសិក្សាតាមបទពិសោធន៍ (Experiential Learning)",
  "វិធីសាស្រ្តសូក្រាត (Socratic Method)",
  "ការរៀនផ្អែកលើល្បែង (Game-Based Learning)"
];

const TEACHING_STRATEGIES = [
  "ការគិត-ចាប់គូ-ចែករំលែក (Think-Pair-Share)",
  "វិធីសាស្រ្តជីកស ឬ ការផ្គុំចំណេះដឹង (Jigsaw Technique)",
  "ការបំផុសគំនិត (Brainstorming)",
  "ការដើរមើលវិចិត្រសាល (Gallery Walk)",
  "ការដើរតួ ឬ ការលេងតួ (Role-playing)",
  "ការជជែកដេញដោល (Debate)",
  "ផែនទីគំនិត (Mind Mapping)",
  "ការបង្រៀនដោយមិត្តភក្តិ (Peer Teaching)",
  "ការសិក្សាករណី (Case Study)",
  "ការអនុវត្តផ្ទាល់ (Hands-on Activity)",
  "ការពិភាក្សាបែបអាងត្រី (Fishbowl Discussion)",
  "ការពិភាក្សាបែបដុំព្រិល (Snowballing Discussion)",
  "សិក្ខាសាលាសូក្រាត (Socratic Seminar)",
  "ការឆ្លើយវិលជុំ ឬ តុរាងរង្វង់ (Round Robin / Round Table)",
  "មួកគិតទាំង៦ (Six Thinking Hats)",
  "ការធ្វើត្រាប់តាម ឬ ក្លែងធ្វើ (Simulation)",
  "ការរៀនតាមស្ថានីយ (Station Rotation)",
  "សំបុត្រចេញ / សំបុត្រចូល (Exit Ticket / Entry Ticket)",
  "ក្រដាសមួយនាទី (One-Minute Paper)",
  "ចំណុចស្រអាប់បំផុត (Muddiest Point)",
  "តារាង KWL (KWL Chart)",
  "ប័ណ្ណបង្ហាញ ឬ ប័ណ្ណបោះឆ្នោត (Flashcards / Polling Cards)"
];

export default function LessonPlanForm({ onBack }: LessonPlanFormProps) {
  const [plan, setPlan] = useState<LessonPlan>(INITIAL_PLAN);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [worksheetType, setWorksheetType] = useState<'student' | 'teacher' | null>(null);
  const [showSlideGenerator, setShowSlideGenerator] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showGameModal, setShowGameModal] = useState(false);
  const [isAnalyzingGame, setIsAnalyzingGame] = useState(false);
  const [gameAnalysisRationale, setGameAnalysisRationale] = useState<string | null>(null);
  const [formTab, setFormTab] = useState<'info' | 'objectives' | 'pedagogy'>('info');
  const [showFillInfoModal, setShowFillInfoModal] = useState(false);
  const [showSamplePlansModal, setShowSamplePlansModal] = useState(false);

  const [showObjectivesEdit, setShowObjectivesEdit] = useState(false);
  const [analysisFeedback, setAnalysisFeedback] = useState<{
    method: string;
    strategies: string[];
    objectives: { knowledge: string; skills: string; attitude: string };
    game: string;
    rationale: string;
    bloomsLevel?: string;
    source: 'ai' | 'pedagogical_engine';
  } | null>(null);

  const handleSelectGame = (game: EducationalGame) => {
    setPlan(prev => ({
      ...prev,
      educationalGame: game.name,
      steps: {
        ...prev.steps,
        step4: game.sampleStep4
      }
    }));
    setGameAnalysisRationale(`បានជ្រើសរើស ${game.name}៖ ស្របតាមវិធីសាស្ត្រ «${game.suitedMethods[0] || '5E'}» និងយុទ្ធវិធី «${game.suitedStrategies[0] || 'សិស្សមជ្ឈមណ្ឌល'}» សម្រាប់ថ្នាក់ទី ${plan.grade}។ ជួយជំរុញ ${game.pedagogicalPurpose}`);
  };

  const handleAIGenerateGame = async () => {
    setIsAnalyzingGame(true);
    setGameAnalysisRationale(null);
    try {
      const promptText = `អ្នកគឺជា «អ្នកជំនាញវិធីសាស្ត្របង្រៀន និងគរុកោសល្យបឋមសិក្សា (ថ្នាក់ទី១ ដល់ទី៦)»។
សូមវិភាគយ៉ាងល្អិតល្អន់នូវទិន្នន័យមេរៀនខាងក្រោម ដើម្បីជ្រើសរើស និងរៀបចំ «ល្បែងសិក្សា (Educational Game)» ដែលស័ក្តិសមបំផុតសម្រាប់ «ជំហានទី៤៖ ពង្រឹងពុទ្ធិ/ការវាយតម្លៃ» នៃកិច្ចតែងការបង្រៀន៖

ព័ត៌មានមេរៀន៖
- កម្រិតថ្នាក់៖ ថ្នាក់ទី ${plan.grade} (បឋមសិក្សា)
- មុខវិជ្ជា៖ ${plan.subject}
- មេរៀន៖ ${plan.lessonTitle}
- គោលវិធី៖ ${plan.approach || 'សិស្សមជ្ឈមណ្ឌល'}
- វិធីសាស្ត្របង្រៀន៖ ${plan.teachingMethods || plan.methodology || 'ម៉ូដែលបង្រៀនបែប 5E'}
- យុទ្ធវិធីបង្រៀន៖ ${plan.strategy || 'ការអនុវត្តផ្ទាល់, ការគិត-ចាប់គូ-ចែករំលែក'}
- ខ្លឹមសារមេរៀន៖ ${plan.lessonContent?.text || ''}
- វត្ថុបំណងវិជ្ជាសម្បទា៖ ${plan.objectives.knowledge}
- វត្ថុបំណងបំណិនសម្បទា៖ ${plan.objectives.skills}

លក្ខខណ្ឌគរុកោសល្យ៖
១. វិភាគវិធីសាស្ត្របង្រៀន និងយុទ្ធវិធីបង្រៀន ឱ្យស៊ីសង្វាក់គ្នានឹងល្បែងសិក្សា។
២. ល្បែងសិក្សាត្រូវជួយវាស់ស្ទង់ ឬពង្រឹងវត្ថុបំណងមេរៀនខាងលើឱ្យបានជាក់ស្តែង។
៣. ខ្លឹមសារជំហានទី៤ ត្រូវរៀបចំជា ៣ ក្រឡោន (teacherActivity, content, studentActivity) ដោយប្រើ "• " ជាចំណុចធំ និង "\\n  - " ជាចំណុចតូចៗ។ ចំនួនចំណុចធំៗនៅក្រឡោនទាំង៣ ត្រូវស្មើគ្នា។

សូមឆ្លើយតបតែជាទម្រង់ JSON object string ប៉ុណ្ណោះ (NO markdown, NO \`\`\`json)៖
{
  "educationalGame": "ល្បែង «[ឈ្មោះល្បែងជាភាសាខ្មែរ]»",
  "rationale": "ការវិភាគគរុកោសល្យ៖ ហេតុអ្វីបានជាល្បែងនេះត្រូវគ្នានឹងវិធីសាស្ត្រ (${plan.teachingMethods || '5E'}) និងយុទ្ធវិធី (${plan.strategy || 'Hands-on'}) សម្រាប់ថ្នាក់ទី ${plan.grade}?",
  "step4": {
    "teacherActivity": "• គ្រូរៀបចំល្បែងសិក្សា៖ «[ឈ្មោះល្បែង]»\\n  - របៀបដឹកនាំល្បែង...\\n• គ្រូសម្របសម្រួល និងវាយតម្លៃ...",
    "content": "• ពង្រឹងពុទ្ធិ និងវាយតម្លៃតាមរយៈល្បែង៖ «[ឈ្មោះល្បែង]»\\n  - ខ្លឹមសារលំហាត់/សំណួរ...\\n• ការវាយតម្លៃលទ្ធផល...",
    "studentActivity": "• សិស្សចូលរួមលេងល្បែង «[ឈ្មោះល្បែង]» យ៉ាងសកម្ម...\\n  - សកម្មភាពសិស្សក្នុងការលេង...\\n• សិស្សឆ្លើយសំណួរឆ្លុះបញ្ចាំង..."
  }
}`;

      const response = await fetch('/api/generateLessonPlan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptText, isJson: true, userApiKey: localStorage.getItem("userGeminiApiKey") || undefined })
      });

      if (!response.ok) {
        throw new Error('API response not ok');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error('No reader');

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
              if (parsed.text) text += parsed.text;
            } catch(e) {}
          }
        }
      }

      let cleanedText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      const match = cleanedText.match(/\{[\s\S]*\}/);
      if (match) cleanedText = match[0];
      const parsed = JSON.parse(cleanedText);

      if (parsed.educationalGame) {
        setPlan(prev => ({
          ...prev,
          educationalGame: parsed.educationalGame,
          steps: {
            ...prev.steps,
            step4: parsed.step4 || prev.steps.step4
          }
        }));
        if (parsed.rationale) {
          setGameAnalysisRationale(parsed.rationale);
        }
      }
    } catch (err: any) {
      console.warn("AI Game analysis fallback to local pedagogical match:", err);
      // Resilient pedagogical recommendation fallback
      const rec = analyzeAndRecommendGame(plan.teachingMethods || plan.methodology, plan.strategy, plan.grade, plan.subject);
      setPlan(prev => ({
        ...prev,
        educationalGame: rec.name,
        steps: {
          ...prev.steps,
          step4: rec.sampleStep4
        }
      }));
      setGameAnalysisRationale(`បានវិភាគតាមគរុកោសល្យ៖ ផ្អែកលើវិធីសាស្ត្រ «${plan.teachingMethods || '5E'}» និងយុទ្ធវិធី «${plan.strategy || 'សិស្សមជ្ឈមណ្ឌល'}» សម្រាប់ថ្នាក់ទី ${plan.grade} មុខវិជ្ជា ${plan.subject} ល្បែង «${rec.name}» ជួយជំរុញ ${rec.pedagogicalPurpose}`);
    } finally {
      setIsAnalyzingGame(false);
    }
  };

  const [selectedSubjectTab, setSelectedSubjectTab] = useState<string>('គណិតវិទ្យា');

  const handleSelectGradePreset = (presetId: string) => {
    const selected = GRADE_LESSON_PRESETS.find(p => p.id === presetId);
    if (selected && selected.plan) {
      setPlan(prev => ({
        ...prev,
        ...selected.plan,
        educationalGame: selected.plan.educationalGame || prev.educationalGame,
        objectives: { ...prev.objectives, ...(selected.plan.objectives || {}) },
        materials: { ...prev.materials, ...(selected.plan.materials || {}) },
        steps: {
          step1: selected.plan.steps?.step1 || prev.steps.step1,
          step2: selected.plan.steps?.step2 || prev.steps.step2,
          step3: selected.plan.steps?.step3 || prev.steps.step3,
          step4: selected.plan.steps?.step4 || prev.steps.step4,
          step5: selected.plan.steps?.step5 || prev.steps.step5,
        },
        lessonContent: {
          text: `${selected.plan.lessonTitle}៖ ខ្លឹមសារមេរៀនស្របតាមកម្មវិធីសិក្សាគោលក្រសួងអប់រំ យុវជន និងកីឡា។`
        }
      }));
    }
  };

  const handleGradeChange = (newGrade: Grade) => {
    // Try to find preset matching both current subject (or selected tab) and new grade
    const targetSubject = plan.subject.includes('គណិត')
      ? 'គណិតវិទ្យា'
      : plan.subject.includes('ភាសា')
      ? 'ភាសាខ្មែរ'
      : plan.subject.includes('វិទ្យា')
      ? 'វិទ្យាសាស្ត្រ'
      : plan.subject.includes('អប់រំកាយ')
      ? 'អប់រំកាយ'
      : plan.subject.includes('សង្គម')
      ? 'សិក្សាសង្គម'
      : selectedSubjectTab;

    const presetForGrade = GRADE_LESSON_PRESETS.find(p => p.grade === newGrade && p.subject === targetSubject)
      || GRADE_LESSON_PRESETS.find(p => p.grade === newGrade);

    if (presetForGrade && presetForGrade.plan) {
      handleSelectGradePreset(presetForGrade.id);
    } else {
      setPlan(prev => ({ ...prev, grade: newGrade }));
    }
  };

  useEffect(() => {
    const savedPlan = localStorage.getItem('saved_lesson_plan_draft');
    if (savedPlan) {
      try {
        const parsed = JSON.parse(savedPlan);
        setPlan(prev => ({
          ...prev,
          ...parsed,
          educationalGame: parsed.educationalGame || prev.educationalGame,
          objectives: { ...prev.objectives, ...(parsed.objectives || {}) },
          materials: { ...prev.materials, ...(parsed.materials || {}) },
          steps: {
            step1: { ...prev.steps.step1, ...(parsed.steps?.step1 || {}) },
            step2: { ...prev.steps.step2, ...(parsed.steps?.step2 || {}) },
            step3: { ...prev.steps.step3, ...(parsed.steps?.step3 || {}) },
            step4: { ...prev.steps.step4, ...(parsed.steps?.step4 || {}) },
            step5: { ...prev.steps.step5, ...(parsed.steps?.step5 || {}) },
          },
          lessonContent: { ...prev.lessonContent, ...(parsed.lessonContent || {}) }
        }));
      } catch(e) {
        console.error("Failed to parse saved lesson plan:", e);
      }
    }
  }, []);

  const handleAnalyzeLesson = async () => {
    const contentText = (plan.lessonContent?.text || '').trim();
    const titleText = (plan.lessonTitle || '').trim();
    const chapterText = (plan.chapterTitle || '').trim();

    if (!contentText && !titleText && !chapterText) {
      alert('សូមបញ្ចូលចំណងជើងមេរៀន ឬអត្ថបទមេរៀនសង្ខេបជាមុនសិន ដើម្បីឱ្យ AI អាចវិភាគបាន!');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisFeedback(null);

    try {
      const promptText = `អ្នកគឺជា «អ្នកជំនាញវិធីសាស្ត្របង្រៀនសតវត្សទី២១» យោងតាមស្តង់ដារក្រសួងអប់រំ យុវជន និងកីឡា និង Bloom's Taxonomy។
សូមវិភាគខ្លឹមសារមេរៀននេះ ផ្អែកលើកម្រិតថ្នាក់ទី ${plan.grade} មុខវិជ្ជា ${plan.subject} មេរៀន «${titleText || chapterText || 'មេរៀនថ្មី'}»។
សូមផ្ដល់ការវិភាគគរុកោសល្យ និងផ្ដល់យោបល់ពិគ្រោះយ៉ាងស៊ីជម្រៅ៖
១. វិធីសាស្ត្របង្រៀន (ជ្រើសរើសតែ១គត់ ដែលល្អបំផុតចេញពីបញ្ជី)
២. យុទ្ធវិធីបង្រៀន (ជ្រើសរើស ២ ទៅ ៣ យុទ្ធវិធីដែលស័ក្តិសម)
៣. វត្ថុបំណងទាំង ៣ (វិជ្ជាសម្បទា, បំណិនសម្បទា, ចរិយាសម្បទា)
៤. ល្បែងសិក្សាសម្រាប់ជំហានទី៤
៥. ការពន្យល់ពីហេតុផលគរុកោសល្យ (Pedagogical Rationale) ផ្អែកលើ Bloom's Taxonomy។

បញ្ជីវិធីសាស្ត្របង្រៀន៖ [${TEACHING_METHODS.join(', ')}]
បញ្ជីយុទ្ធវិធីបង្រៀន៖ [${TEACHING_STRATEGIES.join(', ')}]

ព័ត៌មានមេរៀន៖
- កម្រិតថ្នាក់៖ ថ្នាក់ទី ${plan.grade}
- មុខវិជ្ជា៖ ${plan.subject}
- ជំពូក៖ ${chapterText}
- មេរៀន៖ ${titleText}
- ខ្លឹមសារ/អត្ថបទមេរៀន៖ ${contentText || titleText}

សូមឆ្លើយតបតែជាទម្រង់ JSON object string ប៉ុណ្ណោះ (NO markdown, NO \`\`\`json)៖
{
  "teachingMethod": "ឈ្មោះវិធីសាស្រ្ត",
  "strategies": ["យុទ្ធវិធីទី១", "យុទ្ធវិធីទី២"],
  "objectives": {
    "knowledge": "• វិជ្ជាសម្បទា...",
    "skills": "• បំណិនសម្បទា...",
    "attitude": "• ចរិយាសម្បទា..."
  },
  "educationalGame": "ឈ្មោះល្បែងសិក្សាសម្រាប់ជំហានទី៤",
  "bloomsLevel": "កម្រិត Bloom's Taxonomy...",
  "rationale": "ហេតុផលគរុកោសល្យ..."
}`;

      const response = await fetch('/api/generateLessonPlan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptText, isJson: true, userApiKey: localStorage.getItem("userGeminiApiKey") || undefined })
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
              // ignore partial chunks
            }
          }
        }
      }

      let cleanedText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      const match = cleanedText.match(/\{[\s\S]*\}/);
      if (match) {
        cleanedText = match[0];
      }
      const parsed = JSON.parse(cleanedText);

      let newStrategy = '';
      let stratArr: string[] = [];
      if (Array.isArray(parsed.strategies) && parsed.strategies.length > 0) {
        stratArr = parsed.strategies;
        newStrategy = parsed.strategies.join(', ');
      } else if (typeof parsed.strategy === 'string') {
        newStrategy = parsed.strategy;
        stratArr = [parsed.strategy];
      }

      let newMethod = '';
      if (typeof parsed.teachingMethod === 'string') {
        newMethod = parsed.teachingMethod;
      } else if (Array.isArray(parsed.teachingMethods) && parsed.teachingMethods.length > 0) {
        newMethod = parsed.teachingMethods[0];
      }

      const newObjectives = parsed.objectives && typeof parsed.objectives === 'object' ? {
        knowledge: parsed.objectives.knowledge || plan.objectives.knowledge,
        skills: parsed.objectives.skills || plan.objectives.skills,
        attitude: parsed.objectives.attitude || plan.objectives.attitude,
      } : plan.objectives;

      const newGame = parsed.educationalGame || plan.educationalGame;

      setPlan(prev => ({
        ...prev,
        teachingMethods: newMethod || prev.teachingMethods,
        strategy: newStrategy || prev.strategy,
        objectives: newObjectives,
        educationalGame: newGame || prev.educationalGame
      }));

      setAnalysisFeedback({
        method: newMethod || plan.teachingMethods || 'ម៉ូដែល 5E',
        strategies: stratArr.length > 0 ? stratArr : [plan.strategy || 'ការអនុវត្តផ្ទាល់'],
        objectives: newObjectives,
        game: newGame || 'ល្បែងសិក្សាពង្រឹងពុទ្ធិ',
        rationale: parsed.rationale || `បានវិភាគមេរៀន «${titleText || 'ថ្មី'}» ផ្អែកលើ Bloom's Taxonomy សម្រាប់ថ្នាក់ទី ${plan.grade} មុខវិជ្ជា ${plan.subject}`,
        bloomsLevel: parsed.bloomsLevel || "កម្រិតយល់ដឹង និងការអនុវត្ត",
        source: 'ai'
      });

    } catch (err: any) {
      console.warn("AI Analysis fallback to intelligent pedagogical engine:", err);
      // Resilient pedagogical analysis fallback ensures analysis NEVER stalls
      const fallbackResult = analyzeLessonPedagogy(
        plan.grade,
        plan.subject,
        plan.lessonTitle,
        plan.chapterTitle,
        plan.lessonContent?.text
      );

      setPlan(prev => ({
        ...prev,
        teachingMethods: fallbackResult.teachingMethod,
        strategy: fallbackResult.strategyText,
        objectives: fallbackResult.objectives,
        educationalGame: fallbackResult.educationalGame.name,
        steps: {
          ...prev.steps,
          step4: fallbackResult.educationalGame.sampleStep4
        }
      }));

      setAnalysisFeedback({
        method: fallbackResult.teachingMethod,
        strategies: fallbackResult.strategies,
        objectives: fallbackResult.objectives,
        game: fallbackResult.educationalGame.name,
        rationale: fallbackResult.rationale,
        bloomsLevel: fallbackResult.bloomsLevel,
        source: 'pedagogical_engine'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateAI = async (customPlan?: LessonPlan) => {
    const activePlan = customPlan || plan;
    setIsGenerating(true);
    try {
      const promptText = `អ្នកគឺជា «អ្នកជំនាញវិធីសាស្ត្របង្រៀនបឋមសិក្សា (ថ្នាក់ទី១ ដល់ទី៦)» យោងតាមស្តង់ដារក្រសួងអប់រំ យុវជន និងកីឡា និងវិទ្យាស្ថានគរុកោសល្យរាជធានីភ្នំពេញ (TEC)។
ភារកិច្ចរបស់អ្នកគឺរៀបចំកិច្ចតែងការបង្រៀនកម្រិតបឋមសិក្សាឱ្យបានត្រឹមត្រូវតាមក្បួនខ្នាតគរុកោសល្យទំនើប៖

ព័ត៌មានអំពីមេរៀន៖
- មុខវិជ្ជា៖ ${activePlan.subject}
- កម្រិតថ្នាក់៖ ថ្នាក់ទី ${activePlan.grade} (កម្រិតបឋមសិក្សា)
- មេរៀន/សប្តាហ៍៖ ${activePlan.week ? `${activePlan.week} ` : ''}${activePlan.lessonTitle}
- ចំណងជើងរង៖ ${activePlan.subTitle || ''}
- គោលវិធី៖ ${activePlan.approach || 'សិស្សមជ្ឈមណ្ឌល'}
- វិធីសាស្ត្របង្រៀនដែលត្រូវជ្រើសរើស៖ ${activePlan.teachingMethods || activePlan.methodology || 'ម៉ូដែលបង្រៀនបែប 5E (5E Instructional Model)'}
- យុទ្ធវិធីបង្រៀនដែលត្រូវជ្រើសរើស៖ ${activePlan.strategy || 'ការគិត-ចាប់គូ-ចែករំលែក (Think-Pair-Share), ការអនុវត្តផ្ទាល់ (Hands-on Activity)'}
- អត្ថបទមេរៀន / ខ្លឹមសារគោល៖ ${activePlan.lessonContent?.text || ''}

=======================================================
ចំណាំសំខាន់បំផុតទី១ (គរុកោសល្យតាមកម្រិតថ្នាក់ទី១ ដល់ទី៦)៖
- ថ្នាក់ទី ១-២ (Early Primary)៖ ផ្តោតលើសម្ភាររូបី (Concrete Manipulatives), ការរៀនតាមរយៈរូបភាពជាក់ស្តែង, ល្បែងសិក្សា (Educational Games), ការបន្លឺសំឡេង និងការអនុវត្តផ្ទាល់ដៃ។ សកម្មភាពត្រូវខ្លី ងាយយល់ និងសប្បាយរីករាយ។
- ថ្នាក់ទី ៣-៤ (Middle Primary)៖ ផ្តោតលើម៉ូដែល 5E, ការគិត-ចាប់គូ-ចែករំលែក (Think-Pair-Share), ការអនុវត្តផ្ទាល់ (Hands-on Activity), ការដោះស្រាយបញ្ហាគណិតវិទ្យា និងវិទ្យាសាស្ត្រតាមគំរូរូបភាព (Diagrams & Models) ដូចកិច្ចតែងការគំរូវិទ្យាស្ថានគរុកោសល្យរាជធានីភ្នំពេញ (TEC)។
- ថ្នាក់ទី ៥-៦ (Upper Primary)៖ ផ្តោតលើការរៀនតាមបែបរិះរក (IBL), ការដោះស្រាយបញ្ហា (PBL), វិធីសាស្ត្រជីកស (Jigsaw), ការបង្រៀនគ្នាទៅវិញទៅមក, ការវិភាគ និងការទាញសន្និដ្ឋានស៊ីជម្រៅ។

=======================================================
ចំណាំសំខាន់បំផុតទី២ (វត្ថុបំណងមេរៀន និង Bloom's Taxonomy) - STRICT CONSTRAINTS:
សូមបង្កើតវត្ថុបំណងទាំង ៣ (វិជ្ជាសម្បទា, បំណិនសម្បទា, ចរិយាសម្បទា) ដោយផ្អែកលើអត្ថបទមេរៀន និងកម្រិតថ្នាក់ទី ${activePlan.grade}៖
- វត្ថុបំណងនីមួយៗ ត្រូវតែសរសេរតាមរូបមន្ត៖ [កិរិយាសព្ទសកម្មភាព (Action Verb)] + [ខ្លឹមសារ/លក្ខខណ្ឌ] + [កម្រិតរំពឹងទុក/ស្ដង់ដារ]។
- សម្រាប់ "វិជ្ជាសម្បទា" និង "បំណិនសម្បទា" ត្រូវតែផ្ដើមប្រយោគដោយ "Action Verb" ផ្ទាល់ (ឧទាហរណ៍៖ ពន្យល់, រាប់, រៀបរាប់, បង្ហាញ, គណនា, ប្រៀបធៀប...) ដោយមិនត្រូវមានពាក្យ "សិស្ស" នៅពីមុខឡើយ។
  + វិជ្ជាសម្បទា គំរូ៖ "ពន្យល់បានអំពី... តាមរយៈការពិភាក្សា និងការសង្កេតរូបភាព បានត្រឹមត្រូវ។"
  + បំណិនសម្បទា គំរូ៖ "ប្រើប្រាស់រូបគំរូ ឬតារាង ដើម្បីដោះស្រាយ... និងបង្ហាញដំណោះស្រាយបានច្បាស់លាស់ក្រោយចប់មេរៀន។"
  + ចរិយាសម្បទា គំរូ៖ "មានទំនុកចិត្តលើសមត្ថភាពខ្លួន ហ៊ានចូលរួមបញ្ចេញមតិ និងចេះឱ្យតម្លៃគំនិតអ្នកដទៃ។"

=======================================================
ចំណាំសំខាន់បំផុតទី៣ (វិធីសាស្ត្របង្រៀន និងយុទ្ធវិធីក្នុងដំណើរការបង្រៀន ៥ ជំហាន)៖
សូមរៀបចំសកម្មភាពគ្រូ ខ្លឹមសារ និងសកម្មភាពសិស្ស ឱ្យត្រូវតាមវិធីសាស្ត្រដែលបានជ្រើសរើស (${activePlan.teachingMethods || 'ម៉ូដែល 5E'})៖

ប្រសិនបើជា "ម៉ូដែលបង្រៀនបែប 5E" (ដូចគំរូ TEC)៖
- ជំហានទី១ (៣នាទី)៖ ត្រួតពិនិត្យ និងរដ្ឋបាលថ្នាក់ (អវត្តមាន សណ្តាប់ធ្នាប់ អនាម័យ)
- ជំហានទី២ (៥នាទី)៖ កែកិច្ចការចាស់ / រំឭកមេរៀនចាស់ / ផ្សារភ្ជាប់មេរៀនថ្មី
- ជំហានទី៣ (៣០នាទី)៖ មេរៀនថ្មី ត្រូវមាន ៤ ដំណាក់កាលច្បាស់លាស់ដោយប្រើអក្សរ "o " នាំមុខ៖
  o ចូលរួម (Engage)៖ ដាស់អារម្មណ៍សិស្ស ចោទជាសំណួរ ឬល្បែងខ្លីដើម្បីទាក់ទាញចំណាប់អារម្មណ៍
  o ការរុករក (Explore)៖ សិស្សធ្វើសកម្មភាពផ្ទាល់ដៃ រុករក និងដោះស្រាយជាដៃគូ ឬក្រុមតូច (Hands-on / Think-Pair-Share)
  o ពន្យល់ (Explain)៖ តំណាងក្រុមឡើងបង្ហាញដំណោះស្រាយ គ្រូសម្របសម្រួលទាញរកនិយមន័យ ឬខ្លឹមសារគន្លឹះ
  o ពង្រីកគំនិត (Elaborate)៖ ដាក់ស្ថានភាពថ្មី ឬលំហាត់អនុវត្តពង្រីកចំណេះដឹង
- ជំហានទី៤ (៥នាទី)៖ ពង្រឹងពុទ្ធិ / ការវាយតម្លៃ (Evaluate) ដោយមានសន្លឹកកិច្ចការខ្លី ឬសំណួរឆ្លុះបញ្ចាំង
- ជំហានទី៥ (៣នាទី)៖ បណ្តាំផ្ញើ និងកិច្ចការផ្ទះ

ប្រសិនបើជា "វិធីសាស្ត្ររៀនតាមបែបរិះរក (IBL)"៖
- ជំហានទី៣៖ o ការចោទសួរ (Questioning)៖ -> o ការស៊ើបអង្កេត (Investigation)៖ -> o ការបង្កើតគំនិត និងបកស្រាយ (Explanation)៖
- ជំហានទី៤៖ ការឆ្លុះបញ្ចាំង និងវាយតម្លៃ
- ជំហានទី៥៖ បណ្តាំផ្ញើ និងការស្រាវជ្រាវផ្ទះ

ប្រសិនបើជា "វិធីសាស្ត្ររៀនតាមបែបដោះស្រាយបញ្ហា (PBL)"៖
- ជំហានទី៣៖ o កំណត់បញ្ហាជាក់ស្តែង -> o រុករកដំណោះស្រាយរួមគ្នា -> o បកស្រាយ និងទាញសន្និដ្ឋាន
- ជំហានទី៤៖ វាយតម្លៃដំណោះស្រាយ និងប្រសិទ្ធភាព
- ជំហានទី៥៖ បណ្តាំផ្ញើ និងលំហាត់ផ្ទះ

=======================================================
ចំណាំសំខាន់បំផុតទី៥ (ល្បែងសិក្សាសម្រាប់ជំហានទី៤ ស្របតាមវិធីសាស្ត្រ និងយុទ្ធវិធីបង្រៀន)៖
ផ្នែកកិច្ចតែងការបង្រៀនថ្នាក់ទី១ដល់ទី៦៖ ត្រូវដាក់បន្ថែម «ល្បែងសិក្សា» សម្រាប់ដាក់ក្នុងកិច្ចតែងការបង្រៀននៅជំហានទី៤ (ពង្រឹងពុទ្ធិ/ការវាយតម្លៃ)។
អ្នកត្រូវតែវិភាគវិធីសាស្ត្របង្រៀន (${activePlan.teachingMethods || activePlan.methodology || 'ម៉ូដែល 5E'}) និងយុទ្ធវិធីបង្រៀន (${activePlan.strategy || 'ការអនុវត្តផ្ទាល់ / ការគិត-ចាប់គូ-ចែករំលែក'}) ព្រមទាំងមុខវិជ្ជា (${activePlan.subject}) និងកម្រិតថ្នាក់ (ថ្នាក់ទី ${activePlan.grade}) ដើម្បីជ្រើសរើសល្បែងសិក្សាដែលត្រូវគ្នា និងឆ្លើយតបនឹងវត្ថុបំណងមេរៀន (ឧទាហរណ៍៖ ល្បែង «រង្វង់សំណាង ឬ កង់វិលសំណួរ», «បោះបាល់បន្ត ឬ បាល់តន្ត្រី», «ផ្គូផ្គងរូបភាពនិងប័ណ្ណពាក្យ», «ប្រណាំងសរសេរលើក្តារខៀន», «ផ្កាយសំណាង ឬ ប្រអប់អាថ៌កំបាំង», «ប៊ិងហ្គោពាក្យគន្លឹះ», «ដើរមើលវិចិត្រសាល (Gallery Walk Challenge)», «សំបុកកញ្ចាញ់ចេក», «កាតភ្លើងស្តុប»...)។
${activePlan.educationalGame ? `- ល្បែងដែលគ្រូបានកំណត់ជាមុន៖ ${activePlan.educationalGame}` : ''}

សូមប្រគល់ត្រឡប់៖
1. field "educationalGame": "ល្បែង «[ឈ្មោះល្បែង]»"
2. ក្នុង step4 នៃ steps (ជំហានទី៤)៖
   - teacherActivity: "• គ្រូរៀបចំល្បែងសិក្សា៖ «[ឈ្មោះល្បែង]»\\n  - របៀបដឹកនាំល្បែង និងច្បាប់លេង...\\n• គ្រូសម្របសម្រួល និងវាយតម្លៃ..."
   - content: "• ពង្រឹងពុទ្ធិ និងវាយតម្លៃតាមរយៈល្បែង៖ «[ឈ្មោះល្បែង]»\\n  - កម្រងសំណួរ ឬលំហាត់ក្នុងល្បែង...\\n• ការវាយតម្លៃលទ្ធផល..."
   - studentActivity: "• សិស្សចូលរួមលេងល្បែង «[ឈ្មោះល្បែង]» យ៉ាងសកម្ម...\\n  - សកម្មភាពលេង ឬឆ្លើយសំណួរជាក្រុម...\\n• សិស្សចូលរួមឆ្លុះបញ្ចាំង និងផ្ទៀងផ្ទាត់..."

=======================================================
ចំណាំសំខាន់បំផុតទី៦ (រចនាសម្ព័ន្ធ Bullet Points & Parallel Alignment)៖
- ក្នុង String នៃ JSON៖
  + ចំណុចធំ ប្រើ "• "
  + ដំណាក់កាលនៃវិធីសាស្ត្រ ប្រើ "o " (ឧ. "o ចូលរួម (Engage)៖")
  + ចំណុចតូចៗ (Sub-bullets) សូមប្រើ "\\n  - "
- ចំនួនចំណុចធំៗ (•) និងដំណាក់កាល (o) នៅក្រឡោនទាំង ៣ ("teacherActivity", "content", "studentActivity") ក្នុងជំហាននីមួយៗ ត្រូវតែមានចំនួនស្មើគ្នាបេះបិទ ដើម្បីឱ្យជួរតារាងធ្លាក់មកទន្ទឹមគ្នាស្របគ្នាយ៉ាងល្អឥតខ្ចោះ។

សូមត្រលប់មកវិញតែជាទម្រង់ JSON object string ប៉ុណ្ណោះ ដោយមិនមាន markdown formatting (NO \`\`\`json) ហើយស្របតាមទម្រង់ដូចខាងក្រោម៖
{
  "educationalGame": "ល្បែង «[ឈ្មោះល្បែង]»",
  "chapter": "${activePlan.chapter || '១'}",
  "chapterTitle": "${activePlan.chapterTitle || 'ចំណងជើងជំពូក'}",
  "lesson": "${activePlan.lesson || '១'}",
  "objectives": {
    "knowledge": "ពន្យល់បានអំពី... តាមរយៈ... បានត្រឹមត្រូវ។",
    "skills": "ប្រើប្រាស់... ដើម្បីដោះស្រាយ... បានច្បាស់លាស់។",
    "attitude": "មានទំនុកចិត្តលើសមត្ថភាពខ្លួន ហ៊ានចូលរួម និងឱ្យតម្លៃគំនិតអ្នកដទៃ។"
  },
  "materials": {
    "teacher": "សៀវភៅសិក្សាគោល សន្លឹកកិច្ចការ កិច្ចតែងការបង្រៀន សម្ភារឧបទេស...",
    "student": "សៀវភៅសិក្សាគោល សម្ភារៈសិក្សាគ្រប់គ្រាន់ (សៀវភៅ ប៊ិច បន្ទាត់)..."
  },
  "steps": {
    "step1": {
      "teacherActivity": "• ត្រួតពិនិត្យ៖\\n  - អវត្តមាន\\n  - សណ្ដាប់ធ្នាប់\\n  - អនាម័យ",
      "content": "• រដ្ឋបាលថ្នាក់៖\\n  - អវត្តមាន\\n  - សណ្ដាប់ធ្នាប់\\n  - អនាម័យ",
      "studentActivity": "• ប្រធានរាយការណ៍៖\\n  - អវត្តមាន\\n  - សណ្ដាប់ធ្នាប់\\n  - អនាម័យ"
    },
    "step2": {
      "teacherActivity": "• កំណែ៖\\n  - ហៅសិស្សឡើងកែកិច្ចការចាស់\\n• គ្រូសួរ៖\\n  - រំឭកចំណុចសំខាន់ពីមេរៀនមុន\\n• ទំនាក់ទំនងមេរៀនចាស់ទៅថ្មី៖\\n  - ភ្ជាប់សាច់រឿងចូលមេរៀនថ្មី",
      "content": "• កែកិច្ចការផ្ទះ៖\\n  - ពិនិត្យចម្លើយកិច្ចការចាស់\\n• រំឭកមេរៀនចាស់៖\\n  - សំណួរគន្លឹះមេរៀនមុន\\n• ទំនាក់ទំនងមេរៀនចាស់ទៅថ្មី៖\\n  - បង្ហាញចំណងជើងមេរៀនថ្មី",
      "studentActivity": "• កំណែ៖\\n  - សិស្សឡើងកែ និងផ្ទៀងផ្ទាត់\\n• ឆ្លើយសំណួរ៖\\n  - សិស្សចូលរួមឆ្លើយរំឭកមេរៀន\\n• ត្រៀមខ្លួន៖\\n  - សង្កេត និងត្រៀមរៀនមេរៀនថ្មី"
    },
    "step3": {
      "teacherActivity": "...",
      "content": "...",
      "studentActivity": "..."
    },
    "step4": {
      "teacherActivity": "• គ្រូរៀបចំល្បែងសិក្សា៖ «...»\\n  - ...\\n• គ្រូ...",
      "content": "• ពង្រឹងពុទ្ធិ និងវាយតម្លៃតាមរយៈល្បែង៖ «...»\\n  - ...\\n• ...",
      "studentActivity": "• សិស្សចូលរួមលេងល្បែង «...»...\\n  - ...\\n• ..."
    },
    "step5": {
      "teacherActivity": "...",
      "content": "...",
      "studentActivity": "..."
    }
  }
}`;

      const response = await fetch('/api/generateLessonPlan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptText, isJson: true, userApiKey: localStorage.getItem("userGeminiApiKey") || undefined })
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
              // ignore partial chunks
            }
          }
        }
      }
      
      try {
        let cleanedText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
        const match = cleanedText.match(/\{[\s\S]*\}/);
        if (match) {
          cleanedText = match[0];
        }
        let parsed: any = null;
        try {
          parsed = JSON.parse(cleanedText);
        } catch (innerErr) {
          const sanitized = cleanedText.replace(/,\s*([\}\]])/g, '$1');
          parsed = JSON.parse(sanitized);
        }

        if (parsed && (parsed.steps || parsed.objectives)) {
          setPlan(prev => ({
            ...prev,
            educationalGame: parsed.educationalGame || prev.educationalGame,
            chapter: parsed.chapter || prev.chapter,
            chapterTitle: parsed.chapterTitle || prev.chapterTitle,
            lesson: parsed.lesson || prev.lesson,
            lessonTitle: parsed.lessonTitle || prev.lessonTitle,
            teachingMethods: parsed.teachingMethods || prev.teachingMethods,
            strategy: parsed.strategy || prev.strategy,
            objectives: {
              ...prev.objectives,
              ...parsed.objectives
            },
            materials: {
              ...prev.materials,
              ...parsed.materials
            },
            steps: {
              step1: parsed.steps?.step1 || prev.steps.step1,
              step2: parsed.steps?.step2 || prev.steps.step2,
              step3: parsed.steps?.step3 || prev.steps.step3,
              step4: parsed.steps?.step4 || prev.steps.step4,
              step5: parsed.steps?.step5 || prev.steps.step5,
            }
          }));
        } else {
          throw new Error("No structured steps returned");
        }

      } catch (parseError) {
        console.warn("AI parse issue, applying pedagogical fallback:", parseError);
        const titleText = activePlan.lessonTitle || 'មេរៀន';
        const fallback = analyzeLessonPedagogy(
          activePlan.grade,
          activePlan.subject,
          titleText,
          activePlan.chapterTitle,
          activePlan.lessonContent?.text
        );
        setPlan(prev => ({
          ...prev,
          educationalGame: fallback.educationalGame.name,
          teachingMethods: fallback.teachingMethod,
          strategy: fallback.strategyText,
          objectives: fallback.objectives,
          materials: {
            teacher: "សៀវភៅសិក្សាគោល សន្លឹកកិច្ចការ កិច្ចតែងការបង្រៀន រូបភាព និងសម្ភារឧបទេស។",
            student: "សៀវភៅសិក្សាគោល សៀវភៅសរសេរ ប៊ិច ខ្មៅដៃ បន្ទាត់។"
          },
          steps: {
            step1: prev.steps.step1,
            step2: prev.steps.step2,
            step3: {
              teacherActivity: `• ដំណាក់កាលទី១៖ ចូលរួម (Engage)\n  - គ្រូចោទសួរសំណួរដាស់អារម្មណ៍ទាក់ទងនឹង «${titleText}»\n• ដំណាក់កាលទី២៖ រុករក (Explore)\n  - គ្រូដាក់កិច្ចការជាដៃគូឱ្យសិស្សពិភាក្សានិងអនុវត្ត\n• ដំណាក់កាលទី៣៖ ពន្យល់ (Explain)\n  - គ្រូសម្របសម្រួលឱ្យសិស្សឡើងបង្ហាញ និងទាញរកខ្លឹមសារគន្លឹះ`,
              content: `• ដំណាក់កាលទី១៖ ចូលរួម (Engage)\n  - សំណួរដាស់ការគិតអំពី «${titleText}»\n• ដំណាក់កាលទី២៖ រុករក (Explore)\n  - សកម្មភាពរុករក និងដោះស្រាយជាក្រុម\n• ដំណាក់កាលទី៣៖ ពន្យល់ (Explain)\n  - និយមន័យ និងខ្លឹមសារសំខាន់នៃមេរៀន`,
              studentActivity: `• ដំណាក់កាលទី១៖ ចូលរួម (Engage)\n  - សិស្សសង្កេត និងចូលរួមឆ្លើយសំណួរដាស់ការគិត\n• ដំណាក់កាលទី២៖ រុករក (Explore)\n  - សិស្សសហការជាដៃគូ អនុវត្តដោះស្រាយជាក់ស្តែង\n• ដំណាក់កាលទី៣៖ ពន្យល់ (Explain)\n  - តំណាងក្រុមឡើងបង្ហាញ និងកត់ត្រាខ្លឹមសារ`
            },
            step4: fallback.educationalGame.sampleStep4,
            step5: {
              teacherActivity: "• ពង្រឹង និងបណ្តាំផ្ញើ៖\n  - សង្ខេបចំណុចសំខាន់ៗឡើងវិញ\n  - ដាក់កិច្ចការផ្ទះ\n  - ដាស់តឿនឱ្យសិស្សខិតខំរៀនសូត្រ និងថែរក្សាអនាម័យ",
              content: "• បណ្តាំផ្ញើ និងកិច្ចការផ្ទះ៖\n  - កត់ត្រាកិច្ចការផ្ទះ\n  - ការណែនាំបន្ថែម",
              studentActivity: "• យកចិត្តទុកដាក់៖\n  - ចូលរួមសង្ខេបមេរៀន\n  - កត់ត្រាកិច្ចការផ្ទះចូលសៀវភៅ\n  - គោរពតាមបណ្តាំផ្ញើរបស់គ្រូ"
            }
          }
        }));
      } finally {
        setIsGenerating(false);
      }
    } catch (error: any) {
      console.error("AI Generation failed, applying pedagogical fallback:", error);
      const titleText = plan.lessonTitle || 'មេរៀន';
      const fallback = analyzeLessonPedagogy(
        plan.grade,
        plan.subject,
        titleText,
        plan.chapterTitle,
        plan.lessonContent?.text
      );
      setPlan(prev => ({
        ...prev,
        educationalGame: fallback.educationalGame.name,
        teachingMethods: fallback.teachingMethod,
        strategy: fallback.strategyText,
        objectives: fallback.objectives,
        materials: {
          teacher: "សៀវភៅសិក្សាគោល សន្លឹកកិច្ចការ កិច្ចតែងការបង្រៀន រូបភាព និងសម្ភារឧបទេស។",
          student: "សៀវភៅសិក្សាគោល សៀវភៅសរសេរ ប៊ិច ខ្មៅដៃ បន្ទាត់។"
        },
        steps: {
          step1: prev.steps.step1,
          step2: prev.steps.step2,
          step3: {
            teacherActivity: `• ដំណាក់កាលទី១៖ ចូលរួម (Engage)\n  - គ្រូចោទសួរសំណួរដាស់អារម្មណ៍ទាក់ទងនឹង «${titleText}»\n• ដំណាក់កាលទី២៖ រុករក (Explore)\n  - គ្រូដាក់កិច្ចការជាដៃគូឱ្យសិស្សពិភាក្សានិងអនុវត្ត\n• ដំណាក់កាលទី៣៖ ពន្យល់ (Explain)\n  - គ្រូសម្របសម្រួលឱ្យសិស្សឡើងបង្ហាញ និងទាញរកខ្លឹមសារគន្លឹះ`,
            content: `• ដំណាក់កាលទី១៖ ចូលរួម (Engage)\n  - សំណួរដាស់ការគិតអំពី «${titleText}»\n• ដំណាក់កាលទី២៖ រុករក (Explore)\n  - សកម្មភាពរុករក និងដោះស្រាយជាក្រុម\n• ដំណាក់កាលទី៣៖ ពន្យល់ (Explain)\n  - និយមន័យ និងខ្លឹមសារសំខាន់នៃមេរៀន`,
            studentActivity: `• ដំណាក់កាលទី១៖ ចូលរួម (Engage)\n  - សិស្សសង្កេត និងចូលរួមឆ្លើយសំណួរដាស់ការគិត\n• ដំណាក់កាលទី២៖ រុករក (Explore)\n  - សិស្សសហការជាដៃគូ អនុវត្តដោះស្រាយជាក់ស្តែង\n• ដំណាក់កាលទី៣៖ ពន្យល់ (Explain)\n  - តំណាងក្រុមឡើងបង្ហាញ និងកត់ត្រាខ្លឹមសារ`
          },
          step4: fallback.educationalGame.sampleStep4,
          step5: {
            teacherActivity: "• ពង្រឹង និងបណ្តាំផ្ញើ៖\n  - សង្ខេបចំណុចសំខាន់ៗឡើងវិញ\n  - ដាក់កិច្ចការផ្ទះ\n  - ដាស់តឿនឱ្យសិស្សខិតខំរៀនសូត្រ និងថែរក្សាអនាម័យ",
            content: "• បណ្តាំផ្ញើ និងកិច្ចការផ្ទះ៖\n  - កត់ត្រាកិច្ចការផ្ទះ\n  - ការណែនាំបន្ថែម",
            studentActivity: "• យកចិត្តទុកដាក់៖\n  - ចូលរួមសង្ខេបមេរៀន\n  - កត់ត្រាកិច្ចការផ្ទះចូលសៀវភៅ\n  - គោរពតាមបណ្តាំផ្ញើរបស់គ្រូ"
          }
        }
      }));
      setIsGenerating(false);
    }
  };

  
  const handleDownloadPDF = () => {
    setIsDownloadingPdf(true);
    const element = document.getElementById('lesson-plan-preview');
    if (!element) return;
    
    // Add print styling temporarily
    const originalClass = element.className;
    element.className = "bg-white px-[1.5cm] py-[1.5cm] rounded flex flex-col shadow-xl min-h-[297mm] w-[210mm] text-[11pt] leading-relaxed text-slate-800 font-khmer mx-auto";
    
    // hide elements
    const hiddenElements = element.querySelectorAll('.print\\:hidden');
    hiddenElements.forEach(el => el.classList.add('hidden'));

    const opt = {
      margin:       10,
      filename:     `កិច្ចតែងការ_${plan.lessonTitle}.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
    };

    html2pdf().set(opt).from(element).save().then(() => {
        setIsDownloadingPdf(false);
        element.className = originalClass;
        hiddenElements.forEach(el => el.classList.remove('hidden'));
    }).catch(err => {
        console.error("PDF generation failed:", err);
        setIsDownloadingPdf(false);
        element.className = originalClass;
        hiddenElements.forEach(el => el.classList.remove('hidden'));
        alert('មានបញ្ហាក្នុងការទាញយក PDF។');
    });
  };

  const handleExportWord = (exportTitle?: string) => {
    const contentElement = document.getElementById("lesson-plan-preview");
    if (!contentElement) return;

    // We clone the node to clean it up before exporting
    const clone = contentElement.cloneNode(true) as HTMLElement;
    
    // Remove the photo upload buttons or anything with print:hidden if possible
    const hideElements = clone.querySelectorAll('.print\\:hidden');
    hideElements.forEach(el => el.remove());

    const content = clone.innerHTML;

    const preHtml = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>កិច្ចតែងការ</title>
      <style>
        body { font-family: 'Khmer OS Siemreap', 'Moul', sans-serif; font-size: 11pt; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid black; padding: 8px; text-align: left; vertical-align: top; }
        th { font-family: 'Moul', sans-serif; }
        .text-center { text-align: center; }
        .font-bold { font-weight: bold; }
      </style>
    </head>
    <body>`;
    const postHtml = "</body></html>";
    const html = preHtml + content + postHtml;

    const blob = new Blob(['\\ufeff', html], {
      type: 'application/msword'
    });
    const blobUrl = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `កិច្ចតែងការ_${exportTitle || plan.lessonTitle || 'ថ្មី'}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  };

  

  const handleSchoolLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPlan(prev => ({
          ...prev,
          schoolLogo: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const renderFormCard = () => (
    <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-2xl border border-slate-200/80 max-h-[88vh] flex flex-col">
       {/* Form Card Header */}
       <div className="border-b border-slate-100 pb-3 mb-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold shadow-sm shadow-emerald-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-800 font-kantumruy leading-tight flex items-center gap-1.5">
                ផ្ទាំងបំពេញព័ត៌មាន
                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-khmer">
                  កិច្ចតែងការ
                </span>
              </h3>
              <p className="text-[11.5px] text-slate-500 font-khmer mt-0.5">
                បំពេញព័ត៌មានមេរៀនដើម្បីបង្កើតកិច្ចតែងការ (ថ្នាក់ទី {plan.grade} • {plan.subject})
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-black font-khmer border border-emerald-200/80 shadow-2xs">
              ថ្នាក់ទី {plan.grade}
            </span>
            <button
              type="button"
              onClick={() => setShowFillInfoModal(false)}
              className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-all cursor-pointer ml-1"
              title="បិទ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
       </div>

             {/* Tab Navigation */}
             <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100/90 rounded-2xl mb-3 shrink-0 font-khmer">
               <button
                 type="button"
                 onClick={() => setFormTab('info')}
                 className={`py-2 px-1 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                   formTab === 'info'
                     ? 'bg-emerald-600 text-white shadow-sm font-black'
                     : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                 }`}
               >
                 <FileText className="w-3.5 h-3.5" />
                 <span>១. បំពេញព័ត៌មាន</span>
               </button>
               <button
                 type="button"
                 onClick={() => setFormTab('objectives')}
                 className={`py-2 px-1 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                   formTab === 'objectives'
                     ? 'bg-emerald-600 text-white shadow-sm font-black'
                     : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                 }`}
               >
                 <Target className="w-3.5 h-3.5" />
                 <span>២. វត្ថុបំណង</span>
               </button>
               <button
                 type="button"
                 onClick={() => setFormTab('pedagogy')}
                 className={`py-2 px-1 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                   formTab === 'pedagogy'
                     ? 'bg-emerald-600 text-white shadow-sm font-black'
                     : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                 }`}
               >
                 <Gamepad2 className="w-3.5 h-3.5" />
                 <span>៣. វិធី & ល្បែង</span>
               </button>
             </div>

             {/* Tab Content Area (Scrollable) */}
             <div className="space-y-3.5 overflow-y-auto flex-grow pr-1.5 no-scrollbar mb-3">
                 {/* TAB 1: GENERAL INFO & PRESETS */}
                 {formTab === 'info' && (
                   <div className="space-y-3.5 animate-in fade-in duration-200">
                     {/* Date Input with Auto-Fill Button */}
                    <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-3 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 font-khmer">
                          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                          <span>កាលបរិច្ឆេទបង្រៀន</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const today = new Date();
                            const khmerDays = ['អាទិត្យ', 'ចន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហស្បតិ៍', 'សុក្រ', 'សៅរ៍'];
                            const khmerMonths = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];
                            const dayName = khmerDays[today.getDay()];
                            const day = today.getDate();
                            const monthName = khmerMonths[today.getMonth()];
                            const year = today.getFullYear();
                            setPlan(prev => ({
                              ...prev,
                              date: `ថ្ងៃ${dayName} ត្រូវនឹងថ្ងៃទី ${day} ខែ${monthName} ឆ្នាំ ${year}`
                            }));
                          }}
                          className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-white hover:bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg transition-colors font-khmer cursor-pointer shadow-2xs"
                          title="បំពេញកាលបរិច្ឆេទថ្ងៃនេះ"
                        >
                          + ថ្ងៃនេះ
                        </button>
                      </div>
                      <textarea 
                        value={plan.date} 
                        onChange={e => setPlan({...plan, date: e.target.value})} 
                        placeholder="ថ្ងៃ...ខែ...ឆ្នាំ... ត្រូវនឹងថ្ងៃទី...ខែ...ឆ្នាំ..." 
                        rows={2}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-khmer text-xs text-slate-800 resize-none transition-all shadow-2xs leading-relaxed" 
                      />
                    </div>

                    {/* Subject & Grade */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 mb-1.5 block font-khmer">មុខវិជ្ជា</label>
                        <select 
                          value={plan.subject} 
                          onChange={e => {
                            const newSub = e.target.value;
                            setSelectedSubjectTab(newSub.includes('គណិត') ? 'គណិតវិទ្យា' : newSub);
                            const matchedPreset = GRADE_LESSON_PRESETS.find(p => p.grade === plan.grade && p.subject === newSub)
                              || GRADE_LESSON_PRESETS.find(p => p.subject === newSub);
                            if (matchedPreset) {
                              handleSelectGradePreset(matchedPreset.id);
                            } else {
                              setPlan({...plan, subject: newSub});
                            }
                          }} 
                          className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-khmer font-bold text-xs text-slate-800 transition-all shadow-2xs cursor-pointer"
                        >
                          <option value="គណិតវិទ្យា">គណិតវិទ្យា</option>
                          <option value="ភាសាខ្មែរ">ភាសាខ្មែរ</option>
                          <option value="វិទ្យាសាស្ត្រ">វិទ្យាសាស្ត្រ</option>
                          <option value="អប់រំកាយ">អប់រំកាយ (និងកីឡា)</option>
                          <option value="សិក្សាសង្គម">សិក្សាសង្គម</option>
                          <option value="គណិតវិទ្យា (ពង្រឹងចំណេះដឹងមូលដ្ឋាន)">គណិតវិទ្យា (ពង្រឹងមូលដ្ឋាន)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 mb-1.5 block font-khmer">កម្រិតថ្នាក់</label>
                        <select 
                          value={plan.grade} 
                          onChange={e => handleGradeChange(parseInt(e.target.value) as Grade)} 
                          className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-khmer font-bold text-xs text-slate-800 transition-all shadow-2xs cursor-pointer"
                        >
                          {[1, 2, 3, 4, 5, 6].map(g => <option key={g} value={g}>ថ្នាក់ទី {g}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* Lesson & Chapter Info */}
                    <div className="space-y-3 bg-slate-50/70 border border-slate-200/80 rounded-2xl p-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-slate-700 mb-1 block font-khmer">ជំពូកទី</label>
                          <input 
                            type="text" 
                            value={plan.chapter} 
                            onChange={e => setPlan({...plan, chapter: e.target.value})} 
                            placeholder="ឧ. ១" 
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-khmer text-xs text-slate-800 transition-all shadow-2xs" 
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-700 mb-1 block font-khmer">មេរៀនទី</label>
                          <input 
                            type="text" 
                            value={plan.lesson} 
                            onChange={e => setPlan({...plan, lesson: e.target.value})} 
                            placeholder="ឧ. ១" 
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-khmer text-xs text-slate-800 transition-all shadow-2xs" 
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 mb-1 block font-khmer">ចំណងជើងជំពូក</label>
                        <input 
                          type="text" 
                          value={plan.chapterTitle} 
                          onChange={e => setPlan({...plan, chapterTitle: e.target.value})} 
                          placeholder="ឧ. ការស្វាគមន៍" 
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-khmer text-xs text-slate-800 transition-all shadow-2xs" 
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 mb-1 block font-khmer">ចំណងជើងមេរៀន</label>
                        <input 
                          type="text" 
                          value={plan.lessonTitle} 
                          onChange={e => setPlan({...plan, lessonTitle: e.target.value})} 
                          placeholder="ឧ. ការប្រើប្រាស់ពាក្យ..." 
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-khmer text-xs text-slate-800 font-bold transition-all shadow-2xs" 
                        />
                      </div>
                    </div>

                    {/* Duration, Location, Teacher */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1 font-khmer">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>រយៈពេល (នាទី)</span>
                        </label>
                        <input 
                          type="number" 
                          value={plan.duration} 
                          onChange={e => setPlan({...plan, duration: parseInt(e.target.value) || 40})} 
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-khmer text-xs text-slate-800 transition-all shadow-2xs" 
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1 font-khmer">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          <span>ទីកន្លែង</span>
                        </label>
                        <input 
                          type="text" 
                          value={plan.location || ''} 
                          onChange={e => setPlan({...plan, location: e.target.value})} 
                          placeholder="បន្ទប់សិក្សា..." 
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-khmer text-xs text-slate-800 transition-all shadow-2xs" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1 font-khmer">
                          <User className="w-3.5 h-3.5 text-indigo-600" />
                          <span>បង្រៀនដោយ (គ្រូបង្រៀន)</span>
                        </label>
                        <input 
                          type="text" 
                          value={plan.taughtBy || ''} 
                          onChange={e => setPlan({...plan, taughtBy: e.target.value})} 
                          placeholder="ឈ្មោះគ្រូបង្រៀន..." 
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-khmer text-xs font-bold text-indigo-800 transition-all shadow-2xs" 
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1 font-khmer">
                          <School className="w-3.5 h-3.5 text-emerald-600" />
                          <span>ឈ្មោះសាលារៀន</span>
                        </label>
                        <input 
                          type="text" 
                          value={localStorage.getItem('user_school') || 'សាលាបឋមសិក្សាព្រែកទាល់'} 
                          onChange={e => {
                            localStorage.setItem('user_school', e.target.value);
                            setPlan({...plan});
                          }} 
                          placeholder="ឈ្មោះសាលារៀន..." 
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-khmer text-xs text-slate-800 transition-all shadow-2xs" 
                        />
                      </div>
                    </div>

                    {/* Lesson Content / Summary Input */}
                    <div className="bg-emerald-50/40 border border-emerald-200/80 rounded-2xl p-3 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 font-khmer">
                          <FileText className="w-3.5 h-3.5 text-emerald-600" />
                          <span>ខ្លឹមសារមេរៀនសង្ខេប / ចំណុចសំខាន់ៗ</span>
                        </label>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold font-khmer">
                          សម្រាប់ AI បង្កើតកិច្ចតែងការ
                        </span>
                      </div>
                      <textarea 
                        value={plan.lessonContent?.text || ''} 
                        onChange={e => setPlan({...plan, lessonContent: {...plan.lessonContent, text: e.target.value}})} 
                        placeholder="បញ្ចូលខ្លឹមសារសង្ខេប លំហាត់ ឬចំណុចសំខាន់ៗនៃមេរៀនដែលត្រូវបង្រៀន..." 
                        rows={2}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-khmer text-xs text-slate-800 resize-none transition-all shadow-2xs leading-relaxed" 
                      />
                    </div>
                  </div>
                )}

                {/* TAB 2: CONTENT & OBJECTIVES */}
                {formTab === 'objectives' && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    {/* Lesson Content with AI Analysis */}
                    <div className="bg-slate-50/60 border border-slate-200 rounded-2xl p-3.5">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 font-khmer">
                          <FileText className="w-3.5 h-3.5 text-emerald-600" />
                          <span>អត្ថបទមេរៀន / ខ្លឹមសារសង្ខេប</span>
                        </label>
                        <button 
                          type="button"
                          onClick={handleAnalyzeLesson}
                          disabled={isAnalyzing}
                          title="ជំនួយដោយ AI ក្នុងការវិភាគវិធីសាស្ត្រ យុទ្ធវិធី វត្ថុបំណង និងល្បែងសិក្សា"
                          className="text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all shadow-sm active:scale-95 disabled:opacity-50 font-khmer cursor-pointer"
                        >
                          {isAnalyzing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Lightbulb className="w-3.5 h-3.5" />}
                          <span>{isAnalyzing ? 'កំពុងវិភាគ...' : 'AI វិភាគមេរៀន'}</span>
                        </button>
                      </div>
                      <textarea 
                        value={plan.lessonContent?.text || ''} 
                        onChange={e => setPlan({...plan, lessonContent: {...plan.lessonContent, text: e.target.value}})} 
                        placeholder="បញ្ចូលអត្ថបទមេរៀនសង្ខេប ឬចំណងជើងមេរៀន ដើម្បីឱ្យ AI ជួយវិភាគវិធីសាស្ត្រ យុទ្ធវិធី វត្ថុបំណង និងល្បែងសិក្សា..." 
                        rows={3}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-khmer text-xs text-slate-800 transition-all shadow-2xs" 
                      />

                      {/* Analysis Result Banner */}
                      {analysisFeedback && (
                        <motion.div 
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-3 p-3.5 bg-gradient-to-r from-amber-50/90 to-emerald-50/90 border border-emerald-200 rounded-2xl shadow-xs space-y-2 font-khmer text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span>បានវិភាគមេរៀនជោគជ័យ</span>
                            </div>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                              {analysisFeedback.source === 'ai' ? 'AI Generator' : 'Pedagogical Engine'}
                            </span>
                          </div>

                          <div className="bg-white/90 p-2.5 rounded-xl border border-emerald-100 text-slate-700 leading-relaxed text-[11.5px]">
                            <p className="font-bold text-slate-800 mb-0.5">💡 ការវិភាគគរុកោសល្យ៖</p>
                            <p className="text-slate-600">{analysisFeedback.rationale}</p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
                            <div className="bg-white/90 p-2 rounded-xl border border-emerald-100">
                              <span className="font-bold text-slate-700 block text-[11px]">🎯 វិធីសាស្ត្រ៖</span>
                              <span className="text-emerald-800 font-semibold">{analysisFeedback.method}</span>
                            </div>
                            <div className="bg-white/90 p-2 rounded-xl border border-emerald-100">
                              <span className="font-bold text-slate-700 block text-[11px]">🎮 ល្បែងសិក្សា៖</span>
                              <span className="text-purple-800 font-semibold">{analysisFeedback.game}</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Three Objectives Section */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-black text-slate-800 flex items-center gap-1.5 font-khmer">
                          <Target className="w-4 h-4 text-emerald-600" />
                          <span>វត្ថុបំណងមេរៀនទាំង ៣ (Objectives)</span>
                        </label>
                        <span className="text-[10px] text-slate-400 font-khmer">កែសម្រួលបានតាមតម្រូវការ</span>
                      </div>

                      {/* 1. Knowledge */}
                      <div className="bg-sky-50/50 border border-sky-200/80 rounded-2xl p-3 space-y-1.5">
                        <label className="text-xs font-bold text-sky-900 flex items-center gap-1.5 font-khmer">
                          <span className="w-5 h-5 rounded-lg bg-sky-500 text-white flex items-center justify-center text-[11px] font-black">១</span>
                          <span>វិជ្ជាសម្បទា (Knowledge)</span>
                        </label>
                        <textarea
                          value={plan.objectives.knowledge}
                          onChange={e => setPlan({...plan, objectives: {...plan.objectives, knowledge: e.target.value}})}
                          rows={2}
                          className="w-full px-3 py-2 bg-white border border-sky-200 rounded-xl text-xs font-khmer text-slate-800 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-all resize-none shadow-2xs"
                        />
                      </div>

                      {/* 2. Skills */}
                      <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-3 space-y-1.5">
                        <label className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 font-khmer">
                          <span className="w-5 h-5 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-[11px] font-black">២</span>
                          <span>បំណិនសម្បទា (Skills)</span>
                        </label>
                        <textarea
                          value={plan.objectives.skills}
                          onChange={e => setPlan({...plan, objectives: {...plan.objectives, skills: e.target.value}})}
                          rows={2}
                          className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-xl text-xs font-khmer text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-none shadow-2xs"
                        />
                      </div>

                      {/* 3. Attitude */}
                      <div className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-3 space-y-1.5">
                        <label className="text-xs font-bold text-amber-900 flex items-center gap-1.5 font-khmer">
                          <span className="w-5 h-5 rounded-lg bg-amber-500 text-white flex items-center justify-center text-[11px] font-black">៣</span>
                          <span>ចរិយាសម្បទា (Attitude)</span>
                        </label>
                        <textarea
                          value={plan.objectives.attitude}
                          onChange={e => setPlan({...plan, objectives: {...plan.objectives, attitude: e.target.value}})}
                          rows={2}
                          className="w-full px-3 py-2 bg-white border border-amber-200 rounded-xl text-xs font-khmer text-slate-800 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all resize-none shadow-2xs"
                        />
                      </div>
                    </div>

                    {/* Materials */}
                    <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-3.5 space-y-3">
                      <span className="text-xs font-black text-slate-800 block font-khmer">សម្ភារឧបទេស</span>
                      <div className="space-y-2">
                        <div>
                          <label className="text-[11px] font-bold text-slate-600 mb-1 block font-khmer">
                            សម្ភារសម្រាប់គ្រូ៖
                          </label>
                          <input
                            type="text"
                            value={plan.materials.teacher}
                            onChange={e => setPlan({...plan, materials: {...plan.materials, teacher: e.target.value}})}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-khmer text-slate-800 focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-600 mb-1 block font-khmer">
                            សម្ភារសម្រាប់សិស្ស៖
                          </label>
                          <input
                            type="text"
                            value={plan.materials.student}
                            onChange={e => setPlan({...plan, materials: {...plan.materials, student: e.target.value}})}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-khmer text-slate-800 focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: PEDAGOGY & GAMES */}
                {formTab === 'pedagogy' && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    {/* Teaching Methods */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-slate-800 font-khmer">
                          វិធីសាស្រ្តបង្រៀន (Teaching Methods)
                        </label>
                        <button 
                          type="button"
                          onClick={() => setShowGlossary(true)}
                          className="text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors font-khmer cursor-pointer"
                          title="ស្វែងយល់ពីវិធីសាស្ត្រ"
                        >
                          <BookOpen className="w-3 h-3" />
                          <span>ស្វែងយល់លម្អិត</span>
                        </button>
                      </div>
                      <details className="group relative">
                        <summary className="w-full px-3.5 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl cursor-pointer list-none font-khmer text-xs flex justify-between items-center transition-colors hover:bg-white focus:ring-2 focus:ring-emerald-500 outline-none shadow-2xs">
                          <span className="truncate mr-3 text-slate-800 font-semibold">
                            {plan.teachingMethods ? plan.teachingMethods : <span className="text-slate-400 font-normal">-- ជ្រើសរើសវិធីសាស្ត្រ --</span>}
                          </span>
                          <svg className="fill-current h-4 w-4 shrink-0 text-slate-400 group-open:rotate-180 transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </summary>
                        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto overflow-x-hidden p-2">
                           {TEACHING_METHODS.map(method => {
                             const currentMethods = plan.teachingMethods ? plan.teachingMethods.split(', ') : [];
                             const isSelected = currentMethods.includes(method);
                             return (
                               <label
                                 key={method}
                                 className="px-2.5 py-2 hover:bg-slate-50 cursor-pointer flex items-start gap-2.5 font-khmer text-xs rounded-lg transition-colors border-b border-slate-50 last:border-0"
                               >
                                 <input
                                   type="checkbox"
                                   checked={isSelected}
                                   onChange={(e) => {
                                     let newMethods = [...currentMethods];
                                     if (e.target.checked) {
                                       newMethods.push(method);
                                     } else {
                                       newMethods = newMethods.filter(m => m !== method);
                                     }
                                     setPlan({...plan, teachingMethods: newMethods.join(', ')});
                                   }}
                                   className="mt-0.5 w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 bg-white shadow-2xs cursor-pointer"
                                 />
                                 <span className={`flex-1 ${isSelected ? 'text-emerald-700 font-bold' : 'text-slate-700'}`}>{method}</span>
                               </label>
                             );
                           })}
                        </div>
                      </details>
                    </div>

                    {/* Teaching Strategies */}
                    <div>
                      <label className="text-xs font-bold text-slate-800 mb-1.5 block font-khmer">
                        យុទ្ធវិធីបង្រៀន (Teaching Strategies)
                      </label>
                      <details className="group relative">
                        <summary className="w-full px-3.5 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl cursor-pointer list-none font-khmer text-xs flex justify-between items-center transition-colors hover:bg-white focus:ring-2 focus:ring-emerald-500 outline-none shadow-2xs">
                          <span className="truncate mr-3 text-slate-800 font-semibold">
                            {plan.strategy ? plan.strategy : <span className="text-slate-400 font-normal">-- ជ្រើសរើសយុទ្ធវិធី --</span>}
                          </span>
                          <svg className="fill-current h-4 w-4 shrink-0 text-slate-400 group-open:rotate-180 transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </summary>
                        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto overflow-x-hidden p-2">
                           {TEACHING_STRATEGIES.map(strategy => {
                             const currentStrategies = plan.strategy ? plan.strategy.split(', ') : [];
                             const isSelected = currentStrategies.includes(strategy);
                             return (
                               <label
                                 key={strategy}
                                 className="px-2.5 py-2 hover:bg-slate-50 cursor-pointer flex items-start gap-2.5 font-khmer text-xs rounded-lg transition-colors border-b border-slate-50 last:border-0"
                               >
                                 <input
                                   type="checkbox"
                                   checked={isSelected}
                                   onChange={(e) => {
                                     let newStrategies = [...currentStrategies];
                                     if (e.target.checked) {
                                       newStrategies.push(strategy);
                                     } else {
                                       newStrategies = newStrategies.filter(s => s !== strategy);
                                     }
                                     setPlan({...plan, strategy: newStrategies.join(', ')});
                                   }}
                                   className="mt-0.5 w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 bg-white shadow-2xs cursor-pointer"
                                 />
                                 <span className={`flex-1 ${isSelected ? 'text-emerald-700 font-bold' : 'text-slate-700'}`}>{strategy}</span>
                               </label>
                             );
                           })}
                        </div>
                      </details>
                    </div>

                    {/* Educational Game Section for Step 4 */}
                    <div className="border border-emerald-200 bg-emerald-50/50 rounded-2xl p-3.5 space-y-2.5 shadow-xs">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-black text-emerald-950 uppercase tracking-wider flex items-center gap-1.5 font-khmer">
                          <Gamepad2 className="w-4 h-4 text-emerald-600" />
                          <span>ល្បែងសិក្សាសម្រាប់ជំហានទី៤</span>
                        </label>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full font-khmer">
                          ពង្រឹងពុទ្ធិ
                        </span>
                      </div>

                      <input
                        type="text"
                        value={plan.educationalGame || ''}
                        onChange={e => setPlan({ ...plan, educationalGame: e.target.value })}
                        placeholder="ឈ្មោះល្បែងសិក្សា (ឧ. ល្បែង «រង្វង់សំណាង»)..."
                        className="w-full px-3.5 py-2.5 bg-white border border-emerald-200 rounded-xl text-xs font-khmer font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                      />

                      <div className="flex items-center gap-2 pt-0.5">
                        <button
                          type="button"
                          onClick={handleAIGenerateGame}
                          disabled={isAnalyzingGame}
                          title="វិភាគវិធីសាស្ត្រ និងយុទ្ធវិធី ដើម្បីជ្រើសរើសល្បែងដោយ AI"
                          className="flex-1 py-2 px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold font-khmer flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
                        >
                          {isAnalyzingGame ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Sparkles className="w-3.5 h-3.5" />
                          )}
                          <span>{isAnalyzingGame ? 'កំពុងវិភាគ...' : 'AI វិភាគ & ជ្រើសរើសល្បែង'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowGameModal(true)}
                          title="បើកបណ្ណាល័យល្បែងសិក្សាគរុកោសល្យ"
                          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold font-khmer flex items-center gap-1.5 shadow-xs transition-all active:scale-95 shrink-0 cursor-pointer"
                        >
                          <Gamepad2 className="w-3.5 h-3.5" />
                          <span>បណ្ណាល័យល្បែង</span>
                        </button>
                      </div>

                      {gameAnalysisRationale && (
                        <div className="bg-amber-100/70 border border-amber-300/80 rounded-xl p-2.5 text-[11px] text-amber-900 font-khmer leading-relaxed animate-in fade-in duration-300">
                          <div className="font-bold flex items-center gap-1 mb-0.5 text-amber-950">
                            <Sparkles className="w-3 h-3 text-amber-700" />
                            ការវិភាគគរុកោសល្យ៖
                          </div>
                          <p>{gameAnalysisRationale}</p>
                        </div>
                      )}
                    </div>

                    {/* SubTitle */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1.5 block font-khmer">ចំណងជើងរង (បើមាន)</label>
                      <input 
                        type="text" 
                        value={plan.subTitle} 
                        onChange={e => setPlan({...plan, subTitle: e.target.value})} 
                        placeholder="ចំណងជើងរង (បើមាន)..." 
                        className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 font-khmer text-xs" 
                      />
                    </div>

                    {/* References */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1.5 block font-khmer">ឯកសារយោង</label>
                      <input 
                        type="text" 
                        value={plan.references || ''} 
                        onChange={e => setPlan({...plan, references: e.target.value})} 
                        placeholder="ឧ. សៀវភៅពុម្ព..." 
                        className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 font-khmer text-xs" 
                      />
                    </div>

                    {/* School Logo */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1.5 block font-khmer">ឡូហ្គូសាលា (បើមាន)</label>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleSchoolLogoUpload} 
                        className="w-full px-3 py-2 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 font-khmer text-xs cursor-pointer" 
                      />
                    </div>
                  </div>
                )}
             </div>

             {/* Bottom Actions Area */}
             <div className="shrink-0 pt-2 border-t border-slate-100 space-y-2">
                {/* Stepper Navigation */}
                <div className="flex items-center justify-between gap-2 font-khmer">
                  {formTab !== 'info' ? (
                    <button
                      type="button"
                      onClick={() => setFormTab(formTab === 'pedagogy' ? 'objectives' : 'info')}
                      className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
                    >
                      ← ត្រឡប់ក្រោយ
                    </button>
                  ) : <div />}

                  {formTab !== 'pedagogy' && (
                    <button
                      type="button"
                      onClick={() => setFormTab(formTab === 'info' ? 'objectives' : 'pedagogy')}
                      className="px-3.5 py-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl flex items-center gap-1 transition-all ml-auto cursor-pointer"
                    >
                      <span>{formTab === 'info' ? 'បន្តទៅ វត្ថុបំណង' : 'បន្តទៅ វិធី & ល្បែង'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2 pt-1 font-khmer">
                  <button
                    type="button"
                    onClick={() => setShowFillInfoModal(false)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-all cursor-pointer"
                  >
                    បិទ
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowFillInfoModal(false)}
                      className="px-4 py-2.5 bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <Check className="w-4 h-4" />
                      <span>អនុវត្តព័ត៌មាន</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowFillInfoModal(false);
                        handleGenerateAI();
                      }}
                      disabled={isGenerating}
                      className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-black text-xs shadow-md shadow-emerald-500/25 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                      {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
                      <span>{isGenerating ? 'កំពុងបង្កើត...' : 'បង្កើតកិច្ចតែងការ (AI)'}</span>
                    </button>
                  </div>
                </div>
             </div>
          </div>
  );

  const renderPreviewContent = () => (
    <div id="lesson-plan-preview" className="bg-white px-[1.5cm] py-[1.5cm] rounded flex flex-col shadow-xl min-h-[297mm] w-full max-w-[210mm] print:shadow-none print:rounded-none print:p-0 print:w-[210mm] mx-auto">
              <div className="flex justify-between items-start mb-8">
                 {/* Left: Ministry Logo & School Name */}
                 <div className="flex flex-col items-center justify-center text-center">
                    <img 
                      src={plan.schoolLogo || "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/MoEYS_Logo.svg/240px-MoEYS_Logo.svg.png"} 
                      alt="School Logo" 
                      className="w-16 h-16 object-contain mb-2" 
                    />
                    <h2 className="text-[11pt] font-moul text-black">
                       {localStorage.getItem('user_school') || 'សាលាបឋមសិក្សាព្រែកទាល់'}
                    </h2>
                 </div>
                 
                 {/* Right: Nation, Religion, King */}
                 <div className="flex flex-col items-center">
                    <h2 className="text-[12pt] font-moul text-blue-800">ព្រះរាជាណាចក្រកម្ពុជា</h2>
                    <h2 className="text-[12pt] font-moul text-blue-800 mt-1">ជាតិ សាសនា ព្រះមហាក្សត្រ</h2>
                 </div>
              </div>
              <div className="border-b border-slate-200 pb-4 mb-6 text-center space-y-2">
                 <h1 className="text-xl md:text-2xl font-moul text-red-600">កិច្ចតែងការបង្រៀន</h1>
              </div>

              <div className="mb-6 font-khmer text-sm md:text-[11pt] leading-relaxed text-slate-800">
                 <ul className="list-disc pl-5 space-y-2">
                    <li><span className="font-bold">កាលបរិច្ឆេទ៖</span> {plan.date}</li>
                    <li><span className="font-bold">មុខវិជ្ជា៖</span> {plan.subject}</li>
                    <li><span className="font-bold">កម្រិតថ្នាក់៖</span> ថ្នាក់ទី {plan.grade}</li>
                    {plan.week && <li><span className="font-bold">សប្តាហ៍ទី៖</span> {plan.week}</li>}
                    <li><span className="font-bold">គោលវិធី៖</span> {plan.approach || 'សិស្សមជ្ឈមណ្ឌល'}</li>
                    <li><span className="font-bold">ជំពូកទី {plan.chapter}៖</span> {plan.chapterTitle}</li>
                    <li>
                       <span className="font-bold">មេរៀនទី {plan.lesson}៖</span> {plan.lessonTitle}
                    </li>
                    {plan.subTitle && <li><span className="font-bold">ចំណងជើងរង៖</span> {plan.subTitle}</li>}
                    <li><span className="font-bold">រយៈពេល៖</span> {plan.duration} នាទី</li>
                    <li><span className="font-bold">ឯកសារ៖</span> {plan.references}</li>
                    <li><span className="font-bold">វិធីសាស្ត្របង្រៀន៖</span> {plan.teachingMethods}</li>
                    <li><span className="font-bold">យុទ្ធវិធីបង្រៀន៖</span> {plan.strategy}</li>
                    {plan.educationalGame && (
                      <li className="text-emerald-900"><span className="font-bold text-slate-800">ល្បែងសិក្សា (ជំហានទី៤)៖</span> <span className="font-bold text-emerald-700">{plan.educationalGame}</span></li>
                    )}
                    <li><span className="font-bold">ទីកន្លែង៖</span> {plan.location}</li>
                    <li><span className="font-bold">បង្រៀនដោយ៖</span> {plan.taughtBy}</li>
                 </ul>
              </div>

              <div className="flex-grow space-y-8 print:overflow-visible print:max-h-none print:pr-0">
                 <section className="space-y-4">
                    <h4 className="text-lg font-moul text-slate-800">
                       ១. វត្ថុបំណងមេរៀន
                    </h4>
                    <div className="font-khmer text-[11pt] text-slate-800 leading-relaxed">
                       <ul className="list-disc pl-8 space-y-2">
                          <li><span className="font-bold">វិជ្ជាសម្បទា៖</span> {plan.objectives.knowledge || '...'}</li>
                          <li><span className="font-bold">បំណិនសម្បទា៖</span> {plan.objectives.skills || '...'}</li>
                          <li><span className="font-bold">ចរិយាសម្បទា៖</span> {plan.objectives.attitude || '...'}</li>
                       </ul>
                    </div>
                 </section>

                 <section className="space-y-4">
                    <h4 className="text-lg font-moul text-slate-800">
                       ២. សម្ភារបង្រៀន
                    </h4>
                    <div className="font-khmer text-[11pt] text-slate-800 leading-relaxed">
                       <ul className="list-disc pl-8 space-y-2">
                          <li><span className="font-bold">សម្រាប់គ្រូ៖</span> {plan.materials.teacher || '...'}</li>
                          <li><span className="font-bold">សម្រាប់សិស្ស៖</span> {plan.materials.student || '...'}</li>
                       </ul>
                    </div>
                 </section>

                 <section className="space-y-4">
                    <h4 className="text-lg font-moul text-slate-800">
                       ៣. ដំណើរបង្រៀន
                    </h4>
                    <div className="overflow-hidden border border-slate-200 rounded-xl">
                       <table className="w-full text-left border-collapse">
                          <thead>
                             <tr className="bg-slate-100 text-blue-800 font-bold font-khmer text-[12pt]">
                                <th className="border-b border-r border-slate-200 p-3 w-1/3 text-center">សកម្មភាពគ្រូ</th>
                                <th className="border-b border-r border-slate-200 p-3 w-1/3 text-center">ខ្លឹមសារមេរៀន</th>
                                <th className="border-b border-slate-200 p-3 w-1/3 text-center">សកម្មភាពសិស្ស</th>
                             </tr>
                          </thead>
                          <tbody className="text-sm font-khmer text-slate-800">
                             {Object.entries(plan.steps).map(([key, step], idx) => {
                                const tBlocks = parseBlocks(step.teacherActivity);
                                const cBlocks = parseBlocks(step.content);
                                const sBlocks = parseBlocks(step.studentActivity);
                                const maxBlocks = Math.max(tBlocks.length, cBlocks.length, sBlocks.length, 1);

                                return (
                                <React.Fragment key={key}>
                                   <tr className="bg-blue-50">
                                      <td colSpan={3} className="border-b border-slate-200 p-2 font-bold text-center text-blue-800">
                                         ជំហានទី {idx + 1} {idx === 3 && plan.educationalGame ? ` - ${plan.educationalGame}` : ''}
                                      </td>
                                   </tr>
                                   {Array.from({length: maxBlocks}).map((_, bIdx) => {
                                      const isLast = bIdx === maxBlocks - 1;
                                      return (
                                       <tr key={`${key}-${bIdx}`}>
                                          <td className={`border-r border-slate-200 p-3 align-top ${isLast ? 'border-b' : ''}`}>
                                             {tBlocks[bIdx] ? renderBulletedList(tBlocks[bIdx].join('\n')) : (bIdx === 0 && (!step.teacherActivity || step.teacherActivity === '...') ? '...' : null)}
                                          </td>
                                          <td className={`border-r border-slate-200 p-3 align-top ${isLast ? 'border-b' : ''}`}>
                                             {cBlocks[bIdx] ? renderBulletedList(cBlocks[bIdx].join('\n')) : (bIdx === 0 && (!step.content || step.content === '...') ? '...' : null)}
                                          </td>
                                          <td className={`border-slate-200 p-3 align-top ${isLast ? 'border-b' : ''}`}>
                                             {sBlocks[bIdx] ? renderBulletedList(sBlocks[bIdx].join('\n')) : (bIdx === 0 && (!step.studentActivity || step.studentActivity === '...') ? '...' : null)}
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
                 </section>

                 {/* Signatures */}
                 <div className="mt-8 pt-4 grid grid-cols-2 text-center font-khmer text-[11pt] leading-relaxed break-inside-avoid">
                    <div>
                       <p className="font-bold">បានឃើញ និងឯកភាព</p>
                       <p className="text-slate-700 font-bold mt-1">នាយកសាលា / គ្រូឧទ្ទេស</p>
                       <div className="h-16 flex items-center justify-center">
                          <span className="text-slate-300">..............................</span>
                       </div>
                       <p className="font-bold">{plan.evaluatorTeacher || '....................................'}</p>
                    </div>
                    <div>
                       <p className="italic">{plan.date?.split('\n')[0] || 'ថ្ងៃទី.......ខែ.......ឆ្នាំ២០២...'}</p>
                       <p className="text-slate-700 font-bold mt-1">គ្រូបង្រៀន</p>
                       <div className="h-16 flex items-center justify-center">
                          <span className="text-slate-300">..............................</span>
                       </div>
                       <p className="font-bold">{plan.taughtBy || plan.preparedBy || '....................................'}</p>
                    </div>
                 </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-50 flex justify-end gap-3 print:hidden flex-wrap">
                 <button onClick={() => setWorksheetType('student')} className="px-6 py-3 bg-sky-50 text-sky-600 rounded-xl font-bold flex items-center gap-2 hover:bg-sky-100 transition-all mr-auto">
                    <Sparkles className="w-5 h-5 pointer-events-none" /> សន្លឹកកិច្ចការសិស្ស
                 </button>
                 <button onClick={() => setWorksheetType('teacher')} className="px-6 py-3 bg-rose-50 text-rose-600 rounded-xl font-bold flex items-center gap-2 hover:bg-rose-100 transition-all mr-auto">
                    <Sparkles className="w-5 h-5 pointer-events-none" /> សន្លឹកកិច្ចការគ្រូ
                 </button>
                 <button onClick={() => setShowSlideGenerator(true)} className="px-6 py-3 bg-violet-50 text-violet-600 rounded-xl font-bold flex items-center gap-2 hover:bg-violet-100 transition-all mr-auto">
                    <Presentation
  className="w-5 h-5" /> បង្កើតស្លាយមេរៀន
                 </button>
                 <button onClick={() => handleExportWord()} className="px-6 py-3 bg-blue-50 text-blue-600 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-100 transition-all">
                    <FileDown className="w-5 h-5" /> ទាញយកជា Word (DOC)
                 </button>
                 <button onClick={handleDownloadPDF} className="px-6 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-200 transition-all">
                    {isDownloadingPdf ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />} {isDownloadingPdf ? 'កំពុងទាញយក...' : 'ទាញយកជា PDF'}
                 </button>
                 <button onClick={() => {
                   setPlan(INITIAL_PLAN);
                   localStorage.removeItem('saved_lesson_plan_draft');
                 }} className="px-6 py-3 bg-rose-50 text-rose-600 rounded-xl font-bold flex items-center gap-2 hover:bg-rose-100 transition-all">
                    លុប
                 </button>
                 <button onClick={() => {
                   localStorage.setItem('saved_lesson_plan_draft', JSON.stringify(plan));
                   setIsSaving(true);
                   setTimeout(() => setIsSaving(false), 2000);
                 }} disabled={isSaving} className={`px-6 py-3 text-white rounded-xl font-black flex items-center gap-2 shadow-lg hover:bg-indigo-700 transition-all ${isSaving ? 'bg-indigo-400 shadow-indigo-50' : 'bg-indigo-600 shadow-indigo-100'}`}>
                    <Save className="w-5 h-5" /> {isSaving ? 'បានរក្សាទុក' : 'រក្សាទុក'}
                 </button>
              </div>
           </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="print:hidden space-y-3">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-bold transition-colors cursor-pointer text-sm font-khmer"
        >
          <ChevronLeft className="w-5 h-5" /> ត្រឡប់ក្រោយ
        </button>

        {/* Toolbar Banner matching user uploaded image */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-sm shadow-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 max-w-[210mm] w-full mx-auto">
          <div className="flex items-center gap-3 font-khmer">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#d1fae5]/80 text-[#059669] flex items-center justify-center shrink-0 border border-emerald-200/60 shadow-2xs">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 font-kantumruy leading-tight">
                កិច្ចតែងការបង្រៀន
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end md:self-center">
            <button
              type="button"
              onClick={() => setShowFillInfoModal(true)}
              className="px-5 sm:px-6 py-2.5 bg-[#00875a] hover:bg-[#007048] text-white rounded-full font-bold font-khmer text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <PenLine className="w-4 h-4 text-emerald-200 stroke-[2.2]" />
              <span>បំពេញព័ត៌មាន</span>
            </button>
            <button
              type="button"
              onClick={() => setShowSamplePlansModal(true)}
              className="px-5 sm:px-6 py-2.5 bg-[#f59e0b] hover:bg-[#d97706] text-white rounded-full font-bold font-khmer text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-100 stroke-[2.2]" />
              <span>គំរូកិច្ចតែងការបង្រៀន</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lesson Plan A4 Preview */}
      <div className="bg-slate-100/80 p-3 sm:p-6 md:p-8 rounded-[2.5rem] flex justify-center print:bg-transparent print:p-0 transition-all duration-300 w-full">
        {renderPreviewContent()}
      </div>

      {/* Modal Dialog (ផ្ទាំងបំពេញព័ត៌មានកិច្ចតែងការ) */}
      <AnimatePresence>
        {showFillInfoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl my-auto"
            >
              {renderFormCard()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <TeachingGlossaryModal 
        isOpen={showGlossary} 
        onClose={() => setShowGlossary(false)} 
      />
      {worksheetType && (
        <WorksheetModal
          isOpen={true}
          onClose={() => setWorksheetType(null)}
          plan={plan}
          type={worksheetType}
        />
      )}
      <SlideGeneratorModal
        isOpen={showSlideGenerator}
        onClose={() => setShowSlideGenerator(false)}
        plan={plan}
      />
      <EducationalGameModal
        isOpen={showGameModal}
        onClose={() => setShowGameModal(false)}
        currentGrade={plan.grade}
        currentSubject={plan.subject}
        currentMethodology={plan.teachingMethods || plan.methodology}
        currentStrategy={plan.strategy}
        selectedGameName={plan.educationalGame}
        onSelectGame={handleSelectGame}
        onAIAnalyzeGame={handleAIGenerateGame}
        isAnalyzingAI={isAnalyzingGame}
      />
      <SampleLessonPlansModal
        isOpen={showSamplePlansModal}
        onClose={() => setShowSamplePlansModal(false)}
        currentGrade={plan.grade}
        currentSubject={plan.subject}
        onSelectPreset={(presetId) => {
          handleSelectGradePreset(presetId);
        }}
        onSelectAndGenerateAI={(presetId) => {
          handleSelectGradePreset(presetId);
          const sel = GRADE_LESSON_PRESETS.find(p => p.id === presetId);
          if (sel?.plan) {
            handleGenerateAI({ ...plan, ...sel.plan });
          } else {
            handleGenerateAI();
          }
        }}
        onGenerateCustomAI={(grade, subject, topic) => {
          setPlan(prev => ({
            ...prev,
            grade,
            subject,
            lessonTitle: topic,
            lessonContent: { text: topic }
          }));
          handleGenerateAI({
            ...plan,
            grade,
            subject,
            lessonTitle: topic,
            lessonContent: { text: topic }
          });
        }}
        isGenerating={isGenerating}
      />
    </div>
  );
}
