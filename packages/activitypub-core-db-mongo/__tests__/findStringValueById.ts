import { Db } from 'mongodb';
import { mockDbAdapter } from './mockDbAdapter';

describe('DbAdapter', () => {
  describe('findStringValueById', () => {
    const stringId = 'https://test.com/123';
    const stringValue = 'Hello world';

    const dbAdapter = mockDbAdapter({
      db: {
        findOne: jest.fn(() => ({
          _id: stringId,
          value: stringValue,
        })),
      } as unknown as Db,
    });

    it('should get value', async () => {
      const foundItem = await dbAdapter.findStringValueById('foobar', stringId);

      expect(foundItem).toBe(stringValue);
      expect(dbAdapter.db.collection).toBeCalledWith('foobar');
    });
  });
});
