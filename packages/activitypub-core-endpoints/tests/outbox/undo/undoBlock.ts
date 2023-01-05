import 'jasmine';
import { AP } from 'activitypub-core-types';
import { handleUndoBlock } from '../../../src/outbox/sideEffects/undo/undoBlock';
import { actor1, actor1Blocks, actor1BlocksId, actor1Id, blockActivity, blockActivityId } from '../../../test_data';

describe('Outbox', () => {
  describe('Undo Block Side Effect', () => {
    it('Handles Undo Block Activity', async () => {
      let collectionRemovedFrom: URL|null = null;
      let removedFromCollection: URL|null = null;

      await (handleUndoBlock as unknown as (activity: AP.Block) => Promise<void>).call({
        adapters: {
          db: {
            async getStreamByName(actor: AP.Actor, name: string) {
              if (actor.id?.toString() === actor1Id && name === 'Blocks') {
                return actor1Blocks;
              }
            },
            async queryById(entityId: URL) {
              if (entityId.toString() === actor1Id) {
                return actor1;
              }
            },
            async removeItem(collectionId: URL, itemToRemove: URL) {
              collectionRemovedFrom = collectionId;
              removedFromCollection = itemToRemove;
            },
          }
        }
      }, blockActivity);
      
      expect(`${collectionRemovedFrom}`).toBe(actor1BlocksId);
      expect(`${removedFromCollection}`).toBe(blockActivityId);
    });
  });
});