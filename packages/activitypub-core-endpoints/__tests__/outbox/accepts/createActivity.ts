import { ACTIVITYSTREAMS_CONTEXT } from 'activitypub-core-utilities';
import { AP } from 'activitypub-core-types';
import * as data from '../../../__data__';
import { handleOutboxPost } from '../';

describe('Endpoints', () => {
  describe('Actor Outbox', () => {
    it('Create Activity', async () => {
      const activity: AP.Activity = {
        '@context': ACTIVITYSTREAMS_CONTEXT,
        type: AP.ActivityTypes.CREATE,
        actor: new URL(data.aliceUrl),
        object: {
          type: 'Note',
          content: 'Hello world',
        },
      };

      const { res, saveEntity, insertOrderedItem, broadcast } =
        await handleOutboxPost(activity, data.aliceOutboxUrl);

      expect(res.statusCode).toBe(201);
      expect(saveEntity).toBeCalledTimes(8);
      expect(insertOrderedItem).toBeCalledTimes(1);
      expect(broadcast).toBeCalledTimes(1);
    });
  });
});
