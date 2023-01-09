import 'jasmine';
import { respond } from '../../src/outbox/respond';
import { actor1, actor1InboxId, arriveActivity, arriveActivityId } from '../../test_data';
import { AP } from 'activitypub-core-types';

describe('Outbox', () => {
  describe('Respond', () => {
    let locationHeader = '';

    it('Responds to Arrive Activity', async () => {
      const thisValue: {
        activity: AP.Activity|null;
        actor: AP.Actor|null;
        parseBody: Function;
        getActor: Function;
        saveActivity: Function;
        authenticateActor: Function;
        runSideEffects: Function;
        res: {
          [key: string]: number|Function;
          statusCode: number;
        };
        adapters: unknown;
      } = {
        activity: null,
        actor: null,
        async parseBody() {
          this.activity = {
            ...arriveActivity,
          };
        },
        async getActor() {
          this.actor = {
            ...actor1
          };
        },
        async authenticateActor() {

        },
        async runSideEffects() {

        },
        async saveActivity() {

        },
        res: {
          statusCode: 0,
          setHeader(name: string, value: string) {
            if (name === 'Location') {
              locationHeader = value;
            }
          },
          end() {

          },
        },
        adapters: {
          delivery: {
            async broadcast() {

            },
          }
        },
      };

      await (respond as unknown as () => Promise<void>).call(thisValue);

      expect(thisValue.res.statusCode).toBe(201);
      expect(locationHeader).toBeTruthy();
    });
  });
});