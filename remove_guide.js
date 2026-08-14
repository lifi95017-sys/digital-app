import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Remove imports
content = content.replace(/import InstructionGuideModal from '\.\/components\/InstructionGuideModal';\n/, '');
content = content.replace(/import { HelpCircle } from 'lucide-react';\n/, '');

// Remove states
content = content.replace(/ *const \[showGuide, setShowGuide\] = useState<boolean>\(false\);\n/, '');
content = content.replace(/ *const \[seenGuides, setSeenGuides\] = useState<Record<string, boolean>>\(\(\) => \{\n *try \{\n *const saved = localStorage\.getItem\('seenGuides'\);\n *return saved \? JSON\.parse\(saved\) : \{\};\n *\} catch \{\n *return \{\};\n *\}\n *\}\);\n\n *const handleCloseGuide = \(\) => \{\n *setShowGuide\(false\);\n *\};\n\n *useEffect\(\(\) => \{\n *if \(isAuthenticated && view !== 'dashboard' && !seenGuides\[view\]\) \{\n *setShowGuide\(true\);\n *const newSeen = \{ \.\.\.seenGuides, \[view\]: true \};\n *setSeenGuides\(newSeen\);\n *localStorage\.setItem\('seenGuides', JSON\.stringify\(newSeen\)\);\n *\}\n *\}, \[view, isAuthenticated, seenGuides\]\);\n/, '');

// Remove JSX
content = content.replace(/ *\{\/\* Instruction Guide Modal \*\/\}\n *<InstructionGuideModal \n *isOpen=\{showGuide\} \n *onClose=\{handleCloseGuide\} \n *currentView=\{view\} \n *\/>\n/, '');

fs.writeFileSync('src/App.tsx', content);
console.log("Removed from App.tsx");
