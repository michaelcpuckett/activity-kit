import 'jasmine';
import { AP } from 'activitypub-core-types';
import { handleAdd } from '../../../src/outbox/sideEffects/add';
import { actor1Examples, actor1ExamplesId, addActivity, example2Id } from '../../../test_data';

describe('Outbox', () => {
  describe('Add Side Effect', () => {
    it('Handles Add Activity', async () => {
      let collectionInsertedInto: URL|null = null;
      let insertedIntoCollection: URL|null = null;

      await (handleAdd as unknown as (activity: AP.Add) => Promise<void>).call({
        adapters: {
          db: {
            async findEntityById(entityId: URL) {
              if (entityId.toString() === actor1ExamplesId) {
                return actor1Examples;
              }
            },
            async insertItem(collectionId: URL, itemToInsert: URL) {
              collectionInsertedInto = collectionId;
              insertedIntoCollection = itemToInsert;
            },
          }
        }
      }, addActivity);
      
      expect(`${collectionInsertedInto}`).toBe(actor1ExamplesId);
      expect(`${insertedIntoCollection}`).toBe(example2Id);
    });
  });
});