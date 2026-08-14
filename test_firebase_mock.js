import { db, addDoc, collection, doc, setDoc, updateDoc, deleteDoc, getDocFromServer, onSnapshot, query, orderBy, where, OperationType, handleFirestoreError } from './src/lib/firebase.js';

console.log("Mock imported!");
console.log({ db, addDoc, collection });
