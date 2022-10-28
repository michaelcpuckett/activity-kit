import { Db } from 'mongodb';
import { mockDatabaseAdapter } from './mockDatabaseAdapter';

describe('DatabaseAdapter', () => {
  describe('findStringIdByValue', () => {
    const stringId = 'https://test.com/123';
    const stringValue = 'Hello world';

    const databaseAdapter = mockDatabaseAdapter({
      db: {
        findOne: jest.fn(() => ({
          _id: stringId,
          value: stringValue,
        })),
      } as unknown as Db,
    });

    it('should get string ID by value', async () => {
      const foundItem = await databaseAdapter.findStringIdByValue(
        'foobar',
        stringValue,
      );

      expect(foundItem).toBe(stringId);
      expect(databaseAdapter.db.collection).toBeCalledWith('foobar');
    });
  });
});
