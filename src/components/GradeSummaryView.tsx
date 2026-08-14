import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  FileText, 
  Calendar, 
  Award, 
  BarChart, 
  Printer,
  BookOpen
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, onSnapshot, orderBy } from '../lib/firebase';
import { Student, ScoreRecord, Grade, ClassInfo } from '../types';
import GradeReportMoEYS from './GradeReportMoEYS';

interface GradeSummaryViewProps {
  onBack: () => void;
  students: Student[];
}

export default function GradeSummaryView({ onBack, students }: GradeSummaryViewProps) {
  const [scores, setScores] = useState<ScoreRecord[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<Grade>(4);
  const [activeReport, setActiveReport] = useState<'monthly' | 'semester1' | 'semester2' | 'annual' | null>(null);
  const [selectedMonth, setSelectedMonth] = useState('មេសា');

  const classInfo: ClassInfo = {
    schoolName: 'សាលាបឋមសិក្សាជ័យជំន្នះ',
    grade: `ថ្នាក់ទី ${selectedGrade}`,
    academicYear: '២០២៣-២០២៤',
    teacherName: 'លោកគ្រូ សុខ ជា'
  };

  useEffect(() => {
    const unsubScores = onSnapshot(query(collection(db, 'scores'), orderBy('createdAt', 'desc')), snap => {
      setScores(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ScoreRecord[]);
    });
    return () => unsubScores();
  }, []);

  if (activeReport) {
    return (
      <GradeReportMoEYS 
        students={students.filter(s => s.grade === selectedGrade)}
        scores={scores.filter(s => s.gradeValue === selectedGrade)}
        classInfo={classInfo}
        reportType={activeReport}
        month={selectedMonth}
        onBack={() => setActiveReport(null)}
      />
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all font-medium border border-slate-200 shadow-sm self-start"
        >
          <ChevronLeft className="w-5 h-5 text-indigo-600" />
          ត្រឡប់ក្រោយ
        </button>

        <div className="flex gap-4">
           <select 
             value={selectedGrade} 
             onChange={(e) => setSelectedGrade(Number(e.target.value) as Grade)} 
             className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold khmer-font outline-none shadow-sm"
           >
             {[4, 5, 6].map(g => <option key={g} value={g}>ថ្នាក់ទី {g}</option>)}
           </select>
           
           <select 
             value={selectedMonth} 
             onChange={(e) => setSelectedMonth(e.target.value)} 
             className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold khmer-font outline-none shadow-sm"
           >
             {['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'].map(m => (
               <option key={m} value={m}>{m}</option>
             ))}
           </select>
        </div>
      </div>

      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h2 className="text-4xl font-black text-slate-800 khmer-font">តារាងសម្រង់ពិន្ទុសិស្ស MoEYS</h2>
        <p className="text-slate-500 font-medium khmer-font">ជ្រើសរើសប្រភេទរបាយការណ៍ដែលលោកគ្រូអ្នកគ្រូចង់ទាញយក ឬបោះពុម្ពតាមទម្រង់ស្តង់ដារក្រសួង</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <ReportCard 
          title="តារាងសម្រង់ពិន្ទុប្រចាំខែ" 
          description={`បញ្ជីពិន្ទុលម្អិតតាមមុខវិជ្ជាសម្រាប់ខែ ${selectedMonth}`}
          icon={<Calendar className="w-8 h-8" />}
          color="from-blue-500 to-indigo-600"
          onClick={() => setActiveReport('monthly')}
        />
        <ReportCard 
          title="តារាងសម្រង់ពិន្ទុប្រចាំឆមាសទី ១" 
          description="មធ្យមភាគពិន្ទុ និងចំណាត់ថ្នាក់សរុបប្រចាំឆមាសទី ១"
          icon={<FileText className="w-8 h-8" />}
          color="from-emerald-500 to-teal-600"
          onClick={() => setActiveReport('semester1')}
        />
        <ReportCard 
          title="តារាងសម្រង់ពិន្ទុប្រចាំឆមាសទី ២" 
          description="មធ្យមភាគពិន្ទុ និងចំណាត់ថ្នាក់សរុបប្រចាំឆមាសទី ២"
          icon={<FileText className="w-8 h-8" />}
          color="from-amber-500 to-orange-600"
          onClick={() => setActiveReport('semester2')}
        />
        <ReportCard 
          title="តារាងសម្រង់ពិន្ទុប្រចាំឆ្នាំ" 
          description="លទ្ធផលសម្រង់ពិន្ទុ និងការវាយតម្លៃសរុបប្រចាំឆ្នាំសិក្សា"
          icon={<Award className="w-8 h-8" />}
          color="from-rose-500 to-pink-600"
          onClick={() => setActiveReport('annual')}
        />
      </div>

      <div className="mt-12 bg-indigo-50 border border-indigo-100 p-8 rounded-[2.5rem] max-w-4xl mx-auto flex items-start gap-6">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-200">
             <Printer className="w-6 h-6 text-white" />
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-black text-indigo-900 khmer-font">ណែនាំអំពីការបោះពុម្ព</h4>
            <p className="text-indigo-700/80 khmer-font text-sm leading-relaxed">
              សម្រាប់ការបោះពុម្ពតារាងសម្រង់ពិន្ទុឲ្យបានស្អាត និងគ្រប់ជ្រុងជ្រោយ សូមជ្រើសរើសយក "Landscape" (ផ្តេក) នៅក្នុងការកំណត់ម៉ាស៊ីនបោះពុម្ព។ ប្រព័ន្ធនឹងរៀបចំទម្រង់តាមស្តង់ដារផ្លូវការរបស់ក្រសួងអប់រំ យុវជន និងកីឡា។
            </p>
          </div>
      </div>
    </div>
  );
}

function ReportCard({ title, description, icon, color, onClick }: { 
  title: string; 
  description: string; 
  icon: React.ReactNode; 
  color: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 text-left flex gap-6 hover:border-indigo-200 transition-all group"
    >
      <div className={`w-20 h-20 rounded-[2rem] bg-gradient-to-br ${color} shrink-0 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-500`}>
        {icon}
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-black text-slate-800 khmer-font group-hover:text-indigo-600 transition-colors">{title}</h3>
        <p className="text-slate-400 text-xs khmer-font leading-relaxed">{description}</p>
        <div className="pt-2 flex items-center gap-2 text-indigo-600 font-bold text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
          ពិនិត្យមើល និងបោះពុម្ព <ChevronLeft className="w-4 h-4 rotate-180" />
        </div>
      </div>
    </motion.button>
  );
}
