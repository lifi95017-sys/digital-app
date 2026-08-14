import fs from 'fs';
let c = fs.readFileSync('src/components/SeaPlmTestView.tsx', 'utf8');

// I should probably just revert the file to a working state, or fix the specific line.
// Let's just fix the bad replacements.
c = c.replace(/\{activeSubject === 'math' \? 'bg-emerald-600' : 'bg-indigo-600'\}/g, "bg-indigo-600");

// And we can update just the specific parts that need dynamic color:
const oldAddTestButton = `bg-indigo-600 text-white rounded-xl hover:bg-indigo-700`;
const newAddTestButton = `\${activeSubject === 'math' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white rounded-xl`;

c = c.replace(/className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700/g, "className={`flex items-center gap-2 px-4 py-2 " + newAddTestButton);
// need to close the backtick in className if it was a string literal
// wait, the button was: className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-khmer text-sm"
c = c.replace(/className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-khmer text-sm"/g, "className={`flex items-center gap-2 px-4 py-2 ${activeSubject === 'math' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white rounded-xl transition-colors font-khmer text-sm`}");

fs.writeFileSync('src/components/SeaPlmTestView.tsx', c);
