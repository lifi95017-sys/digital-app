const fs = require('fs');
let content = fs.readFileSync('src/components/AppHeader.tsx', 'utf8');

// Import Settings icon
content = content.replace(
  "import { User, LogIn, LogOut, BookOpen, Crown } from 'lucide-react';",
  "import { User, LogIn, LogOut, BookOpen, Crown, Settings } from 'lucide-react';"
);

// Import SettingsModal
content = content.replace(
  "import { GoogleAuthProvider, signInWithPopup, signOut, User as FirebaseUser } from 'firebase/auth';",
  "import { GoogleAuthProvider, signInWithPopup, signOut, User as FirebaseUser } from 'firebase/auth';\nimport SettingsModal from './SettingsModal';"
);

// Add state for modal
content = content.replace(
  "export default function AppHeader({ onLogin, onLogout, user }: AppHeaderProps) {",
  "export default function AppHeader({ onLogin, onLogout, user }: AppHeaderProps) {\n  const [isSettingsOpen, setIsSettingsOpen] = useState(false);"
);

// Add the button
content = content.replace(
  "<LogOut className=\"w-5 h-5\" />\n              </button>",
  `<LogOut className="w-5 h-5" />\n              </button>\n              <button\n                onClick={() => setIsSettingsOpen(true)}\n                className="text-white hover:text-emerald-300 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"\n                title="ការកំណត់ (Settings)"\n              >\n                <Settings className="w-5 h-5" />\n              </button>`
);

// Add the modal component at the end
content = content.replace(
  "    </header>\n  );\n}",
  "      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />\n    </header>\n  );\n}"
);

fs.writeFileSync('src/components/AppHeader.tsx', content);
