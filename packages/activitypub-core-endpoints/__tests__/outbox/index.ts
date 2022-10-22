import { ACTIVITYSTREAMS_CONTEXT } from 'activitypub-core-utilities';
import { AP } from 'activitypub-core-types';
import { OutboxPostHandler } from '../../src/outbox';
import { IncomingMessage, ServerResponse } from 'http';
import { Socket } from 'net';

describe('Endpoints', () => {
  describe('Actor Outbox', () => {
    it('Accepts Activity Objects (outbox:accepts-activities)', async () => {
      const aliceUrl = `https://test.com/actor/123`;
      const aliceInboxUrl = `${aliceUrl}/inbox`;
      const aliceOutboxUrl = `${aliceUrl}/outbox`;

      const alice: AP.Person = {
        "@context": new URL(ACTIVITYSTREAMS_CONTEXT),
        id: new URL(aliceUrl),
        url: new URL(aliceUrl),
        type: 'Person',
        inbox: new URL(aliceInboxUrl),
        outbox: new URL(aliceOutboxUrl),
      };

      const arriveActivity: AP.Arrive = {
        "@context": new URL(ACTIVITYSTREAMS_CONTEXT),
        type: AP.ActivityTypes.ARRIVE,
        actor: new URL(aliceUrl),
        location: {
          type: AP.ExtendedObjectTypes.PLACE,
          name: 'NYC',
        },
      };

      const saveActivity = jest.fn(async () => {
        return true;
      });

      const broadcast = jest.fn(async () => {
        return true;
      });

      class MockOutboxPostHandler extends OutboxPostHandler {
        override saveActivity = saveActivity;
      }

      const req = new IncomingMessage(new Socket());
      req[Symbol.asyncIterator] = async function*() {
        yield JSON.stringify(arriveActivity);
      };
      req.method = 'POST';
      req.url = new URL(aliceOutboxUrl).pathname;

      const res = new ServerResponse(new IncomingMessage(new Socket()));
      const auth = {
        getUserIdByToken() {
          return '123';
        },
      };
      const db = {
        findOne(collection, { _id, outbox }) {
          if (outbox === aliceOutboxUrl) {
            return alice;
          }

          return null;
        },
        getActorByUserId() {
          return alice;
        },
      };
      const delivery = {
        broadcast,
      };

      const handler = new MockOutboxPostHandler(req, res, auth, db, delivery);
      await handler.init();

      expect(res.statusCode).toBe(201);
      expect(saveActivity).toBeCalledTimes(1);
      expect(broadcast).toBeCalledTimes(1);
    });
  });
});