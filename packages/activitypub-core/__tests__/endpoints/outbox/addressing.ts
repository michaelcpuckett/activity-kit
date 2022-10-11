import { AP } from 'activitypub-core-types';
import * as data from '../../data';
import { outboxHandler } from '../box';
import { ACTIVITYSTREAMS_CONTEXT } from '../../../src/globals';

describe('Endpoints', () => {
  describe('Actor Outbox', () => {
    it('Combines addresses', async () => {
      const activity: AP.Create = {
        '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
        type: AP.ActivityTypes.CREATE,
        actor: new URL(data.actor1Url),
        to: new URL(data.actor2Url),
        object: {
          cc: new URL(data.actor3Url),
          type: AP.ExtendedObjectTypes.PLACE,
          name: 'Disney World',
        },
      };

      const { updateOne, replaceOne, end, signAndSendToForeignActorInbox } =
        await outboxHandler(activity);

      // TODO: Check if bto, bcc were removed before saving.
      expect(updateOne).toBeCalledTimes(1); // insert activity into outbox
      expect(replaceOne).toBeCalledTimes(4); // activity
      expect(replaceOne.mock.calls[0][1]).toBeTruthy();
      expect(replaceOne.mock.calls[0][1].to).toBeTruthy();
      expect(replaceOne.mock.calls[0][1].cc).toBeTruthy();
      expect(signAndSendToForeignActorInbox).toBeCalledTimes(2);

      expect(end).toBeCalledTimes(1);
    });

    it('Removes the `bto` and `bcc` properties from Objects before storage (`outbox:removes-bto-and-bcc`) *MUST*', async () => {
      const activity: AP.Activity = {
        '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
        type: AP.ActivityTypes.CREATE, // TODO CREATE
        actor: new URL(data.actor1Url),
        bto: [new URL(data.actor2Url)],
        object: {
          type: AP.ExtendedObjectTypes.PLACE,
          name: 'Disney World',
          bcc: [new URL(data.actor3Url)],
        },
      };

      const { updateOne, replaceOne, end, signAndSendToForeignActorInbox } =
        await outboxHandler(activity);

      expect(updateOne).toBeCalledTimes(1); // insert activity into outbox
      expect(replaceOne).toBeCalledTimes(4); // activity, create, likes, shares
      expect(replaceOne.mock.calls[0][1]).toBeTruthy();
      expect(replaceOne.mock.calls[0][1].bto).toBeUndefined();
      expect(replaceOne.mock.calls[0][1].bcc).toBeUndefined();
      expect(signAndSendToForeignActorInbox).toBeCalledTimes(2);

      expect(end).toBeCalledTimes(1);
    });
  });
});
