import fs from 'fs';
let c = fs.readFileSync('src/components/SeaPlmTestView.tsx', 'utf8');
c = c.replace(/    <\/div>\n  \);\n}/, '    </div>\n    </div>\n  );\n}');
fs.writeFileSync('src/components/SeaPlmTestView.tsx', c);
