import 'regenerator-runtime/runtime';
import {
  openDB,
  deleteDB,
  IDBPDatabase,
  IDBPObjectStore,
  IDBPTransaction,
} from 'idb';

import { schema } from '../schema';
import { Store } from './interfaces';

const WRITE_ACCESS = 'readwrite';
const DB_NAME = 'sw-server';
const VERSION = 1;

let db: IDBPDatabase;

/**
 * Create a new IndexedDB store
 *
 * @param {IDBPDatabase} db
 * @param {Store} store
 * @returns {Promise<void>}
 */
export async function createStore(
  db: IDBPDatabase,
  store: Store,
): Promise<void> {
  const { storeName, keyPath, autoIncrement } = store;

  if (!db.objectStoreNames.contains(storeName)) {
    db.createObjectStore(storeName, { keyPath, autoIncrement });
  }
}

/**
 * Prepare an IndexedDB transaction
 *
 * @param {string} storeName
 * @returns {Promise<IDBPTransaction>}
 */
export async function setupTransaction(
  storeName: string,
): Promise<IDBPTransaction<unknown, [string]>> {
  return db.transaction(storeName, WRITE_ACCESS);
}

/**
 * Return an IndexedDB store by name
 *
 * @param {string} storeName
 * @param {IDBPTransaction} tx
 * @returns {Promsie<IDBPObjectStore>}
 */
export async function getObjectStore(
  storeName: string,
  tx: IDBPTransaction<unknown, [string]>,
): Promise<IDBPObjectStore> {
  return tx.objectStore(storeName);
}

/**
 * Find a value in a store by id
 *
 * @param {string} storeName
 * @param {number} id
 * @returns {Promise<any>}
 */
export async function find(
  storeName: string,
  id: string | number,
): Promise<unknown> {
  return await db
    .transaction(storeName)
    .objectStore(storeName)
    .get(id);
}

/**
 * Add a new value to a store
 *
 * @param {string} storeName
 * @param {object} data
 * @returns {Promise<void>}
 */
export async function add(storeName: string, data: object): Promise<void> {
  const tx = await setupTransaction(storeName);
  const store: IDBPObjectStore = await getObjectStore(storeName, tx);
  await store.put(data);
  await tx.done;
}

/**
 * Remove a value from a store by id
 *
 * @param {string} storeName
 * @param {number} id
 * @returns {Promise<void>}
 */
export async function remove(
  storeName: string,
  id: string | number,
): Promise<void> {
  const tx = await setupTransaction(storeName);
  const store: IDBPObjectStore = await getObjectStore(storeName, tx);
  await store.delete(id);
  await tx.done;
}

/**
 * Open IndexedDB and seed with schema data
 *
 * @returns {Promise<void>}
 */
export async function seed(): Promise<void> {
  if (!schema) {
    throw new Error('Schema must be provided to initialize database!');
  }

  db = await openDB(DB_NAME, VERSION, {
    upgrade(db) {
      (schema as any).forEach(
        async (store: Store) => await createStore(db, store),
      );
    },
  });

  (schema as any).forEach(({ storeName = '', data = [] }: Partial<Store>) =>
    data.forEach(async (item: object) => await add(storeName, item)),
  );
}

/**
 * Remove the IndexedDB
 *
 * @returns {Promise<void>}
 */
export async function removeDB(): Promise<void> {
  await deleteDB(DB_NAME);
}
