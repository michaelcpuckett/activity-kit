import 'jasmine';
import { AP } from 'activitypub-core-types';
import { handleRemove } from '../../../src/outbox/sideEffects/remove';
import { actor1Examples, actor1ExamplesId, removeActivity, example1Id } from '../../../test_data';

describe('Outbox', () => {
  describe('Remove Side Effect', () => {
    it('Handles Remove Activity', async () => {
      let collectionRemovedFrom: URL|null = null;
      let removedFromCollection: URL|null = null;

      await (handleRemove as unknown as (activity: AP.Remove) => Promise<void>).call({
        adapters: {
          db: {
            async findEntityById(entityId: URL) {
              if (entityId.toString() === actor1ExamplesId) {
                return actor1Examples;
              }
            },
            async removeItem(collectionId: URL, itemToRemove: URL) {
              collectionRemovedFrom = collectionId;
              removedFromCollection = itemToRemove;
            },
          }
        }
      }, removeActivity);
      
      expect(`${collectionRemovedFrom}`).toBe(actor1ExamplesId);
      expect(`${removedFromCollection}`).toBe(example1Id);
    });
  });
});