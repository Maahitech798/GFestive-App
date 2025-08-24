import { openDB } from 'idb';

const DB_NAME = 'GFestiveAppDB';
const STORE_NAME = 'chandha';

export async function initChandhaDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
}

export async function addChandha(entry) {
  const db = await initChandhaDB();
  return db.add(STORE_NAME, entry);
}

export async function getAllChandha() {
  const db = await initChandhaDB();
  return db.getAll(STORE_NAME);
}

export async function deleteChandha(id) {
  const db = await initChandhaDB();
  return db.delete(STORE_NAME, id);
}

export async function updateChandha(entry) {
  const db = await initChandhaDB();
  return db.put(STORE_NAME, entry);
}
