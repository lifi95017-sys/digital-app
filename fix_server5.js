import fs from 'fs';
let c = fs.readFileSync('server.ts', 'utf8');

c = c.replace(/console\.error\(\\\`Model API error/g, 'console.error(`Model API error');
c = c.replace(/\(\\\$\{errorMessage\}\)\\\`\);/g, '(${errorMessage})`);');
c = c.replace(/console\.log\(\\\`Retrying SEA/g, 'console.log(`Retrying SEA');
c = c.replace(/left\)\\\`\);/g, 'left)`);');
c = c.replace(/res\.write\(\\\`data: \\\$\{JSON\.stringify\(\{ text: chunk\.text \}\)\}\\n\\n\\\`\);/g, 'res.write(`data: ${JSON.stringify({ text: chunk.text })}\\n\\n`);');
c = c.replace(/res\.write\(\\\`data: /g, 'res.write(`data: ');
c = c.replace(/\}\)\}\\\\n\\\\n\\\`\);/g, '})}\\n\\n`);');
c = c.replace(/\}\)\}\\n\\n\\\`\);/g, '})}\\n\\n`);');

fs.writeFileSync('server.ts', c);
