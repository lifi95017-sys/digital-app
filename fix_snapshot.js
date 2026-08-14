import fs from 'fs';
let code = fs.readFileSync('src/lib/firebase.ts', 'utf8');

code = code.replace(
  `// Snapshot Listeners
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
};`,
  `// Snapshot Listeners
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
};`
);

fs.writeFileSync('src/lib/firebase.ts', code);
