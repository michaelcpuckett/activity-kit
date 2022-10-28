import { Db } from 'mongodb';
import { mockDatabaseAdapter } from './mockDatabaseAdapter';

describe('DatabaseAdapter', () => {
  describe('findStringValueById', () => {
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

    it('should get value', async () => {
      const foundItem = await databaseAdapter.findStringValueById(
        'foobar',
        stringId,
      );

      expect(foundItem).toBe(stringValue);
      expect(databaseAdapter.db.collection).toBeCalledWith('foobar');
    });
  });
});
