import { ACTIVITYSTREAMS_CONTEXT } from 'activitypub-core-utilities';
import { AP } from 'activitypub-core-types';
import * as data from '../../../__data__';
import { handleOutboxPost } from '..';

describe('Endpoints', () => {
  describe('Actor Outbox', () => {
    it('Undo Announce', async () => {
      const activity: AP.Undo = {
        '@context': ACTIVITYSTREAMS_CONTEXT,
        type: 'Undo',
        actor: new URL(data.aliceUrl),
        object: new URL(data.announceActivityUrl),
      };

      const {
        res,
        saveEntity,
        insertOrderedItem,
        removeOrderedItem,
        broadcast,
      } = await handleOutboxPost(activity, data.aliceOutboxUrl);

      expect(res.statusCode).toBe(201);
      expect(saveEntity).toBeCalledTimes(4);
      expect(insertOrderedItem).toBeCalledTimes(1);
      expect(removeOrderedItem).toBeCalledTimes(2);
      expect(broadcast).toBeCalledTimes(1);
    });
  });
});
