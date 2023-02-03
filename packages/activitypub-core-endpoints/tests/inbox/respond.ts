import 'jasmine';
import { respond } from '../../src/inbox/respond';
import { actor1, actor1InboxId, arriveActivity, arriveActivityId } from '../../test_data';
import { AP } from 'activitypub-core-types';

describe('Inbox', () => {
  describe('Respond', () => {
    it('Responds to Arrive Activity', async () => {
      let collectionInsertedInto: URL|null = null;
      let insertedIntoCollection: URL|null = null;
      let savedEntityId: URL|null = null;

      const thisValue: {
        activity: AP.Activity|null;
        parseBody: Function;
        isBlocked: Function;
        getActors: Function;
        runSideEffects: Function;
        savePeer: Function;
        broadcastActivity: Function;
        res: {
          [key: string]: number|Function;
          statusCode: number;
        };
        adapters: unknown;
      } = {
        activity: null,
        async parseBody() {
          this.activity = {
            ...arriveActivity,
          };
        },
        async savePeer() {

        },
        async isBlocked() {
          return false;
        },
        async getActors() {
          return [{
            ...actor1,
          }];
        },
        async runSideEffects() {

        },
        async broadcastActivity() {

        },
        res: {
          statusCode: 0,
          end() {

          },
        },
        adapters: {
          db: {
            async findEntityById(entityId: URL) {

            },
            async insertOrderedItem(collectionId: URL, itemToInsert: URL) {
              collectionInsertedInto = collectionId;
              insertedIntoCollection = itemToInsert;
            },
            async saveEntity(entity: AP.Entity) {
              savedEntityId = entity.id ?? null;
            }
          },
        },
      };

      await (respond as unknown as () => Promise<void>).call(thisValue);

      expect(`${collectionInsertedInto}`).toBe(actor1InboxId);
      expect(`${insertedIntoCollection}`).toBe(arriveActivityId);
      expect(`${savedEntityId}`).toBe(arriveActivityId);
      expect(thisValue.res.statusCode).toBe(200);
    });
  });
});