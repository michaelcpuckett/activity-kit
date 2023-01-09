import 'jasmine';
import { AP } from 'activitypub-core-types';
import { handleAnnounce } from '../../../src/inbox/sideEffects/announce';
import { actor1, actor1Id, actor1Shared, actor1SharedId, announceActivity, announceActivityId, note1, note1Id, note1SharesId, note1Shares } from '../../../test_data';

describe('Inbox', () => {
  describe('Announce Side Effect', () => {
    it('Handles Announce Activity', async () => {
      let collectionInsertedInto: URL|null = null;
      let insertedIntoCollection: URL|null = null;

      await (handleAnnounce as unknown as (activity: AP.Announce, recipient: AP.Actor) => Promise<void>).call({
        adapters: {
          db: {
            async findEntityById(entityId: URL) {
              if (`${entityId}` === note1Id) {
                return note1;
              }

              if (`${entityId}` === note1SharesId) {
                return note1Shares;
              }
            },
            async insertItem(collectionId: URL, itemToInsert: URL) {
              collectionInsertedInto = collectionId;
              insertedIntoCollection = itemToInsert;
            },
          }
        }
      }, announceActivity, actor1);
      
      expect(`${collectionInsertedInto}`).toBe(note1SharesId);
      expect(`${insertedIntoCollection}`).toBe(announceActivityId);
    });
  });
});