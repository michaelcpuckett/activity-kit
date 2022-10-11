import { Db } from 'mongodb';
import { mockDatabaseService } from './mockDatabaseService';
import { AP } from 'activitypub-core-types';

describe('DatabaseService', () => {
  describe('findOne', () => {
    const object1Url = 'https://test.com/object/123';
    const object1Result: AP.Note = {
      id: new URL(object1Url),
      url: new URL(object1Url),
      type: 'Note',
      content: 'Test',
    };

    const databaseService = mockDatabaseService({
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
      const foundItem = await databaseService.findEntityById(
        new URL(object1Url),
      );

      expect(foundItem).toMatchObject(object1Result);
      expect(databaseService.db.collection).toBeCalledWith('object');
    });
  });
});
