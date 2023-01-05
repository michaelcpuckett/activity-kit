import 'jasmine';
import { AP } from 'activitypub-core-types';
import { handleLike } from '../../src/inbox/sideEffects/like';
import { likeActivity, likeActivityId, note1, note1Id, note1Likes, note1LikesId } from '../../test_data';

describe('Inbox', () => {
  describe('Like Side Effect', () => {
    it('Handles Like Activity', async () => {
      let collectionInsertedInto: URL|null = null;
      let insertedIntoCollection: URL|null = null;

      await (handleLike as unknown as (activity: AP.Like) => Promise<void>).call({
        adapters: {
          db: {
            async findEntityById(entityId: URL) {
              if (entityId?.toString() === note1Id) {
                return note1;
              }

              if (entityId?.toString() === note1LikesId) {
                return note1Likes;
              }
            },
            async insertItem(collectionId: URL, itemToInsert: URL) {
              collectionInsertedInto = collectionId;
              insertedIntoCollection = itemToInsert;
            },
          }
        }
      }, likeActivity);
      
      expect(`${collectionInsertedInto}`).toBe(note1LikesId);
      expect(`${insertedIntoCollection}`).toBe(likeActivityId);
    });
  });
});