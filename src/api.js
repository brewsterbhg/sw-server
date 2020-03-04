import 'regenerator-runtime/runtime';
import { openDB, deleteDB } from 'idb';
import { schema } from '../example/schema/schema.json';

// const READ_ACCESS = "readonly";
const WRITE_ACCESS = 'readwrite';
const DB_NAME = 'sw-server';
const VERSION = 1;

let db;

export async function initDB() {
  if (!schema) {
    throw new Error('Schema must be provided to initialize database!');
  }

  db = await openDB(DB_NAME, VERSION, {
    upgrade(db) {
      schema.forEach(async store => {
        await createStore(db, store);
      });
    },
  });
}

export async function createNewStore(store) {
  db = await openDB(DB_NAME, VERSION, {
    async upgrade(db) {
      await createStore(db, store);
    },
  });
}

async function createStore(db, store) {
  const { storeName, keyPath, autoIncrement } = store;

  if (!db.objectStoreNames.contains(storeName)) {
    await db.createObjectStore(storeName, { keyPath, autoIncrement });
  }
}

export async function removeDB() {
  await deleteDB(DB_NAME);
}

export async function seedData() {
  schema.forEach(async store => {
    const { storeName, data } = store;

    data.forEach(item => {
      add(storeName, item);
    });
  });
}

export async function find(storeName, key) {
  return await db
    .transaction(storeName)
    .objectStore(storeName)
    .get(key);
}

export async function add(storeName, data) {
  const { tx, store } = await setupTransaction(storeName);
  await store.put(data);
  await tx.done;
}

export async function remove(storeName, key) {
  const { tx, store } = await setupTransaction(storeName);
  await store.delete(key);
  await tx.done;
}

async function setupTransaction(storeName) {
  const tx = db.transaction(storeName, WRITE_ACCESS);
  const store = await tx.objectStore(storeName);
  return { tx, store };
}
