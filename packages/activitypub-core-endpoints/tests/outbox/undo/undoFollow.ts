import 'jasmine';
import { AP } from 'activitypub-core-types';
import { handleUndoFollow } from '../../../src/outbox/sideEffects/undo/undoFollow';
import { followActivity, actor1Id, actor1FollowingId, actor2Id, actor1, actor2 } from '../../../test_data';

describe('Outbox', () => {
  describe('Undo Follow Side Effect', () => {
    it('Handles Undo Follow Activity', async () => {
      let collectionRemovedFrom: URL|null = null;
      let removedFromCollection: URL|null = null;

      await (handleUndoFollow as unknown as (activity: AP.Follow) => Promise<void>).call({
        adapters: {
          db: {
            async queryById(entityId: URL) {
              if (`${entityId}` === actor1Id) {
                return actor1;
              }

              if (`${entityId}` === actor2Id) {
                return actor2;
              }
            },
            async removeItem(collectionId: URL, itemToRemove: URL) {
              collectionRemovedFrom = collectionId;
              removedFromCollection = itemToRemove;
            },
          }
        }
      }, followActivity);
      
      expect(`${collectionRemovedFrom}`).toBe(actor1FollowingId);
      expect(`${removedFromCollection}`).toBe(actor2Id);
    });
  });
});