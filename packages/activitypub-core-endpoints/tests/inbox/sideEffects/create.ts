import 'jasmine';
import { AP } from 'activitypub-core-types';
import { handleCreate } from '../../../src/inbox/sideEffects/create';
import { actor1, createActivityWithObject, note1, note1Id, note1Replies, note1RepliesId, note2, note2Id } from '../../../test_data';
import { getId } from 'activitypub-core-utilities';

describe('Inbox', () => {
  describe('Create Side Effect', () => {
    it('Handles Create Activity', async () => {
      const saveEntityArguments: Array<URL|null> = [];
      let collectionInsertedInto: URL|null = null;
      let insertedIntoCollection: URL|null = null;

      await (handleCreate as unknown as (activity: AP.Create, recipient: AP.Actor) => Promise<void>).call({
        adapters: {
          db: {
            async queryById(entityId: URL) {
              if (`${entityId}` === note2Id) {
                return note2;
              }
            },
            async findEntityById(entityId: URL) {
              if (`${entityId}` === note2Id) {
                return null;
              }
              
              if (`${entityId}` === note1Id) {
                return note1;
              }
              
              if (`${entityId}` === note1RepliesId) {
                return note1Replies;
              }
            },
            async saveEntity(entity: AP.Entity) {
              saveEntityArguments.push(getId(entity));
            },
            async insertOrderedItem(collectionId: URL, itemToInsert: URL) {
              collectionInsertedInto = collectionId;
              insertedIntoCollection = itemToInsert;
            },
          }
        }
      }, createActivityWithObject, actor1);

      expect(saveEntityArguments?.[0]?.toString()).toBe(note2Id);
      expect(`${collectionInsertedInto}`).toBe(note1RepliesId);
      expect(`${insertedIntoCollection}`).toBe(note2Id);
    });
  });
});