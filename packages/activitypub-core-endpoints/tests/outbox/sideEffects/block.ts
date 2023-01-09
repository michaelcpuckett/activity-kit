import 'jasmine';
import { AP } from 'activitypub-core-types';
import { handleBlock } from '../../../src/outbox/sideEffects/block';
import { actor1, actor1Blocks, actor1BlocksId, actor1Id, blockActivity, blockActivityId } from '../../../test_data';

describe('Outbox', () => {
  describe('Block Side Effect', () => {
    it('Handles Block Activity', async () => {
      let collectionInsertedInto: URL|null = null;
      let insertedIntoCollection: URL|null = null;

      await (handleBlock as unknown as (activity: AP.Block) => Promise<void>).call({
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
            async insertItem(collectionId: URL, itemToInsert: URL) {
              collectionInsertedInto = collectionId;
              insertedIntoCollection = itemToInsert;
            },
          }
        }
      }, blockActivity);
      
      expect(`${collectionInsertedInto}`).toBe(actor1BlocksId);
      expect(`${insertedIntoCollection}`).toBe(blockActivityId);
    });
  });
});