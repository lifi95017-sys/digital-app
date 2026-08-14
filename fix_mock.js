import fs from 'fs';
let code = fs.readFileSync('src/lib/firebase.ts', 'utf8');

code = code.replace(
  `export const collection = (db: any, path: string) => path;
export const doc = (db: any, path: string, id?: string) => ({ path, id: id || Date.now().toString() });`,
  `export const collection = (dbOrRef: any, path: string) => typeof dbOrRef === 'string' ? dbOrRef + '/' + path : path;
export const doc = (...args: any[]) => {
  if (args.length === 1) return { path: args[0], id: Date.now().toString() };
  if (args.length === 2) {
    if (typeof args[0] === 'string') return { path: args[0], id: args[1] };
    return { path: args[1], id: Date.now().toString() };
  }
  return { path: args[1], id: args[2] };
};`
);

fs.writeFileSync('src/lib/firebase.ts', code);
