import { mockDatabaseAdapter } from './mockDatabaseAdapter';
import { AP } from 'activitypub-core-types';
import { Db } from 'mongodb';
import { ACTIVITYSTREAMS_CONTEXT } from 'activitypub-core-utilities';

describe('DatabaseAdapter', () => {
  describe('queryById', () => {
    const object1Url = 'https://test.com/object/123';
    const object1Result: AP.Note = {
      '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
      id: new URL(object1Url),
      url: new URL(object1Url),
      type: 'Note',
      content: 'Test',
    };

    const databaseAdapter = mockDatabaseAdapter({
      db: {
        findOne: jest.fn(() => null),
      } as unknown as Db,
      fetch: async function (url: string) {
        return {
          json: async () => {
            if (url === object1Url) {
              return JSON.parse(JSON.stringify(object1Result));
            }

            return null;
          },
        };
      },
    });

    it('should expand remote object', async () => {
      const result = await databaseAdapter.queryById(new URL(object1Url));
      expect(result).toMatchObject(object1Result);
    });
  });
});
