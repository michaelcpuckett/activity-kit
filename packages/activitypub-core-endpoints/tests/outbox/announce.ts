import 'jasmine';
import { AP } from 'activitypub-core-types';
import { handleAnnounce } from '../../src/outbox/sideEffects/announce';
import { actor1, actor1Id, actor1Shared, actor1SharedId, announceActivity, announceActivityId, note1, note1Id, note1SharesId } from '../../test_data';

describe('Outbox', () => {
  describe('Announce Side Effect', () => {
    it('Handles Announce Activity', async () => {
      const insertOrderedItemsArguments: URL[][] = [];

      await (handleAnnounce as unknown as (activity: AP.Announce) => Promise<void>).call({
        adapters: {
          db: {
            async getStreamByName(actor: AP.Actor, name: string) {
              if (actor.id?.toString() === actor1Id && name === 'Shared') {
                return actor1Shared;
              }
            },
            async queryById(entityUrl: URL) {
              if (entityUrl.toString() === actor1Id) {
                return actor1;
              }

              if (entityUrl.toString() === note1Id) {
                return note1;
              }
            },
            async insertOrderedItem(collectionId: URL, itemToInsert: URL) {
              insertOrderedItemsArguments.push([collectionId, itemToInsert]);
            },
          }
        }
      }, announceActivity);
      
      expect(`${insertOrderedItemsArguments[0][0]}`).toBe(actor1SharedId);
      expect(`${insertOrderedItemsArguments[0][1]}`).toBe(announceActivityId);
      expect(`${insertOrderedItemsArguments[1][0]}`).toBe(note1SharesId);
      expect(`${insertOrderedItemsArguments[1][1]}`).toBe(announceActivityId);
    });
  });
});