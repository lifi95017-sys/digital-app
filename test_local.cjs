const http = require('http');
const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/generateLessonPlan',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
}, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Response:', res.statusCode, data));
});
req.write(JSON.stringify({
  topic: 'សត្វ',
  grade: 'ទី៣',
  duration: '១ម៉ោង'
}));
req.end();
