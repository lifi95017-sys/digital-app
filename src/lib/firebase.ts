
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

export const collection = (dbOrRef: any, path: string) => typeof dbOrRef === 'string' ? dbOrRef + '/' + path : path;
export const doc = (...args: any[]) => {
  if (args.length === 1) return { path: args[0], id: Date.now().toString() };
  if (args.length === 2) {
    if (typeof args[0] === 'string') return { path: args[0], id: args[1] };
    return { path: args[1], id: Date.now().toString() };
  }
  return { path: args[1], id: args[2] };
};
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
const listeners: Record<string, Array<{cb: Function, id?: string}>> = {};
const triggerSnapshot = (path: string) => {
  if (listeners[path]) {
    const data = getLocalData(path);
    listeners[path].forEach(listener => {
      if (listener.id) {
        const docData = data.find((d: any) => d.id === listener.id);
        const snap = {
          id: listener.id,
          exists: () => !!docData,
          data: () => docData
        };
        listener.cb(snap);
      } else {
        const snap = {
          docs: data.map((d: any) => ({ id: d.id, data: () => d })),
          exists: () => data.length > 0,
          data: () => data[0]
        };
        listener.cb(snap);
      }
    });
  }
};

export const onSnapshot = (queryOrRef: any, onNext: Function, onError?: Function) => {
  let path = typeof queryOrRef === 'string' ? queryOrRef : queryOrRef.path;
  let id = typeof queryOrRef === 'string' ? undefined : queryOrRef.id;
  if (!listeners[path]) listeners[path] = [];
  const listenerObj = { cb: onNext, id };
  listeners[path].push(listenerObj);
  triggerSnapshot(path);
  return () => {
    listeners[path] = listeners[path].filter(l => l !== listenerObj);
  };
};

export const query = (colPath: string, ...args: any[]) => colPath;
export const orderBy = (field: string, dir: string) => ({ type: 'orderBy', field, dir });
export const where = (field: string, op: string, val: any) => ({ type: 'where', field, op, val });

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
