import http from 'http';

const promptText = `អ្នកគឺជា «អ្នកជំនាញវិធីសាស្ត្របង្រៀនសតវត្សទី២១»... (I will just ask for a short one)
      សូមត្រលប់មកវិញតែជាទម្រង់ JSON object string ប៉ុណ្ណោះ ដោយមិនមាន markdown formatting (NO \`\`\`json) ហើយស្របតាមទម្រង់ដូចខាងក្រោម៖
      {
        "chapter": "១",
        "chapterTitle": "ចំណងជើងជំពូក",
        "lesson": "១",
        "objectives": {
          "knowledge": "រៀបរាប់...តាមរយៈ...បានត្រឹមត្រូវ។",
          "skills": "គណនា...ដោយប្រើ...បានរហ័ស។",
          "attitude": "សិស្សមានស្មារតី...ក្នុង...ដោយ...។"
        },
        "materials": {
          "teacher": "សៀវភៅពុម្ព...",
          "student": "សៀវភៅពុម្ព, ប៊ិច..."
        },
        "steps": {
          "step1": { "teacherActivity": "• ត្រួតពិនិត្យ៖\n  - អវត្តមាន\n  - សណ្ដាប់ធ្នាប់\n  - អនាម័យ", "content": "• រដ្ឋបាលថ្នាក់៖\n  - អវត្តមាន\n  - សណ្ដាប់ធ្នាប់\n  - អនាម័យ", "studentActivity": "• ប្រធានរាយការណ៍៖\n  - អវត្តមាន\n  - សណ្ដាប់ធ្នាប់\n  - អនាម័យ" },
          "step2": { "teacherActivity": "...", "content": "...", "studentActivity": "..." },
          "step3": { "teacherActivity": "...", "content": "...", "studentActivity": "..." },
          "step4": { "teacherActivity": "...", "content": "...", "studentActivity": "..." },
          "step5": { "teacherActivity": "...", "content": "...", "studentActivity": "..." }
        }
      }`;

const data = JSON.stringify({
  promptText: promptText,
  isJson: true
});

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/generateLessonPlan',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log('Response:', body));
});

req.on('error', e => console.error('Error:', e));
req.write(data);
req.end();
