import {
  createStore,
  setupTransaction,
  getObjectStore,
  find,
  add,
  remove,
} from '../db';
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
          get: jest.fn(),
          put: jest.fn(),
          delete: jest.fn(),
        }),
      }),
      clear: jest.fn(),
      count: jest.fn(),
      countFromIndex: jest.fn(),
      delete: jest.fn(),
      get: jest.fn().mockImplementation((_storeName, id) => {
        const data = new Map([[42, 'test']]);
        return data.get(id);
      }),
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
      const getSpy = jest.spyOn(mockedDB, 'get');
      const id = 1;

      find(STORE_NAME, id.toString());

      expect(getSpy).toHaveBeenCalledWith(STORE_NAME, id);
      expect(getSpy).toReturnWith(undefined);
    });

    it('returns item if found', () => {
      const getSpy = jest.spyOn(mockedDB, 'get');
      const id = 42;

      find(STORE_NAME, id.toString());

      expect(getSpy).toHaveBeenCalledWith(STORE_NAME, id);
      expect(getSpy).toReturnWith('test');
    });
  });

  // describe('add', () => {
  //   it('calls the put method on the store', () => {
  //     const putSpy = jest.spyOn(mockedDB.transaction().objectStore(), 'put');
  //     const data = { test: 'test' };

  //     add(STORE_NAME, data);

  //     expect(putSpy).toHaveBeenCalledWith(data);
  //   });
  // });

  // describe('remove', () => {
  //   it('calls the delete method on the store', () => {
  //     const tx = mockedDB.transaction();
  //     const objectStore = tx.objectStore();
  //     const deleteSpy = jest.spyOn(objectStore, 'delete');
  //     const id = 42;

  //     remove(STORE_NAME, id);

  //     expect(deleteSpy).toHaveBeenCalledWith(id);
  //   });
  // });
});
