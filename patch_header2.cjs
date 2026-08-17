const fs = require('fs');
let content = fs.readFileSync('src/components/AppHeader.tsx', 'utf8');

content = content.replace(
  "export default function AppHeader({ onLogout }: { onLogout?: () => void }) {\n  const [user, setUser] = useState<FirebaseUser | null>(null);",
  "export default function AppHeader({ onLogout }: { onLogout?: () => void }) {\n  const [user, setUser] = useState<FirebaseUser | null>(null);\n  const [isSettingsOpen, setIsSettingsOpen] = useState(false);"
);

fs.writeFileSync('src/components/AppHeader.tsx', content);
