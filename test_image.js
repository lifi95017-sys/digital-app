const fetch = require('node-fetch');
fetch('https://image.pollinations.ai/prompt/Truth%20Table%20simple%20illustration?width=400&height=400&nologo=true')
  .then(res => console.log(res.status, res.headers.get('content-type')))
  .catch(err => console.error(err));
