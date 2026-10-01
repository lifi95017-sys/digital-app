const fs = require('fs');
const file = 'src/components/WorksheetModal.tsx';
let lines = fs.readFileSync(file, 'utf8').split('\n');

const replacement = `      const isSecondary = typeof plan.grade === 'number' ? plan.grade >= 7 : false;
      const teacherRole = isSecondary ? 'គ្រូបង្រៀនកម្រិតមធ្យមសិក្សាដ៏ចំណានម្នាក់នៅកម្ពុជា' : 'គ្រូបង្រៀនកម្រិតបឋមដ៏ចំណានម្នាក់នៅកម្ពុជា';

      const existingStudentKey = \`worksheet_student_\${plan.lessonTitle || 'draft'}\`;
      const existingTeacherKey = \`worksheet_teacher_\${plan.lessonTitle || 'draft'}\`;
      
      const existingStudentContent = localStorage.getItem(existingStudentKey);
      const existingTeacherContent = localStorage.getItem(existingTeacherKey);

      let promptText = '';

      if (isStudent) {
          if (existingTeacherContent) {
              promptText = \`អ្នកគឺជា\${teacherRole}។ 
នេះគឺជា «សន្លឹកកិច្ចការគ្រូ និងអត្រាកំណែ (Teacher Worksheet)» នៃមេរៀន \${plan.lessonTitle} ថ្នាក់ទី \${plan.grade}៖

\${existingTeacherContent}

សូមបង្កើត «សន្លឹកកិច្ចការសិស្ស (Student Worksheet)» ដោយផ្អែកលើសន្លឹកកិច្ចការគ្រូខាងលើ។
ទម្រង់ទាមទារ៖
១. សូមចម្លងសំណួរ និងទម្រង់ទាំងស្រុងពី "សន្លឹកកិច្ចការគ្រូ" ខាងលើ (ដូចគ្នាបេះបិទ) ប៉ុន្តែត្រូវលុបចម្លើយចេញ និងទុកចន្លោះប្រហោងសម្រាប់ឲ្យសិស្សសរសេរចម្លើយ។
២. ផ្នែកក្បាលត្រូវមាន៖ ឈ្មោះសិស្ស, ថ្នាក់ទី, ថ្ងៃខែ, ពិន្ទុ។

សូមសរសេរចេញជាទម្រង់ Markdown ដែលមានរបៀបរៀបរយល្អ។ មិនបាច់សរសេរពាក្យណែនាំទេ ចាប់ផ្តើមសរសេរយកតែម្តង។\`;
          } else {
              promptText = \`អ្នកគឺជា\${teacherRole}។ សូមបង្កើត «សន្លឹកកិច្ចការសិស្ស (Student Worksheet)» ដោយផ្អែកលើកិច្ចតែងការបង្រៀន (ផ្តោតសំខាន់លើមេរៀនថ្មី) ខាងក្រោមនេះ។
{មុខវិជ្ជា៖ \${plan.subject}, មេរៀនទី \${plan.lesson}៖ \${plan.lessonTitle}, ថ្នាក់ទី៖ \${plan.grade}, រយៈពេល៖ \${plan.duration}នាទី}

វត្ថុបំណងមេរៀន៖
- វិជ្ជាសម្បទា៖ \${plan.objectives.knowledge}
- បំណិនសម្បទា៖ \${plan.objectives.skills}

ខ្លឹមសារមេរៀនថ្មី (ពីកិច្ចតែងការ)៖
\${contentStr}

គោលបំណងសន្លឹកកិច្ចការ៖ សម្រាប់សិស្សអនុវត្តក្នុងថ្នាក់លើមេរៀនថ្មីនេះ។
ទម្រង់ទាមទារ៖
១. ផ្នែកក្បាល៖ ឈ្មោះសិស្ស, ថ្នាក់ទី, ថ្ងៃខែ, ពិន្ទុ
២. ផ្នែកលំហាត់/សំនួរ៖ បង្កើតសំនួរ លំហាត់ ផ្គូផ្គង ឬលំហាត់អនុវត្ត ដែលទាញចេញពី "ខ្លឹមសារមេរៀនថ្មី" ខាងលើ។ រៀបចំឲ្យមានចន្លោះសម្រាប់ឆ្លើយ។

សូមសរសេរចេញជាទម្រង់ Markdown ដែលមានរបៀបរៀបរយល្អ។ មិនបាច់សរសេរពាក្យណែនាំទេ ចាប់ផ្តើមសរសេរយកតែម្តង។\`;
          }
      } else {
          if (existingStudentContent) {
              promptText = \`អ្នកគឺជា\${teacherRole}។ 
នេះគឺជា «សន្លឹកកិច្ចការសិស្ស (Student Worksheet)» នៃមេរៀន \${plan.lessonTitle} ថ្នាក់ទី \${plan.grade}៖

\${existingStudentContent}

សូមបង្កើត «សន្លឹកកិច្ចការគ្រូ និងអត្រាកំណែ (Teacher Worksheet)» ដោយផ្អែកលើសន្លឹកកិច្ចការសិស្សខាងលើ។ 
ខ្លឹមសារមេរៀនពីកិច្ចតែងការ៖
\${contentStr}

ទម្រង់ទាមទារ៖
១. សូមចម្លងសំណួរ និងទម្រង់ទាំងស្រុងពី "សន្លឹកកិច្ចការសិស្ស" ខាងលើ (ដូចគ្នាបេះបិទ) ប៉ុន្តែត្រូវបំពេញចម្លើយត្រឹមត្រូវសម្រាប់សំណួរនីមួយៗ (ផ្អែកលើខ្លឹមសារមេរៀនខាងលើ)។
២. អាចបំពេញចម្លើយជាអក្សរដិត (bold) ឬសរសេរក្នុងវង់ក្រចកដើម្បីងាយស្រួលចំណាំ។

សូមសរសេរចេញជាទម្រង់ Markdown ដែលមានរបៀបរៀបរយល្អ។ មិនបាច់សរសេរពាក្យណែនាំទេ ចាប់ផ្តើមសរសេរយកតែម្តង។\`;
          } else {
              promptText = \`អ្នកគឺជា\${teacherRole}។ សូមបង្កើត «សន្លឹកកិច្ចការគ្រូ និងអត្រាកំណែ (Teacher Worksheet)» ដោយផ្អែកលើកិច្ចតែងការបង្រៀន (ផ្តោតសំខាន់លើមេរៀនថ្មី) ខាងក្រោមនេះ។
{មុខវិជ្ជា៖ \${plan.subject}, មេរៀនទី \${plan.lesson}៖ \${plan.lessonTitle}, ថ្នាក់ទី៖ \${plan.grade}, រយៈពេល៖ \${plan.duration}នាទី}

វត្ថុបំណងមេរៀន៖
- វិជ្ជាសម្បទា៖ \${plan.objectives.knowledge}
- បំណិនសម្បទា៖ \${plan.objectives.skills}

ខ្លឹមសារមេរៀនថ្មី (ពីកិច្ចតែងការ)៖
\${contentStr}

គោលបំណងសន្លឹកកិច្ចការគ្រូ៖ ជាសន្លឹកកិច្ចការសិស្ស ដែលមានរួមបញ្ចូលនូវចម្លើយ (អត្រាកំណែ) សម្រាប់គ្រូ។
ទម្រង់ទាមទារ៖
១. ផ្នែកក្បាល៖ ឈ្មោះសិស្ស, ថ្នាក់ទី, ថ្ងៃខែ, ពិន្ទុ
២. ផ្នែកលំហាត់/សំនួរ៖ បង្កើតសំនួរ លំហាត់ ផ្គូផ្គង ឬលំហាត់អនុវត្ត ដែលទាញចេញពី "ខ្លឹមសារមេរៀនថ្មី" ខាងលើ ដោយមានបំពេញចម្លើយត្រឹមត្រូវជាអក្សរដិត (bold) ឬសរសេរក្នុងវង់ក្រចក។

សូមសរសេរចេញជាទម្រង់ Markdown ដែលមានរបៀបរៀបរយល្អ។ មិនបាច់សរសេរពាក្យណែនាំទេ ចាប់ផ្តើមសរសេរយកតែម្តង។\`;
          }
      }`;

lines.splice(46, 14, replacement);
fs.writeFileSync(file, lines.join('\n'));
console.log('Worksheet patched');
