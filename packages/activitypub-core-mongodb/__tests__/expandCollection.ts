import { mockDatabaseService } from './mockDatabaseService';
import { AP } from 'activitypub-core-types';
import { Db } from 'mongodb';

describe('DatabaseService', () => {
  describe('getCollectionItems', () => {
    const collection1Url = 'https://test.com/activity/123';
    const collection1Result: AP.Collection = {
      id: new URL(collection1Url),
      url: new URL(collection1Url),
      type: 'Collection',
      totalItems: 1,
      items: [
        new URL('https://test.com/activity/456'),
        new URL('https://test.com/activity/789'),
      ],
    };
    const item1Url = 'https://test.com/activity/456';
    const item1Result: AP.Note = {
      id: new URL(item1Url),
      url: new URL(item1Url),
      type: 'Note',
      content: 'Test',
    };
    const item2Url = 'https://test.com/activity/789';
    const item2Result: AP.Document = {
      id: new URL(item2Url),
      url: new URL(item2Url),
      type: 'Document',
      content: 'Test2',
    };

    const databaseService = mockDatabaseService({
      db: {
        findOne: jest.fn((matchingObject: { [key: string]: unknown }) => {
          if (matchingObject._id === collection1Url) {
            return {
              _id: collection1Url,
              ...JSON.parse(JSON.stringify(collection1Result)),
            };
          }

          if (matchingObject._id === item1Url) {
            return {
              _id: item1Url,
              ...JSON.parse(JSON.stringify(item1Result)),
            };
          }

          if (matchingObject._id === item2Url) {
            return {
              _id: item2Url,
              ...JSON.parse(JSON.stringify(item2Result)),
            };
          }

          return null;
        }),
      } as unknown as Db,
    });

    it('handles local URLs', async () => {
      const result = await databaseService.expandCollection(
        new URL(collection1Url),
      );
      expect(result).toStrictEqual({
        ...collection1Result,
        items: [item1Result, item2Result],
      });
    });
  });
});
