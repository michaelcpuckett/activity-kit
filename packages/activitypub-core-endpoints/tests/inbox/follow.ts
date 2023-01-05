import 'jasmine';
import { AP } from 'activitypub-core-types';
import { handleFollow } from '../../src/inbox/sideEffects/follow';
import { followActivityWithManualApproval, followActivityWithManualApprovalId, actor2Requests, actor1FollowersId, actor1Followers, actor2, actor2Id, actor1, actor1Id, followActivity, actor2Followers, actor2FollowersId, actor2RequestsId, actor1Requests, actor1RequestsId } from '../../test_data';
import { getId, isType } from 'activitypub-core-utilities';

describe('Inbox', () => {
  describe('Follow Side Effect', () => {
    it('Handles Follow Activity when actor manually approves followers', async () => {
      let collectionInsertedInto: URL|null = null;
      let insertedIntoCollection: URL|null = null;

      await (handleFollow as unknown as (activity: AP.Follow, recipient: AP.Actor) => Promise<void>).call({
        adapters: {
          db: {
            async getStreamByName(actor: AP.Actor, name: string) {
              if (actor.id?.toString() === actor1Id && name === 'Requests') {
                return actor1Requests;
              }
            },
            async findEntityById(entityId: URL) {
              if (entityId?.toString() === actor1FollowersId) {
                return actor1Followers;
              }
            },
            async queryById(entityId: URL) {
              if (entityId?.toString() === actor1Id) {
                return actor1;
              }

              if (entityId?.toString() === actor2Id) {
                return actor2;
              }
            },
            async insertItem(collectionId: URL, itemToInsert: URL) {
              collectionInsertedInto = collectionId;
              insertedIntoCollection = itemToInsert;
            },
          }
        }
      }, followActivityWithManualApproval, actor1);

      expect(`${collectionInsertedInto}`).toBe(actor1RequestsId);
      expect(`${insertedIntoCollection}`).toBe(followActivityWithManualApprovalId);
    });

    it('Handles Follow Activity when actor does NOT manually approve followers', async () => {
      const saveEntityCalls: Array<Array<URL|null>> = [];
      const insertItemsCalls: Array<Array<URL|null>> = [];
      const broadcastCalls: Array<[AP.Activity, AP.Actor]> = [];

      await (handleFollow as unknown as (activity: AP.Follow, recipient: AP.Actor) => Promise<void>).call({
        adapters: {
          delivery: {
            async broadcast(activity: AP.Activity, actor: AP.Actor) {
              if (isType(activity, AP.ActivityTypes.ACCEPT)) {
                broadcastCalls.push([activity, actor]);
              }
            }
          },
          db: {
            async findEntityById(entityId: URL) {
              if (entityId?.toString() === actor2FollowersId) {
                return actor2Followers;
              }
            },
            async queryById(entityId: URL) {
              if (entityId?.toString() === actor2Id) {
                return actor2;
              }
              
              if (entityId?.toString() === actor1Id) {
                return actor1;
              }
            },
            async saveEntity(entity: AP.Entity) {
              const entityId = getId(entity);
              saveEntityCalls.push([entityId]);
            },
            async insertOrderedItem(collectionId: URL, itemToInsert: URL) {
              insertItemsCalls.push([collectionId, itemToInsert]);
            },
            async insertItem(collectionId: URL, itemToInsert: URL) {
              insertItemsCalls.push([collectionId, itemToInsert]);
            },
          }
        }
      }, followActivity, actor2);

      for (const saveEntityCall of saveEntityCalls) {
        if (saveEntityCall) {
          for (const saveEntityArgument of saveEntityCall) {
            expect(saveEntityArgument).toBeTruthy();
          }
        } else {
          fail();
        }
      }

      expect(saveEntityCalls.length).toBe(4);
      expect(insertItemsCalls.length).toBe(2);
      expect(broadcastCalls.length).toBe(1);
    });
  });
});