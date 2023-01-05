import 'jasmine';
import { AP } from 'activitypub-core-types';
import { handleAccept } from '../../src/inbox/sideEffects/accept';
import { acceptActivity, actor1, actor1Following, actor1FollowingId, actor1Id, actor2, actor2Id, followActivity, followActivityId } from '../../test_data';

describe('Inbox', () => {
  describe('Accept Side Effect', () => {
    it('Handles Accept Activity', async () => {
      let collectionInsertedInto: URL|null = null;
      let insertedIntoCollection: URL|null = null;

      await (handleAccept as unknown as (activity: AP.Accept) => Promise<void>).call({
        adapters: {
          db: {
            async queryById(entityId: URL) {
              if (`${entityId}` === actor1Id) {
                return actor1;
              }
              
              if (`${entityId}` === actor2Id) {
                return actor2;
              }
              
              if (`${entityId}` === actor1FollowingId) {
                return actor1Following;
              }
            },
            async findEntityById(entityId: URL) {
              if (`${entityId}` === followActivityId) {
                return followActivity;
              }
            },
            async insertItem(collectionId: URL, itemToInsert: URL) {
              collectionInsertedInto = collectionId;
              insertedIntoCollection = itemToInsert;
            },
          }
        }
      }, acceptActivity);

      expect(`${collectionInsertedInto}`).toBe(actor1FollowingId);
      expect(`${insertedIntoCollection}`).toBe(actor2Id);
    });
  });
});