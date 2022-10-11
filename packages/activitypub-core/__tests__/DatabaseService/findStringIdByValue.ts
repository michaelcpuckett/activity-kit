import { Db } from 'mongodb';
import { mockDatabaseService } from './mockDatabaseService';

describe('DatabaseService', () => {
  describe('findStringIdByValue', () => {
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

    it('should get string ID by value', async () => {
      const foundItem = await databaseService.findStringIdByValue(
        'foobar',
        stringValue,
      );

      expect(foundItem).toBe(stringId);
      expect(databaseService.db.collection).toBeCalledWith('foobar');
    });
  });
});
