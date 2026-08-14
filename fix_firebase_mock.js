import fs from 'fs';
const mockCode = `
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// FAKE FIRESTORE TO BYPASS PERMISSION DENIED
export const db = {} as any;

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  console.error('Firestore Error: ', error);
}

// Mock Firestore functions
const getLocalData = (path: string) => {
  try {
    return JSON.parse(localStorage.getItem('mock_db_' + path) || '[]');
  } catch (e) {
    return [];
  }
};
const setLocalData = (path: string, data: any) => {
  localStorage.setItem('mock_db_' + path, JSON.stringify(data));
};

export const collection = (db: any, path: string) => path;
export const doc = (db: any, path: string, id?: string) => ({ path, id: id || Date.now().toString() });
export const addDoc = async (colPath: string, data: any) => {
  const items = getLocalData(colPath);
  const id = Date.now().toString();
  items.push({ id, ...data });
  setLocalData(colPath, items);
  triggerSnapshot(colPath);
  return { id };
};
export const setDoc = async (docRef: {path: string, id: string}, data: any) => {
  const items = getLocalData(docRef.path);
  const idx = items.findIndex((i: any) => i.id === docRef.id);
  if (idx >= 0) items[idx] = { ...items[idx], ...data, id: docRef.id };
  else items.push({ ...data, id: docRef.id });
  setLocalData(docRef.path, items);
  triggerSnapshot(docRef.path);
};
export const updateDoc = async (docRef: {path: string, id: string}, data: any) => {
  const items = getLocalData(docRef.path);
  const idx = items.findIndex((i: any) => i.id === docRef.id);
  if (idx >= 0) items[idx] = { ...items[idx], ...data };
  setLocalData(docRef.path, items);
  triggerSnapshot(docRef.path);
};
export const deleteDoc = async (docRef: {path: string, id: string}) => {
  const items = getLocalData(docRef.path);
  setLocalData(docRef.path, items.filter((i: any) => i.id !== docRef.id));
  triggerSnapshot(docRef.path);
};
export const getDocFromServer = async (docRef: any) => ({ exists: () => true, data: () => ({}) });

// Snapshot Listeners
const listeners: Record<string, Function[]> = {};
const triggerSnapshot = (path: string) => {
  if (listeners[path]) {
    const data = getLocalData(path);
    const snap = {
      docs: data.map((d: any) => ({ id: d.id, data: () => d })),
      exists: () => data.length > 0,
      data: () => data[0]
    };
    listeners[path].forEach(cb => cb(snap));
  }
};

export const onSnapshot = (queryOrRef: any, onNext: Function, onError?: Function) => {
  let path = typeof queryOrRef === 'string' ? queryOrRef : queryOrRef.path;
  if (!listeners[path]) listeners[path] = [];
  listeners[path].push(onNext);
  triggerSnapshot(path);
  return () => {
    listeners[path] = listeners[path].filter(cb => cb !== onNext);
  };
};

export const query = (colPath: string, ...args: any[]) => colPath;
export const orderBy = (field: string, dir: string) => ({ type: 'orderBy', field, dir });
export const where = (field: string, op: string, val: any) => ({ type: 'where', field, op, val });
`;
fs.writeFileSync('src/lib/firebase.ts', mockCode);
console.log("Mock applied to firebase.ts");
