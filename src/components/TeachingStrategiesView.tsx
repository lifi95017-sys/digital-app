import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Lightbulb, 
  Users, 
  Brain, 
  BookOpen, 
  CheckCircle2, 
  Plus, 
  History, 
  Star, 
  Video, 
  FileText,
  Save,
  MessageSquare,
  Clock,
  Layers,
  ChevronRight,
  TrendingUp,
  School,
  ClipboardCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TeachingStrategy, StrategyImplementation } from '../types';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from '../lib/firebase';
import { db, auth } from '../lib/firebase';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Updated Pedagogical Data based on user request
const INITIAL_STRATEGIES: TeachingStrategy[] = [
  // 1. Active Learning Methods
  {
    id: 'active-1',
    name: 'វិធីសាស្ត្របំផុសគំនិត (Brainstorming)',
    purpose: 'ដើម្បីប្រមូលគំនិតឱ្យបានច្រើន និងឆាប់រហ័សពីសិស្ស។',
    description: 'បច្ចេកទេសដឹកនាំសិស្សឱ្យបញ្ចេញមតិយោបល់ដោយសេរីលើប្រធានបទមួយ។',
    steps: [
      'កំណត់ប្រធានបទ ឬបញ្ហាដែលត្រូវពិភាក្សាឱ្យបានច្បាស់លាស់។',
      'ទុកពេលឱ្យសិស្សគិតម្នាក់ៗ (១-២នាទី)។',
      'ឱ្យសិស្សបញ្ចេញមតិរៀងៗខ្លួន (ទទួលយកគ្រប់មតិ មិនមានមតិខុស)។',
      'កត់ត្រាគ្រប់គំនិតទាំងអស់នៅលើក្ដារខៀន ឬក្រដាសធំ។',
      'ធ្វើការបូកសរុប ច្រោះយកគំនិតល្អៗ និងពន្យល់បន្ថែម។'
    ],
    materials: ['ក្ដារខៀន/ក្តារឈ្នួន', 'ប៊ិចហ្វឺត', 'Post-it (បើមាន)'],
    category: 'active',
    icon: 'Lightbulb'
  },
  {
    id: 'active-2',
    name: 'វិធីសាស្ត្រពិភាក្សាក្រុម (Group Discussion)',
    purpose: 'បង្កើនការងារក្រុម ការដោះស្រាយបញ្ហា និងការចែករំលែកចំណេះដឹង។',
    description: 'បច្ចេកទេសបែងចែកការងារ និងការបូកសរុបលទ្ធផលតាមក្រុមតូចៗ។',
    steps: [
      'បែងចែកសិស្សជាក្រុម (៣-៥នាក់) ដែលមានសមត្ថភាពចម្រុះ។',
      'ប្រគល់សន្លឹកកិច្ចការ និងកំណត់តួនាទី (ប្រធានក្រុម អ្នកកត់ត្រា អ្នករាយការណ៍)។',
      'សិស្សពិភាក្សា និងដោះស្រាយកិច្ចការដែលបានប្រគល់ជូន។',
      'តំណាងក្រុមនីមួយៗបង្ហាញលទ្ធផលពិភាក្សាទៅកាន់ថ្នាក់។',
      'គ្រូនិងសិស្សផ្សេងទៀតផ្ដល់មតិ និងបូកសរុបខ្លឹមសាររួម។'
    ],
    materials: ['សន្លឹកកិច្ចការ', 'ក្រដាសរ៉ាម/Flipchart', 'ប៊ិចពណ៌'],
    category: 'active',
    icon: 'Users'
  },
  {
    id: 'active-3',
    name: 'វិធីសាស្ត្រសិក្សាតាមបែបការរកឃើញ (Discovery Learning)',
    purpose: 'ដឹកនាំសិស្សឱ្យរកឃើញចំណេះដឹងថ្មីដោយខ្លួនឯងតាមរយៈការអង្កេត។',
    description: 'សិស្សជាអ្នករុករកចំណេះដឹងតាមរយៈការពិសោធន៍ ឬការវិភាគទិន្នន័យជាក់ស្តែង។',
    steps: [
      'ដាក់ចម្ងល់ ឬបញ្ហាគន្លឹះដែលពាក់ព័ន្ធនឹងមេរៀន។',
      'ផ្តល់សម្ភារៈឧបទេស ឬទិន្នន័យសម្រាប់សិស្សធ្វើការអង្កេត។',
      'សិស្សធ្វើការពិសោធន៍ អង្កេត ឬវិភាគដើម្បីរកចម្លើយ។',
      'សិស្សទាញសេចក្តីសន្និដ្ឋាននៃអ្វីដែលគេបានរកឃើញ។',
      'គ្រូបញ្ជាក់ និងពង្រីកចំណេះដឹងដែលសិស្សបានរកឃើញ។'
    ],
    materials: ['សម្ភារៈពិសោធន៍', 'រូបភាពបណ្ណ', 'វត្ថុពិត'],
    category: 'active',
    icon: 'Search'
  },
  {
    id: 'active-4',
    name: 'វិធីសាស្ត្រតួនាទីសម្តែង (Role Play)',
    purpose: 'អនុវត្តស្ថានភាពជាក់ស្តែងក្នុងមេរៀន ដើម្បីបង្កើនការយល់ដឹង និងភាពក្លាហាន។',
    description: 'សក្តិសមបំផុតសម្រាប់មុខវិជ្ជាភាសាខ្មែរ (រឿងនិទាន) និងសីលធម៌-ពលរដ្ឋ។',
    steps: [
      'ជ្រើសរើសសាច់រឿង ឬស្ថានភាពដែលត្រូវសម្តែង។',
      'ជ្រើសរើសសិស្សស្ម័គ្រចិត្តតាមតួនាទីក្នុងសាច់រឿង។',
      'ឱ្យសិស្សរៀបចំ និងហាត់សមខ្លីៗ (៥-១០នាទី)។',
      'ការសម្តែង និងការសង្កេតមើលពីមិត្តរួមថ្នាក់។',
      'ការដកស្រង់មេរៀន និងមតិត្រឡប់ពីការសម្តែង។'
    ],
    materials: ['សេណារីយ៉ូ', 'សម្ភារៈតុបតែងសាមញ្ញ', 'កាតតួនាទី'],
    category: 'active',
    subject: ['ភាសាខ្មែរ', 'សីលធម៌'],
    icon: 'School'
  },

  // 2. Lesson Phases
  {
    id: 'phase-1',
    name: 'ដំណាក់កាលនាំចូលមេរៀន (Intro Phase)',
    purpose: 'បង្កើតចំណាប់អារម្មណ៍ និងរំលឹកមេរៀនចាស់។',
    description: 'បច្ចេកទេសទាក់ទាញអារម្មណ៍សិស្សមុនចាប់ផ្តើមមេរៀនថ្មី។',
    steps: [
      'ប្រើល្បែងសិក្សារហ័ស (Energizer) ឬចម្រៀង។',
      'ការបង្ហាញរូបភាពអាថ៌កំបាំង ឬវត្ថុពិត។',
      'សំណួររំលឹកមេរៀនចាស់ដែលទាក់ទងនឹងមេរៀនថ្មី។'
    ],
    materials: ['ឧបករណ៍បំពងសំឡេង', 'រូបភាព', 'វត្ថុពិត'],
    category: 'phase',
    icon: 'TrendingUp'
  },
  {
    id: 'phase-2',
    name: 'ដំណាក់កាលបង្រៀនមេរៀនថ្មី (Teaching Phase)',
    purpose: 'ពន្យល់ខ្លឹមសារមេរៀនឱ្យសិស្សយល់ច្បាស់។',
    description: 'វិធីសាស្ត្រពន្យល់ ការបង្ហាញ ការសាកសួរ និងការធ្វើពិពណ៌នា។',
    steps: [
      'ការបង្ហាញខ្លឹមសារថ្មីតាមរយៈសម្ភារឧបទេស។',
      'ការធ្វើជាគំរូដោយគ្រូ (គ្រូធ្វើ - សិស្សមើល)។',
      'ការសួរសំណួរបើកដើម្បីជំរុញការត្រិះរិះ។'
    ],
    materials: ['ស្លាយ/រូបភាព', 'បណ្ណពាក្យ', 'កញ្ចប់មេរៀន'],
    category: 'phase',
    icon: 'BookOpen'
  },
  {
    id: 'phase-3',
    name: 'ដំណាក់កាលពង្រឹងចំណេះដឹង (Consolidation)',
    purpose: 'ឱ្យសិស្សអនុវត្ត និងពង្រឹងការចងចាំខ្លឹមសារមេរៀន។',
    description: 'ការប្រើល្បែងសិក្សា ការធ្វើលំហាត់ប្រតិបត្តិ ឬការសង្ខេបមេរៀន។',
    steps: [
      'ការធ្វើការងារបុគ្គល (សិស្សធ្វើ - គ្រូមើល)។',
      'ល្បែងសិក្សាប្រកួតប្រជែងជាក្រុម។',
      'ការសង្ខេបមេរៀនជាផែនទីគំនិត (Mind Map)។'
    ],
    materials: ['សន្លឹកកិច្ចការ', 'ក្តារឈ្នួន', 'ប៊ិចពណ៌'],
    category: 'phase',
    icon: 'CheckCircle2'
  },

  // 3. Formative Assessment
  {
    id: 'eval-1',
    name: 'បច្ចេកទេសប្រើកាតពណ៌ (Color Cards)',
    purpose: 'ពិនិត្យការយល់ដឹងរបស់សិស្សគ្រប់គ្នាបានរហ័ស។',
    description: 'សិស្សបង្ហាញកាតពណ៌៖ បៃតង (យល់/យល់ស្រប), ក្រហម (មិនយល់/មិនព្រម)។',
    steps: [
      'ចែកកាតពណ៌ដល់សិស្សម្នាក់ៗ។',
      'គ្រូដាក់មតិ ឬសំណួរយល់ស្រប/មិនយល់ស្រប។',
      'សិស្សលើកកាតពណ៌តាមស្ថានភាពយល់ដឹងរបស់គេ។',
      'គ្រូសង្កេតមើលសរុប និងពន្យល់បន្ថែមបើមានកាតក្រហមច្រើន។'
    ],
    materials: ['កាតបៃតង ក្រហម លឿង'],
    category: 'assessment',
    icon: 'MessageSquare'
  },
  {
    id: 'eval-2',
    name: 'ការប្រើក្តារឈ្នួនឌីជីថល/ធម្មតា',
    purpose: 'ឱ្យសិស្សទាំងអស់បញ្ចេញចម្លើយក្នុងពេលតែមួយ។',
    description: 'សិស្សសរសេរចម្លើយលើក្តារឈ្នួន ហើយបង្ហាញគ្រូ ដើម្បីងាយស្រួលគ្រប់គ្រង។',
    steps: [
      'គ្រូដាក់សំណួរ ឬលំហាត់ខ្លីៗ។',
      'សិស្សសរសេរចម្លើយលើក្តារឈ្នួនរៀងៗខ្លួន។',
      'គ្រូបញ្ជាឱ្យលើកក្តារឈ្នួនព្រមគ្នា "១...២...៣ លើក!"។',
      'គ្រូពិនិត្យ និងកែលម្អភ្លាមៗ។'
    ],
    materials: ['ក្តារឈ្នួន', 'ប៊ិចហ្វឺត/ដីស'],
    category: 'assessment',
    icon: 'Layers'
  },
  {
    id: 'eval-3',
    name: 'សំណួរបកស្រាយ/សំណួរបើក (Open-Ended Questions)',
    purpose: 'ជំរុញការគិតកម្រិតខ្ពស់ និងការបកស្រាយដោយផ្ទាល់មាត់។',
    description: 'ការសួរសំណួរដែលមិនមែនគ្រាន់តែឆ្លើយថា បាទ/ចាស ឬ ទេ ប៉ុន្តែត្រូវការការពន្យល់។',
    steps: [
      'ត្រៀមសំណួរ "ហេតុអ្វី?" ឬ "តើអ្នកគិតយ៉ាងណាដែរ?"។',
      'ឱ្យពេលវេលាគិតបន្តិចមុននឹងឆ្លើយ។',
      'ជំរុញឱ្យសិស្សសួរសំណួរទៅមិត្តរួមថ្នាក់បន្ត។'
    ],
    materials: ['បញ្ជីសំណួរគន្លឹះ'],
    category: 'assessment',
    icon: 'Brain'
  }
];

interface TeachingStrategiesViewProps {
  onBack: () => void;
}

export default function TeachingStrategiesView({ onBack }: TeachingStrategiesViewProps) {
  const [activeTab, setActiveTab] = useState<'library' | 'tracker' | 'history'>('library');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStrategy, setSelectedStrategy] = useState<TeachingStrategy | null>(null);
  const [implementations, setImplementations] = useState<StrategyImplementation[]>([]);
  
  // Implementation Form State
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<StrategyImplementation>>({
    date: new Date().toISOString().split('T')[0],
    effectiveness: 5,
    engagementLevel: 'medium',
    reflection: ''
  });

  useEffect(() => {
    const path = 'strategy_implementations';
    const unsub = onSnapshot(
      query(collection(db, path), orderBy('date', 'desc')),
      (snapshot) => {
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StrategyImplementation));
        setImplementations(docs);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
    return () => unsub();
  }, []);

  const filteredStrategies = INITIAL_STRATEGIES.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         s.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSaveImplementation = async () => {
    if (!selectedStrategy) return;
    
    const path = 'strategy_implementations';
    try {
      await addDoc(collection(db, path), {
        ...formData,
        strategyId: selectedStrategy.id,
        strategyName: selectedStrategy.name,
        createdAt: serverTimestamp()
      });
      setShowForm(false);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        effectiveness: 5,
        engagementLevel: 'medium',
        reflection: ''
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Users': return <Users className="w-6 h-6" />;
      case 'Brain': return <Brain className="w-6 h-6" />;
      case 'Lightbulb': return <Lightbulb className="w-6 h-6" />;
      case 'BookOpen': return <BookOpen className="w-6 h-6" />;
      case 'Layers': return <Layers className="w-6 h-6" />;
      case 'MessageSquare': return <MessageSquare className="w-6 h-6" />;
      case 'Search': return <Search className="w-6 h-6" />;
      case 'TrendingUp': return <TrendingUp className="w-6 h-6" />;
      case 'CheckCircle2': return <CheckCircle2 className="w-6 h-6" />;
      case 'School': return <School className="w-6 h-6" />;
      default: return <Lightbulb className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-slate-600" />
          </button>
          <h1 className="text-xl font-bold text-slate-800 font-khmer">វិធីសាស្ត្របង្រៀន (Teaching Methods)</h1>
          <div className="w-10" />
        </div>
        
        <div className="flex px-4 overflow-x-auto no-scrollbar border-t">
          {[
            { id: 'library', label: 'បណ្ដុំវិធីសាស្ត្រ', icon: <BookOpen className="w-4 h-4" /> },
            { id: 'tracker', label: 'កត់ត្រាការអនុវត្ត', icon: <ClipboardCheck className="w-4 h-4" /> },
            { id: 'history', label: 'ការឆ្លុះបញ្ចាំង (Reflection)', icon: <History className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id 
                  ? 'border-emerald-600 text-emerald-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.icon}
              <span className="font-khmer">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-4xl mx-auto p-4">
        {activeTab === 'library' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="ស្វែងរកវិធីសាស្ត្រ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-khmer"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {[
                  { id: 'all', label: 'ទាំងអស់' },
                  { id: 'active', label: 'បែបសកម្ម' },
                  { id: 'phase', label: 'តាមដំណាក់កាល' },
                  { id: 'assessment', label: 'ការវាយតម្លៃ' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-sm whitespace-nowrap font-khmer transition-all ${
                      selectedCategory === cat.id 
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' 
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredStrategies.map((strategy) => (
                <motion.div
                  key={strategy.id}
                  layoutId={strategy.id}
                  onClick={() => setSelectedStrategy(strategy)}
                  className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      {getIcon(strategy.icon)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800 font-khmer mb-1">{strategy.name}</h3>
                      <p className="text-sm text-slate-500 font-khmer line-clamp-2">{strategy.description}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-khmer ${
                      strategy.category === 'active' ? 'bg-blue-100 text-blue-700' :
                      strategy.category === 'phase' ? 'bg-amber-100 text-amber-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {strategy.category === 'active' ? 'រៀនបែបសកម្ម' :
                       strategy.category === 'phase' ? 'ដំណាក់កាលមេរៀន' : 'ស្ថាបនា'}
                    </span>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tracker' && (
          <div className="space-y-6">
            <div className="bg-emerald-600 text-white p-6 rounded-3xl shadow-xl shadow-emerald-100 relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-xl font-bold font-khmer mb-2">កត់ត្រាការអនុវត្ត និងឆ្លុះបញ្ចាំង</h2>
                <p className="text-emerald-100 text-sm font-khmer opacity-90">តើការប្រើប្រាស់វិធីសាស្ត្របង្រៀនថ្ងៃនេះមានប្រសិទ្ធភាពកម្រិតណា?</p>
              </div>
              <TrendingUp className="absolute -right-4 -bottom-4 w-32 h-32 text-white opacity-10" />
            </div>

            <div className="grid gap-4">
              {INITIAL_STRATEGIES.map(strategy => (
                <button
                  key={strategy.id}
                  onClick={() => {
                    setSelectedStrategy(strategy);
                    setShowForm(true);
                  }}
                  className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between group hover:border-emerald-300 transition-colors"
                >
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                      {getIcon(strategy.icon)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 font-khmer">{strategy.name}</h4>
                      <p className="text-xs text-slate-500 font-khmer">ចុចដើម្បីកត់ចំណាំ (Teacher's Note)</p>
                    </div>
                  </div>
                  <Plus className="w-6 h-6 text-slate-300 group-hover:text-emerald-600" />
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            {implementations.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                <History className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-khmer">មិនទាន់មានកំណត់ត្រាឆ្លុះបញ្ចាំងនៅឡើយទេ</p>
              </div>
            ) : (
              implementations.map((imp) => (
                <div key={imp.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-emerald-600 font-khmer mb-1">{imp.strategyName}</h3>
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-khmer">
                        <Clock className="w-3 h-3" />
                        {imp.date}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star 
                          key={star} 
                          className={`w-4 h-4 ${star <= imp.effectiveness ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl mb-3 border-l-4 border-emerald-500">
                    <p className="text-sm text-slate-600 font-khmer italic">"{imp.reflection}"</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-khmer text-slate-500">កម្រិតចូលរួមរបស់សិស្ស៖</span>
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold font-khmer ${
                      imp.engagementLevel === 'high' ? 'bg-green-100 text-green-700' :
                      imp.engagementLevel === 'medium' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {imp.engagementLevel === 'high' ? 'ខ្ពស់' : imp.engagementLevel === 'medium' ? 'មធ្យម' : 'ទាប'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      <AnimatePresence>
        {selectedStrategy && !showForm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="bg-white w-full max-w-2xl rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden max-h-[90vh] flex flex-col font-khmer"
            >
              <div className="p-6 bg-emerald-600 text-white flex items-center justify-between relative overflow-hidden">
                <div className="relative z-10 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                    {getIcon(selectedStrategy.icon)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{selectedStrategy.name}</h2>
                    <span className="text-xs opacity-80">{selectedStrategy.category === 'active' ? 'រៀនបែបសកម្ម' : 'ដំណាក់កាលមេរៀន'}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedStrategy(null)}
                  className="relative z-10 p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-6 h-6 rotate-90 sm:rotate-0" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
                <section>
                  <div className="flex items-center gap-2 mb-3 text-emerald-600">
                    <Star className="w-5 h-5 fill-emerald-600" />
                    <h3 className="font-bold">គោលបំណង</h3>
                  </div>
                  <p className="text-slate-600 leading-relaxed bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50">
                    {selectedStrategy.purpose}
                  </p>
                </section>

                <section>
                  <div className="flex items-center gap-2 mb-4 text-emerald-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <h3 className="font-bold">របៀបដឹកនាំសិស្ស (Step-by-step)</h3>
                  </div>
                  <div className="space-y-4 font-khmer">
                    {selectedStrategy.steps.map((step, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm shrink-0">
                          {idx + 1}
                        </div>
                        <p className="text-slate-600 pt-1">{step}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {selectedStrategy.materials.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-4 text-emerald-600">
                      <Layers className="w-5 h-5" />
                      <h3 className="font-bold">សម្ភារៈ/ធនធានចាំបាច់</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedStrategy.materials.map((m, idx) => (
                        <span key={idx} className="px-3 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm border border-slate-200">
                          • {m}
                        </span>
                      ))}
                    </div>
                  </section>
                )}

                <div className="flex gap-3 pt-4 border-t sticky bottom-0 bg-white py-4">
                  <button className="flex-1 flex items-center justify-center gap-2 bg-rose-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-rose-100 hover:bg-rose-600 transition-all">
                    <Video className="w-5 h-5" />
                    វីដេអូគំរូ
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 bg-slate-800 text-white py-4 rounded-2xl font-bold shadow-lg shadow-slate-100 hover:bg-slate-900 transition-all">
                    <FileText className="w-5 h-5" />
                    ឯកសារយោង
                  </button>
                </div>
                
                <div className="text-center pb-4 text-[10px] text-slate-300 italic">
                  ប្រភព៖ ឯកសារវិធីសាស្ត្របង្រៀនថ្មីៗសម្រាប់ថ្នាក់បឋមសិក្សា (MoEYS)
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showForm && selectedStrategy && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm font-khmer"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white w-full max-w-lg rounded-t-[2rem] sm:rounded-[2rem] overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b flex items-center justify-between bg-emerald-50">
                <div>
                  <h3 className="font-bold text-slate-800">ការឆ្លុះបញ្ចាំង៖ {selectedStrategy.name}</h3>
                  <p className="text-xs text-emerald-600">Teacher's Reflection Note</p>
                </div>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-white rounded-full">
                  <Plus className="w-6 h-6 rotate-45 text-slate-400" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">កាលបរិច្ឆេទអនុវត្ត</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">ប្រសិទ្ធភាពនៃវិធីសាស្ត្រ</label>
                  <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl justify-center">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        onClick={() => setFormData({ ...formData, effectiveness: star })}
                        className="transition-transform active:scale-90"
                      >
                        <Star className={`w-8 h-8 ${star <= (formData.effectiveness || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">ការចូលរួមរបស់សិស្ស</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'low', label: 'ទាប' },
                      { id: 'medium', label: 'មធ្យម' },
                      { id: 'high', label: 'ខ្ពស់' }
                    ].map(level => (
                      <button
                        key={level.id}
                        onClick={() => setFormData({ ...formData, engagementLevel: level.id as any })}
                        className={`py-3 rounded-xl text-sm transition-all ${
                          formData.engagementLevel === level.id 
                            ? 'bg-emerald-600 text-white shadow-lg' 
                            : 'bg-slate-50 text-slate-600 border border-slate-100 hover:bg-slate-100'
                        }`}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">កន្លែងសម្រាប់គ្រូកត់ចំណាំ (Note/Reflection)</label>
                  <textarea
                    rows={4}
                    placeholder="កត់ត្រាអំពីប្រសិទ្ធភាពនៃវិធីសាស្ត្រនេះ បន្ទាប់ពីបង្រៀនរួច ដើម្បីកែលម្អនៅម៉ោងក្រោយ..."
                    value={formData.reflection}
                    onChange={(e) => setFormData({ ...formData, reflection: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
                  >
                    បោះបង់
                  </button>
                  <button
                    onClick={handleSaveImplementation}
                    className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    រក្សាទុកកំណត់ត្រា
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
