import fs from 'fs';
let c = fs.readFileSync('server.ts', 'utf8');
c = c.replace(/\\n  \/\/ Vite middleware for development/g, '\n  // Vite middleware for development');
fs.writeFileSync('server.ts', c);
