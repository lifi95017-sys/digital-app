import fs from 'fs';
let code = fs.readFileSync('src/lib/firebase.ts', 'utf8');

code += `
export const limit = (n: number) => ({ type: 'limit', n });
export const serverTimestamp = () => new Date().toISOString();
export const Timestamp = {
  now: () => ({ toDate: () => new Date(), toMillis: () => Date.now(), seconds: Math.floor(Date.now() / 1000) }),
  fromDate: (date: Date) => ({ toDate: () => date, toMillis: () => date.getTime(), seconds: Math.floor(date.getTime() / 1000) })
};
export const getDocs = async (queryOrRef: any) => {
  let path = typeof queryOrRef === 'string' ? queryOrRef : queryOrRef.path || queryOrRef;
  const data = JSON.parse(localStorage.getItem('mock_db_' + path) || '[]');
  return {
    docs: data.map((d: any) => ({ id: d.id, data: () => d, exists: () => true })),
    empty: data.length === 0,
    size: data.length,
    forEach: (cb: any) => data.forEach((d: any) => cb({ id: d.id, data: () => d, exists: () => true }))
  };
};
`;

fs.writeFileSync('src/lib/firebase.ts', code);
console.log("Mocks added");
