import 'jasmine';
import { AP } from 'activitypub-core-types';
import { handleLike } from '../../src/outbox/sideEffects/like';
import { actor1, actor1Id, actor1LikedId, likeActivity, likeActivityId, note1, note1Id, note1LikesId } from '../../test_data';

describe('Outbox', () => {
  describe('Like Side Effect', () => {
    it('Handles Like Activity', async () => {
      const insertOrderedItemsArguments: URL[][] = [];

      await (handleLike as unknown as (activity: AP.Like) => Promise<void>).call({
        adapters: {
          db: {
            async queryById(entityId: URL) {
              if (entityId.toString() === actor1Id) {
                return actor1;
              }

              if (entityId.toString() === note1Id) {
                return note1;
              }
            },
            async insertOrderedItem(collectionId: URL, itemToInsert: URL) {
              insertOrderedItemsArguments.push([collectionId, itemToInsert]);
            },
          }
        }
      }, likeActivity);
      
      expect(`${insertOrderedItemsArguments[0][0]}`).toBe(actor1LikedId);
      expect(`${insertOrderedItemsArguments[0][1]}`).toBe(note1Id);
      expect(`${insertOrderedItemsArguments[1][0]}`).toBe(note1LikesId);
      expect(`${insertOrderedItemsArguments[1][1]}`).toBe(likeActivityId);
    });
  });
});