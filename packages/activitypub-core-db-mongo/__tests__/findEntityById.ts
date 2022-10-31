import { Db } from 'mongodb';
import { mockDbAdapter } from './mockDbAdapter';
import { AP } from 'activitypub-core-types';

describe('DbAdapter', () => {
  describe('findOne', () => {
    const object1Url = 'https://test.com/entity/123';
    const object1Result: AP.Note = {
      id: new URL(object1Url),
      url: new URL(object1Url),
      type: 'Note',
      content: 'Test',
    };

    const dbAdapter = mockDbAdapter({
      db: {
        findOne: jest.fn(({ _id }) => {
          if (_id === object1Url) {
            return JSON.parse(
              JSON.stringify({
                _id: object1Url,
                ...object1Result,
              }),
            );
          }
          return null;
        }),
      } as unknown as Db,
    });

    it('should find local object and strip _id', async () => {
      const foundItem = await dbAdapter.findEntityById(new URL(object1Url));

      expect(foundItem).toMatchObject(object1Result);
      expect(dbAdapter.db.collection).toBeCalledWith('object');
    });
  });
});
