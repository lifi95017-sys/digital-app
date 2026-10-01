const fetch = require('node-fetch');
fetch('https://image.pollinations.ai/prompt/cute%20cartoon%20kids?width=400&height=400&nologo=true').then(res => {
  console.log('Pollinations status:', res.status, res.headers.get('content-type'));
}).catch(err => {
  console.error('Pollinations error:', err);
});
