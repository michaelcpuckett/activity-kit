import { mockDatabaseService } from './mockDatabaseService';
import { AP } from 'activitypub-core-types';
import { Db } from 'mongodb';
import { ACTIVITYSTREAMS_CONTEXT } from '../../src/globals';

describe('DatabaseService', () => {
  describe('expandEntity', () => {
    const activity1Url = 'https://test.com/activity/123';
    const actor1Url = 'https://test.com/actor/123';
    const object1Url = 'https://test.com/object/123';
    const activity1: AP.Create = {
      "@context": new URL(ACTIVITYSTREAMS_CONTEXT),
      id: new URL(activity1Url),
      url: new URL(activity1Url),
      type: 'Create',
      actor: new URL(actor1Url),
      object: new URL(object1Url),
    };
    const actor1: AP.Person = {
      "@context": new URL(ACTIVITYSTREAMS_CONTEXT),
      id: new URL(actor1Url),
      url: new URL(actor1Url),
      type: 'Person',
      inbox: new URL(`${actor1Url}/inbox`),
      outbox: new URL(`${actor1Url}/outbox`),
    };
    const object1: AP.Note = {
      "@context": new URL(ACTIVITYSTREAMS_CONTEXT),
      id: new URL(object1Url),
      url: new URL(object1Url),
      type: 'Note',
      content: 'Test',
    };
    const activity1Result: AP.Create = {
      "@context": new URL(ACTIVITYSTREAMS_CONTEXT),
      id: new URL(activity1Url),
      url: new URL(activity1Url),
      type: 'Create',
      actor: actor1,
      object: object1,
    };

    const databaseService = mockDatabaseService({
      db: {
        findOne: jest.fn((matchingObject: { [key: string]: unknown }) => {
          if (matchingObject._id === object1Url) {
            return JSON.parse(JSON.stringify(object1));
          }
          if (matchingObject._id === actor1Url) {
            return JSON.parse(JSON.stringify(actor1));
          }
          if (matchingObject._id === activity1Url) {
            return JSON.parse(JSON.stringify(activity1));
          }
          return null;
        }),
      } as unknown as Db,
    });

    it('should expand local activity', async () => {
      const result = await databaseService.expandEntity(activity1);
      expect(result).toMatchObject(activity1Result);
    });
  });
});
