import 'jasmine';
import { AP } from 'activitypub-core-types';
import { respond } from '../../src/home/respond';
import { actor1, actor1Following, actor1FollowingId, actor1Id, actor1Inbox, actor1InboxId, actor1Outbox, actor1OutboxId, actor2, actor2Id, followActivity, followActivityId } from '../../test_data';
import { HTML_CONTENT_TYPE } from 'activitypub-core-utilities';

describe('Home', () => {
  describe('Respond', () => {
    let writtenActor: AP.Actor|null = null;

    it('Responds', async () => {
      await (respond as unknown as (render: Function) => Promise<void>).call({
        req: {
          headers: {
            cookie: '__session=abc123',
            accept: [HTML_CONTENT_TYPE],
          },
        },
        res: {
          setHeader() {
            
          },
          write(string: string) {
            const { actor } = JSON.parse(string);
            writtenActor = actor;
          },
        },
        adapters: {
          auth: {
            getUserIdByToken(token: string) {
              if (token === 'abc123') {
                return 'actor1';
              }
            },
          },
          db: {
            getActorByUserId(userId: string) {
              if (userId === 'actor1') {
                return actor1;
              }
            },
            findEntityById(entityId: URL) {
              if (entityId?.toString() === actor1InboxId) {
                return actor1Inbox;
              }

              if (entityId?.toString() === actor1OutboxId) {
                return actor1Outbox;
              }
            },
          }
        }
      }, ({actor}: {actor: AP.Actor}) => {
        return JSON.stringify({actor});
      });

      expect(writtenActor?.id?.toString()).toBe(actor1Id);
    });
  });
});