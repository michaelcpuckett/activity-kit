import { mockDatabaseService } from './mockDatabaseService';
import { AP } from 'activitypub-core-types';
import { Db } from 'mongodb';
import { ACTIVITYSTREAMS_CONTEXT } from '../../src/globals';

describe('DatabaseService', () => {
  describe('getCollectionItems', () => {
    const item1Url = 'https://test.com/activity/456';
    const item1Result: AP.Note = {
      "@context": new URL(ACTIVITYSTREAMS_CONTEXT),
      id: new URL(item1Url),
      url: new URL(item1Url),
      type: 'Note',
      content: 'Test',
    };
    const item2Url = 'https://test.com/activity/789';
    const item2Result: AP.Document = {
      "@context": new URL(ACTIVITYSTREAMS_CONTEXT),
      id: new URL(item2Url),
      url: new URL(item2Url),
      type: 'Document',
      content: 'Test2',
    };

    const collection1Url = 'https://test.com/activity/123';
    const collection1Result: AP.Collection = {
      "@context": new URL(ACTIVITYSTREAMS_CONTEXT),
      id: new URL(collection1Url),
      url: new URL(collection1Url),
      type: 'Collection',
      totalItems: 1,
      items: [new URL(item1Url), new URL(item2Url)],
    };

    const databaseService = mockDatabaseService({
      db: {
        findOne: jest.fn((matchingObject) => {
          if (matchingObject._id === collection1Url) {
            return JSON.parse(JSON.stringify(collection1Result));
          }

          if (matchingObject._id === item1Url) {
            return JSON.parse(JSON.stringify(item1Result));
          }

          if (matchingObject._id === item2Url) {
            return JSON.parse(JSON.stringify(item2Result));
          }

          return null;
        }),
      } as unknown as Db,
    });

    it('handles local URLs', async () => {
      const items = await databaseService.getCollectionItems(
        new URL(collection1Url),
      );
      expect(items).toStrictEqual([item1Result, item2Result]);
    });
  });
});
