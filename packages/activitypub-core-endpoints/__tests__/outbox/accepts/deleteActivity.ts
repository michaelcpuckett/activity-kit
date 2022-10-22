import { ACTIVITYSTREAMS_CONTEXT } from 'activitypub-core-utilities';
import { AP } from 'activitypub-core-types';
import * as data from '../../../__data__';
import { handleOutboxPost } from '../';

describe('Endpoints', () => {
  describe('Actor Outbox', () => {
    it('Accepts POST: delete', async () => {
      const activity: AP.Activity = {
        '@context': ACTIVITYSTREAMS_CONTEXT,
        type: 'Delete',
        actor: new URL(data.aliceUrl),
        object: new URL(data.note1Url),
      };

      const { res, saveEntity, insertOrderedItem, broadcast } =
        await handleOutboxPost(activity, data.aliceOutboxUrl);

      expect(res.statusCode).toBe(201);
      expect(saveEntity).toBeCalledTimes(5);
      expect(insertOrderedItem).toBeCalledTimes(1);
      expect(broadcast).toBeCalledTimes(1);
    });
  });
});
