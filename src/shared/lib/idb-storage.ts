const dbCache = new Map<string, Promise<IDBDatabase>>();

function openDB(dbName: string): Promise<IDBDatabase> {
  let cached = dbCache.get(dbName);
  if (!cached) {
    cached = new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore('data');
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    cached.catch(() => dbCache.delete(dbName));
    dbCache.set(dbName, cached);
  }
  return cached;
}

function tx(db: IDBDatabase, mode: IDBTransactionMode, cb: (store: IDBObjectStore) => IDBRequest): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const store = db.transaction('data', mode).objectStore('data');
    const req = cb(store);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export function createIdbStorage(dbName: string) {
  return {
    getItem: async (key: string): Promise<string | null> => {
      const db = await openDB(dbName);
      return (await tx(db, 'readonly', (s) => s.get(key))) as string | null;
    },
    setItem: async (key: string, value: string): Promise<void> => {
      const db = await openDB(dbName);
      await tx(db, 'readwrite', (s) => s.put(value, key));
    },
    removeItem: async (key: string): Promise<void> => {
      const db = await openDB(dbName);
      await tx(db, 'readwrite', (s) => s.delete(key));
    },
  };
}
