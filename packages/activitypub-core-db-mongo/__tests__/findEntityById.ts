import { Db } from 'mongodb';
import { mockDatabaseAdapter } from './mockDatabaseAdapter';
import { AP } from 'activitypub-core-types';

describe('DatabaseAdapter', () => {
  describe('findOne', () => {
    const object1Url = 'https://test.com/object/123';
    const object1Result: AP.Note = {
      id: new URL(object1Url),
      url: new URL(object1Url),
      type: 'Note',
      content: 'Test',
    };

    const databaseAdapter = mockDatabaseAdapter({
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
      const foundItem = await databaseAdapter.findEntityById(
        new URL(object1Url),
      );

      expect(foundItem).toMatchObject(object1Result);
      expect(databaseAdapter.db.collection).toBeCalledWith('object');
    });
  });
});
