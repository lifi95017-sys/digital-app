const fs = require('fs');
const file = 'src/components/WorksheetModal.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `    setIsLoading(false);
        const existingStudentKey = \`worksheet_student_\${plan.lessonTitle || 'draft'}\`;
        const existingTeacherKey = \`worksheet_teacher_\${plan.lessonTitle || 'draft'}\`;
        if (isStudent) {
            localStorage.setItem(existingStudentKey, text);
        } else {
            localStorage.setItem(existingTeacherKey, text);
        }
    }`;

const replacement = `    setIsLoading(false);`;

content = content.replace(target, replacement);

fs.writeFileSync(file, content);
console.log('cleaned up');
