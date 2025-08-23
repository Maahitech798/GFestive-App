import { openDB } from 'idb';

const DB_NAME = 'GaneshFestivalDB';
const STORE_NAME = 'mediaFiles';

export async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
}

export async function addMediaFile(file) {
  const db = await initDB();
  return db.add(STORE_NAME, file);
}

export async function getAllMedia() {
  const db = await initDB();
  return db.getAll(STORE_NAME);
}

export async function clearMedia() {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.objectStore(STORE_NAME).clear();
  await tx.done;
}

export async function deleteMediaById(id) {
  const db = await initDB();
  return db.delete(STORE_NAME, id);
}
