import { createStore, setupTransaction, getObjectStore, find } from '../db';
import * as instance from '../instance';
import { WRITE_ACCESS } from '../constants/db';

jest.mock('../../schema', () => [
  {
    storeName: 'store1',
    autoIncrement: 'true',
    keyPath: 'id',
    data: [
      {
        foo: 'bar',
      },
    ],
  },
]);

const STORE_NAME = 'test';

describe('db', () => {
  let mockedDB: any;

  beforeEach(() => {
    jest.resetAllMocks();
    mockedDB = {
      objectStoreNames: {
        contains: jest.fn().mockReturnValue(false),
        item: jest.fn(),
        [Symbol.iterator]: jest.fn(),
        length: 1,
      },
      createObjectStore: jest.fn(),
      deleteObjectStore: jest.fn(),
      transaction: jest.fn().mockReturnValue({
        objectStore: jest.fn().mockReturnValue({
          get: jest.fn().mockImplementation(id => {
            const data = new Map([[42, 'test']]);
            return data.get(id);
          }),
          put: jest.fn(),
          delete: jest.fn(),
        }),
      }),
      clear: jest.fn(),
      count: jest.fn(),
      countFromIndex: jest.fn(),
      delete: jest.fn(),
      get: jest.fn(),
      getFromIndex: jest.fn(),
      getAll: jest.fn(),
      getAllFromIndex: jest.fn(),
      getAllKeys: jest.fn(),
      getAllKeysFromIndex: jest.fn(),
      getKey: jest.fn(),
      getKeyFromIndex: jest.fn(),
      deleteDB: jest.fn(),
    };

    jest.spyOn(instance, 'getDBInstance').mockReturnValue(mockedDB);
  });

  describe('createStore', () => {
    it('does not call createObjectStore if store name already exists', () => {
      const store = {
        storeName: STORE_NAME,
        keyPath: 'id',
        autoIncrement: true,
      };
      const createObjectStoreSpy = jest.spyOn(mockedDB, 'createObjectStore');

      mockedDB.objectStoreNames.contains = jest.fn().mockReturnValue(true);

      createStore(mockedDB, store);

      expect(createObjectStoreSpy).not.toHaveBeenCalled();
    });

    it('calls createObjectStore if store name does not exist', () => {
      const createObjectStoreSpy = jest.spyOn(mockedDB, 'createObjectStore');
      const storeParams = { keyPath: 'id', autoIncrement: true };

      createStore(mockedDB, {
        storeName: STORE_NAME,
        ...storeParams,
      });

      expect(createObjectStoreSpy).toHaveBeenCalledWith(
        STORE_NAME,
        storeParams,
      );
    });
  });

  describe('setupTransaction', () => {
    it('sets up a transaction', () => {
      const transactionSpy = jest.spyOn(mockedDB, 'transaction');

      setupTransaction(STORE_NAME);

      expect(transactionSpy).toHaveBeenCalledWith(STORE_NAME, WRITE_ACCESS);
    });
  });

  describe('getObjectStore', () => {
    it('calls transaction objectStore method', async () => {
      const tx = await setupTransaction(STORE_NAME);

      getObjectStore(STORE_NAME, tx);

      expect(tx.objectStore).toHaveBeenCalledWith(STORE_NAME);
    });
  });

  describe('find', () => {
    it('returns undefined if item is not found', () => {
      const tx = mockedDB.transaction();
      const objectStore = tx.objectStore();
      const getSpy = jest.spyOn(objectStore, 'get');
      const id = 1;

      find(STORE_NAME, id);

      expect(getSpy).toHaveBeenCalledWith(id);
      expect(getSpy).toReturnWith(undefined);
    });

    it('returns item if found', () => {
      const tx = mockedDB.transaction();
      const objectStore = tx.objectStore();
      const getSpy = jest.spyOn(objectStore, 'get');
      const id = 42;

      find(STORE_NAME, id);

      expect(getSpy).toHaveBeenCalledWith(id);
      expect(getSpy).toReturnWith('test');
    });
  });
});
