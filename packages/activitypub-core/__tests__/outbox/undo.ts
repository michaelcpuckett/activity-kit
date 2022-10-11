import { AP } from 'activitypub-core-types';
import * as data from '../../data';
import { ACTIVITYSTREAMS_CONTEXT } from '../../../src/globals';
import { outboxHandler } from '../box';

describe('Endpoints', () => {
  describe('Actor Outbox', () => {
    it('Accepts POST: undo add', async () => {
      const activity: AP.Undo = {
        '@context': ACTIVITYSTREAMS_CONTEXT,
        type: 'Undo',
        actor: new URL(data.actor1Url),
        object: new URL(data.originalAddActivityId),
      };

      const { updateOne, replaceOne, end } = await outboxHandler(activity);

      expect(updateOne).toBeCalledTimes(2); // insert activity into outbox, remove object
      expect(replaceOne).toBeCalledTimes(1); // activity

      expect(end).toBeCalledTimes(1);
    });

    it('Accepts POST: undo remove', async () => {
      const activity: AP.Undo = {
        '@context': ACTIVITYSTREAMS_CONTEXT,
        type: 'Undo',
        actor: new URL(data.actor1Url),
        object: new URL(data.originalRemoveActivityId),
      };

      const { updateOne, replaceOne, end } = await outboxHandler(activity);

      expect(updateOne).toBeCalledTimes(2); // insert activity into outbox, add object
      expect(replaceOne).toBeCalledTimes(1); // activity

      expect(end).toBeCalledTimes(1);
    });

    it('Accepts POST: undo like', async () => {
      const activity: AP.Undo = {
        '@context': ACTIVITYSTREAMS_CONTEXT,
        type: 'Undo',
        actor: new URL(data.actor1Url),
        object: new URL(data.originalLikeActivityId),
      };

      const { updateOne, replaceOne, end } = await outboxHandler(activity);

      expect(updateOne).toBeCalledTimes(3); // insert activity into outbox, remove from likes, remove from liked
      expect(replaceOne).toBeCalledTimes(1); // activity

      expect(end).toBeCalledTimes(1);
    });

    it('Accepts POST: undo announce', async () => {
      const activity: AP.Undo = {
        '@context': ACTIVITYSTREAMS_CONTEXT,
        type: 'Undo',
        actor: new URL(data.actor1Url),
        object: new URL(data.originalAnnounceActivityId),
      };

      const { updateOne, replaceOne, end } = await outboxHandler(activity);

      expect(updateOne).toBeCalledTimes(3); // insert activity into outbox, remove from shares, remove from shared
      expect(replaceOne).toBeCalledTimes(1); // activity

      expect(end).toBeCalledTimes(1);
    });

    it('Accepts POST: undo create', async () => {
      const activity: AP.Undo = {
        '@context': ACTIVITYSTREAMS_CONTEXT,
        type: 'Undo',
        actor: new URL(data.actor1Url),
        object: new URL(data.originalCreateActivityId),
      };

      const { updateOne, replaceOne, end } = await outboxHandler(activity);

      expect(updateOne).toBeCalledTimes(1); // insert activity into outbox
      expect(replaceOne).toBeCalledTimes(2); // activity, tombstone

      expect(end).toBeCalledTimes(1);
    });
  });
});
