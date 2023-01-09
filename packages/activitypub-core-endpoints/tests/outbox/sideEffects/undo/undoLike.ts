import 'jasmine';
import { AP } from 'activitypub-core-types';
import { handleUndoLike } from '../../../../src/outbox/sideEffects/undo/undoLike';
import { actor1, actor1Id, actor1LikedId, likeActivity, likeActivityId, note1, note1Id, note1LikesId } from '../../../../test_data';

describe('Outbox', () => {
  describe('Undo Like Side Effect', () => {
    it('Handles Undo Like Activity', async () => {
      const removeOrderedItemsArguments: URL[][] = [];

      await (handleUndoLike as unknown as (activity: AP.Like) => Promise<void>).call({
        adapters: {
          db: {
            async queryById(entityId: URL) {
              if (entityId.toString() === actor1Id) {
                return {
                  ...actor1,
                };
              }

              if (entityId.toString() === note1Id) {
                return {
                  ...note1,
                };
              }
            },
            async removeOrderedItem(collectionId: URL, itemToRemove: URL) {
              removeOrderedItemsArguments.push([collectionId, itemToRemove]);
            },
          }
        }
      }, {
        ...likeActivity,
      });
      
      expect(`${removeOrderedItemsArguments[0][0]}`).toBe(actor1LikedId);
      expect(`${removeOrderedItemsArguments[0][1]}`).toBe(note1Id);
      expect(`${removeOrderedItemsArguments[1][0]}`).toBe(note1LikesId);
      expect(`${removeOrderedItemsArguments[1][1]}`).toBe(likeActivityId);
    });
  });
});