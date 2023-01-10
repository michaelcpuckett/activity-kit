import 'jasmine';
import { isBlocked } from '../../src/inbox/isBlocked';
import { acceptActivity, actor1, actor1Blocks, actor1BlocksId, actor1Id, actor1InboxId, arriveActivity, arriveActivityFromBlockedActor, blockActivity, blockActivityId, blockedActor, blockedActorId } from '../../test_data';
import { AP } from 'activitypub-core-types';

describe('Inbox', () => {
  describe('isBlocked', () => {
    it('Identifies blocked actor', async () => {
      const thisValue: {
        activity: AP.Activity|null;
        adapters: unknown;
      } = {
        activity: {
          ...arriveActivityFromBlockedActor,
        },
        adapters: {
          db: {
            async getStreamByName(actor: AP.Actor, name: string) {
              if (name === 'Blocks') {
                return {
                  ...actor1Blocks,
                };
              }
            },
            async queryById(entityId: URL) {
              if (entityId?.toString() === blockedActorId) {
                return {
                  ...blockedActor,
                };
              }
            },
            async findEntityById(entityId: URL) {
              if (entityId?.toString() === blockActivityId) {
                return {
                  ...blockActivity,
                };
              }

              if (entityId?.toString() === actor1BlocksId) {
                return {
                  ...actor1Blocks,
                };
              }
            },
          },
        },
      };

      const result = await (isBlocked as unknown as (actor: AP.Actor) => Promise<boolean>).call(thisValue, {
        ...actor1,
      });

      expect(result).toBe(true);
    });

    it('Does not identify non-blocked actor', async () => {
      const thisValue: {
        activity: AP.Activity|null;
        adapters: unknown;
      } = {
        activity: {
          ...arriveActivity,
        },
        adapters: {
          db: {
            async getStreamByName(actor: AP.Actor, name: string) {
              if (name === 'Blocks') {
                return {
                  ...actor1Blocks,
                };
              }
            },
            async queryById(entityId: URL) {
              console.log(entityId?.toString());
              if (entityId?.toString() === actor1Id) {
                return {
                  ...actor1,
                };
              }
            },
            async findEntityById(entityId: URL) {
              if (entityId?.toString() === blockActivityId) {
                return {
                  ...blockActivity,
                };
              }

              if (entityId?.toString() === actor1BlocksId) {
                return {
                  ...actor1Blocks,
                };
              }
            },
          },
        },
      };

      const result = await (isBlocked as unknown as (actor: AP.Actor) => Promise<boolean>).call(thisValue, {
        ...actor1,
      });

      expect(result).toBe(false);
    });
  });
});