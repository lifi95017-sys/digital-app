import fs from 'fs';

// Fix App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf8');
appContent = appContent.replace(
  `  const [seenGuides, setSeenGuides] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem('seenGuides');
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  });

  const handleCloseGuide = () => {
    setShowGuide(false);
  };

  useEffect(() => {
    if (isAuthenticated && view !== 'dashboard' && !seenGuides[view]) {
      setShowGuide(true);
      const newSeen = { ...seenGuides, [view]: true };
      setSeenGuides(newSeen);
      localStorage.setItem('seenGuides', JSON.stringify(newSeen));
    }
  }, [view, isAuthenticated, seenGuides]);`,
  ``
);
fs.writeFileSync('src/App.tsx', appContent);

// Fix EducationalGamesView.tsx
let gameContent = fs.readFileSync('src/components/EducationalGamesView.tsx', 'utf8');
gameContent = gameContent.replace(
  `import { 
  ChevronLeft, 
  Gamepad2, 
  Sparkles, 
  Trophy, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Volume2, 
  Plus, 
  Trash2, 
  HelpCircle, 
  Play,
  Users,
  Timer
} from 'lucide-react';`,
  `import { 
  ChevronLeft, 
  Gamepad2, 
  Sparkles, 
  Trophy, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Volume2, 
  Plus, 
  Trash2, 
  HelpCircle, 
  Play,
  Users,
  Timer,
  List
} from 'lucide-react';`
);
fs.writeFileSync('src/components/EducationalGamesView.tsx', gameContent);

console.log("Fixed!");
