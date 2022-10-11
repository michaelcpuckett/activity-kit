import { Db } from 'mongodb';
import { mockDatabaseService } from './mockDatabaseService';

describe('DatabaseService', () => {
  describe('findStringValueById', () => {
    const stringId = 'https://test.com/123';
    const stringValue = 'Hello world';

    const databaseService = mockDatabaseService({
      db: {
        findOne: jest.fn(() => ({
          _id: stringId,
          value: stringValue,
        })),
      } as unknown as Db,
    });

    it('should get value', async () => {
      const foundItem = await databaseService.findStringValueById(
        'foobar',
        stringId,
      );

      expect(foundItem).toBe(stringValue);
      expect(databaseService.db.collection).toBeCalledWith('foobar');
    });
  });
});
