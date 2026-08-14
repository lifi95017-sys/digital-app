import fs from 'fs';
let c = fs.readFileSync('server.ts', 'utf8');
c = c.replace("const promptText = \\`ក្នុង", "const promptText = `ក្នុង");
c = c.replace("ឲ្យបានច្បាស់លាស់។\\`;", "ឲ្យបានច្បាស់លាស់។`;");
fs.writeFileSync('server.ts', c);
