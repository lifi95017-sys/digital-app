import http from 'http';

const promptText = `សូមវិភាគអត្ថបទមេរៀននេះ រួចទាញយកវិធីសាស្ត្របង្រៀននិងយុទ្ធវិធីបង្រៀនដែលស័ក្តិសមបំផុត (រើសយកតែ ១ ទៅ ២ វិធីសាស្ត្រ និងយុទ្ធវិធីដែលពាក់ព័ន្ធបំផុត) ។
សូមត្រលប់មកវិញតែទម្រង់ JSON ប៉ុណ្ណោះ ដូចខាងក្រោម៖
{
  "teachingMethod": "ឈ្មោះវិធីសាស្ត្របង្រៀន (ឧទាហរណ៍៖ ការរៀនតាមបែបរិះរក - Inquiry-Based Learning)",
  "strategy": "ឈ្មោះយុទ្ធវិធីបង្រៀន (ឧទាហរណ៍៖ K-W-L, Think-Pair-Share...)",
  "objectives": {
    "knowledge": "វត្ថុបំណងផ្នែកចំណេះដឹង",
    "skills": "វត្ថុបំណងផ្នែកបំណិន",
    "attitude": "វត្ថុបំណងផ្នែកឥរិយាបថ"
  }
}
អត្ថបទមេរៀន៖ មេរៀនទី១ ការបូកលេខ`;

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
