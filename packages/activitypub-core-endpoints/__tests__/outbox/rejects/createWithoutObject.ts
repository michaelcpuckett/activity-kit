import { ACTIVITYSTREAMS_CONTEXT } from 'activitypub-core-utilities';
import { AP } from 'activitypub-core-types';
import * as data from '../../../__data__';
import { handleOutboxPost } from '..';

describe('Endpoints', () => {
  describe('Actor Outbox', () => {
    it('Create Activity without Object', async () => {
      const activity: AP.Activity = {
        '@context': ACTIVITYSTREAMS_CONTEXT,
        type: AP.ActivityTypes.CREATE,
        actor: new URL(data.aliceUrl),
      };

      const { res, saveEntity, insertOrderedItem, broadcast } =
        await handleOutboxPost(activity, data.aliceOutboxUrl);

      expect(res.statusCode).toBe(500);
      expect(saveEntity).toBeCalledTimes(0);
      expect(insertOrderedItem).toBeCalledTimes(0);
      expect(broadcast).toBeCalledTimes(0);
    });
  });
});
