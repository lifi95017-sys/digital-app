const fs = require('fs');
let content = fs.readFileSync('src/components/StudentManagementView.tsx', 'utf8');

const replacement = `          </table>
        </div>
      </div>

      <AnimatePresence>`;

content = content.replace(`      </div>\n\n      <AnimatePresence>`, replacement);
fs.writeFileSync('src/components/StudentManagementView.tsx', content);
