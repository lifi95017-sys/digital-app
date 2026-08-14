import fs from 'fs';
let content = fs.readFileSync('src/components/LessonPlanForm.tsx', 'utf8');

// Replace alert with alert containing Khmer explanation
const oldAlert = 'alert(`មានបញ្ហាក្នុងការបង្កើតកិច្ចតែងការ៖ ${error.message || "AI API Error"}`);';
const newAlert = 'alert(`មានបញ្ហាក្នុងការបង្កើតកិច្ចតែងការ៖ ${error.message || "AI API Error"}\\n\\n(បញ្ជាក់៖ គណនីឥតគិតថ្លៃប្រចាំថ្ងៃប្រហែលជាអស់កូតាហើយ។ សូមចូលទៅកាន់ Settings ដើម្បីបញ្ចូល API Key ផ្ទាល់ខ្លួនរបស់អ្នក។)`);';

content = content.replace(oldAlert, newAlert);
fs.writeFileSync('src/components/LessonPlanForm.tsx', content);
