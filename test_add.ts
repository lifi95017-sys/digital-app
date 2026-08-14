import { addDoc, collection, db } from './src/lib/firebase.js';

async function test() {
  try {
    const res = await addDoc(collection(db, 'students'), { name: 'សិស្សថ្មី' });
    console.log("Success:", res);
  } catch (e) {
    console.error("Error:", e);
  }
}
test();
