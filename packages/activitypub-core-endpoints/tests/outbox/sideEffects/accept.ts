import 'jasmine';
import { AP } from 'activitypub-core-types';
import { handleAccept } from '../../../src/outbox/sideEffects/accept';
import { acceptActivity, actor1Id, actor2, actor2FollowersId, actor2Id, actor2Requests, actor2RequestsId, followActivity, followActivityId } from '../../../test_data';

describe('Outbox', () => {
  describe('Accept Side Effect', () => {
    it('Handles Accept Activity', async () => {
      let collectionInsertedInto: URL|null = null;
      let insertedIntoCollection: URL|null = null;
      let collectionRemovedFrom: URL|null = null;
      let removedFromCollection: URL|null = null;

      await (handleAccept as unknown as (activity: AP.Accept) => Promise<void>).call({
        adapters: {
          db: {
            async queryById(url: URL) {
              if (url.toString() === actor2Id) {
                return {
                  ...actor2,
                };
              }
              
              if (url.toString() === followActivityId) {
                return {
                  ...followActivity,
                };
              }
            },
            async getStreamByName(actor: AP.Actor, name: string) {
              if (actor.id?.toString() === actor2Id && name === 'Requests') {
                return actor2Requests;
              }
            },
            async insertItem(collectionId: URL, itemToInsert: URL) {
              collectionInsertedInto = collectionId;
              insertedIntoCollection = itemToInsert;
            },
            async removeItem(collectionId: URL, itemToRemove: URL) {
              collectionRemovedFrom = collectionId;
              removedFromCollection = itemToRemove;
            },
          }
        }
      }, {
        ...acceptActivity,
      });

      expect(`${collectionInsertedInto}`).toBe(actor2FollowersId);
      expect(`${collectionRemovedFrom}`).toBe(actor2RequestsId);
      expect(`${insertedIntoCollection}`).toBe(actor1Id);
      expect(`${removedFromCollection}`).toBe(followActivityId);
    });
  });
});