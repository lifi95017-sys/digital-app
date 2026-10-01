const fs = require('fs');
const file = 'src/components/WorksheetModal.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `    }
    setIsLoading(false);
    
    if (text) {`;

const replacement = `    }
    setIsLoading(false);`;

content = content.replace(target, replacement);

const target2 = `      setContent(text);
      setIsDone(true);
    } catch (error) {`;

const replacement2 = `      setContent(text);
      setIsDone(true);
      
      const existingStudentKey = \`worksheet_student_\${plan.lessonTitle || 'draft'}\`;
      const existingTeacherKey = \`worksheet_teacher_\${plan.lessonTitle || 'draft'}\`;
      if (isStudent) {
          localStorage.setItem(existingStudentKey, text);
      } else {
          localStorage.setItem(existingTeacherKey, text);
      }
    } catch (error) {`;

content = content.replace(target2, replacement2);

fs.writeFileSync(file, content);
console.log('patched text scope');
