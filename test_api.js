import http from 'http';

const data = JSON.stringify({
  promptText: '{"test": "hello"}',
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
