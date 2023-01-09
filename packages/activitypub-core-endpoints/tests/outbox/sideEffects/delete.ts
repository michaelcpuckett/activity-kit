import 'jasmine';
import { AP } from 'activitypub-core-types';
import { handleDelete } from '../../../src/outbox/sideEffects/delete';
import { deleteActivity, note1, note1Id } from '../../../test_data';
import { getId } from 'activitypub-core-utilities';

describe('Outbox', () => {
  describe('Delete Side Effect', () => {
    it('Handles Delete Activity', async () => {
      let deletedItem: URL|null|undefined;

      await (handleDelete as unknown as (activity: AP.Delete) => Promise<void>).call({
        adapters: {
          db: {
            saveEntity(entity: AP.Entity) {
              if (entity?.type === AP.ExtendedObjectTypes.TOMBSTONE) {
                deletedItem = getId(entity);
              }
            },
            findEntityById(entityId: URL) {
              if (entityId.toString() === note1Id) {
                return {
                  ...note1,
                };
              }
            }
          }
        }
      }, {
        ...deleteActivity,
      });
      
      expect(`${deletedItem}`).toBe(note1Id.toString());
    });
  });
});