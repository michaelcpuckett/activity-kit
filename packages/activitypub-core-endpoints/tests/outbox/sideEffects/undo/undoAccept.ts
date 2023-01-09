import 'jasmine';
import { AP } from 'activitypub-core-types';
import { handleUndoAccept } from '../../../../src/outbox/sideEffects/undo/undoAccept';
import { acceptActivity, actor1Id, actor2, actor2FollowersId, actor2Id, followActivity, followActivityId } from '../../../../test_data';

describe('Outbox', () => {
  describe('Undo Accept Side Effect', () => {
    it('Handles Undo Accept Activity', async () => {
      let collectionRemovedFrom: URL|null = null;
      let removedFromCollection: URL|null = null;

      await (handleUndoAccept as unknown as (activity: AP.Accept) => Promise<void>).call({
        adapters: {
          db: {
            async queryById(entityId: URL) {
              if (`${entityId}` === followActivityId) {
                return {
                  ...followActivity,
                };
              }
            },
            async findEntityById(entityId: URL) {
              if (`${entityId}` === actor2Id) {
                return {
                  ...actor2,
                };
              }
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
      
      expect(`${collectionRemovedFrom}`).toBe(actor2FollowersId);
      expect(`${removedFromCollection}`).toBe(actor1Id);
    });
  });
});