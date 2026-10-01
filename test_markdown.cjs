const fs = require('fs');
const file = 'src/components/WorksheetModal.tsx';
let content = fs.readFileSync(file, 'utf8');

const target1 = `  const [content, setContent] = useState('');`;
const replacement1 = `  const [content, setContent] = useState('');\n  const [isDone, setIsDone] = useState(false);`;
content = content.replace(target1, replacement1);

const target2 = `      setContent(text);`;
const replacement2 = `      setContent(text);\n      setIsDone(true);`;
content = content.replace(target2, replacement2);

const target3 = `    if (isOpen && !hasGenerated) {`;
const replacement3 = `    if (isOpen && !hasGenerated) {
      setIsDone(false);`;
content = content.replace(target3, replacement3);

const target4 = `      const existingStudentKey = \`worksheet_student_\${plan.lessonTitle || 'draft'}\`;
      const existingTeacherKey = \`worksheet_teacher_\${plan.lessonTitle || 'draft'}\`;`;
const replacement4 = `      const existingStudentKey = \`worksheet_student_\${plan.lessonTitle || 'draft'}\`;
      const existingTeacherKey = \`worksheet_teacher_\${plan.lessonTitle || 'draft'}\`;
      setIsDone(false);`;
content = content.replace(target4, replacement4);

const target5 = `      if (savedContent) {
        setContent(savedContent);
        setHasGenerated(true);`;
const replacement5 = `      if (savedContent) {
        setContent(savedContent);
        setIsDone(true);
        setHasGenerated(true);`;
content = content.replace(target5, replacement5);

const target6 = `      setContent('*មានបញ្ហាក្នុងការបង្កើតមាតិកា។ សូមព្យាយាមម្ដងទៀត។*');
    }
    setIsLoading(false);
  };`;
const replacement6 = `      setContent('*មានបញ្ហាក្នុងការបង្កើតមាតិកា។ សូមព្យាយាមម្ដងទៀត។*');
    }
    setIsLoading(false);
    
    if (text) {
        const existingStudentKey = \`worksheet_student_\${plan.lessonTitle || 'draft'}\`;
        const existingTeacherKey = \`worksheet_teacher_\${plan.lessonTitle || 'draft'}\`;
        if (isStudent) {
            localStorage.setItem(existingStudentKey, text);
        } else {
            localStorage.setItem(existingTeacherKey, text);
        }
    }
  };`;
content = content.replace(target6, replacement6);

fs.writeFileSync(file, content);
console.log('patched worksheet state saving');
