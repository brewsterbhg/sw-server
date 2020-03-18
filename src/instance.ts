import { IDBPDatabase } from 'idb';

let instance: IDBPDatabase;

/**
 * Sets the database instance
 *
 * @param {IDBPDatabase} db
 * @returns {void}
 */
export function setDBInstance(db: IDBPDatabase): void {
  instance = db;
}

/**
 * Returns the database instance
 *
 * @returns {IDBPDatabase}
 */
export function getDBInstance(): IDBPDatabase {
  return instance;
}
