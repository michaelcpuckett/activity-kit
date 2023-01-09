import 'jasmine';
import { AP } from 'activitypub-core-types';
import { handleUpdate } from '../../../src/outbox/sideEffects/update';
import { actor1, actor1Id, note1, note1Id, updateActivity } from '../../../test_data';

describe('Outbox', () => {
  describe('Update Side Effect', () => {
    it('Handles Update Activity', async () => {
      let updatedObject: AP.Entity|null = null;

      await (handleUpdate as unknown as (activity: AP.Update) => Promise<void>).call({
        adapters: {
          db: {
            async findEntityById(entityId: URL) {
              if (`${entityId}` === actor1Id) {
                return {
                  ...actor1,
                };
              }

              if (`${entityId}` === note1Id) {
                return {
                  ...note1,
                };
              }
            },
            async saveEntity(entity: AP.Entity) {
              updatedObject = entity;
            }
          }
        }
      }, {
        ...updateActivity
      });
      
      expect(updatedObject && 'updated' in updatedObject).toBeTrue();
    });
  });
});