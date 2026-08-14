import fs from 'fs';
let c = fs.readFileSync('server.ts', 'utf8');
c = c.replace(/console\.error\(\\\`Model API error with \\\$\{modelsToTry\[currentModelIndex\]\} \(\\\$\{errorMessage\}\)\\\`\);/g, "console.error(`Model API error with ${modelsToTry[currentModelIndex]} (${errorMessage})`);");
c = c.replace(/console\.log\(\\\`Retrying SEA-PLM generation\.\.\. \(\\\$\{retries\} retries left\)\\\`\);/g, "console.log(`Retrying SEA-PLM generation... (${retries} retries left)`);");
c = c.replace(/res\.write\(\\\`data: \\\$\{JSON\.stringify\(\{ text: chunk\.text \}\)\}\\\\n\\\\n\\\`\);/g, "res.write(`data: ${JSON.stringify({ text: chunk.text })}\\n\\n`);");
fs.writeFileSync('server.ts', c);
