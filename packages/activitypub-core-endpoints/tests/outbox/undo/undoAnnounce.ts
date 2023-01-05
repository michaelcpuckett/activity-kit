import 'jasmine';
import { AP } from 'activitypub-core-types';
import { handleUndoAnnounce } from '../../../src/outbox/sideEffects/undo/undoAnnounce';
import { actor1, actor1Id, actor1Shared, actor1SharedId, announceActivity, announceActivityId, note1, note1Id, note1SharesId } from '../../../test_data';

describe('Outbox', () => {
  describe('Undo Announce Side Effect', () => {
    it('Handles Undo Announce Activity', async () => {
      const removeOrderedItemsArguments: URL[][] = [];

      await (handleUndoAnnounce as unknown as (activity: AP.Announce) => Promise<void>).call({
        adapters: {
          db: {
            async getStreamByName(actor: AP.Actor, name: string) {
              if (actor.id?.toString() === actor1Id && name === 'Shared') {
                return actor1Shared;
              }
            },
            async queryById(entityId: URL) {
              if (`${entityId}` === actor1Id) {
                return actor1;
              }

              if (`${entityId}` === note1Id) {
                return note1;
              }
            },
            async removeOrderedItem(collectionId: URL, itemToRemove: URL) {
              removeOrderedItemsArguments.push([collectionId, itemToRemove]);
            },
          }
        }
      }, announceActivity);
      
      expect(`${removeOrderedItemsArguments[0][0]}`).toBe(actor1SharedId);
      expect(`${removeOrderedItemsArguments[0][1]}`).toBe(announceActivityId);
      expect(`${removeOrderedItemsArguments[1][0]}`).toBe(note1SharesId);
      expect(`${removeOrderedItemsArguments[1][1]}`).toBe(announceActivityId);
    });
  });
});