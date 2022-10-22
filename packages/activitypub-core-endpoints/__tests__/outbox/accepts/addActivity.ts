import { ACTIVITYSTREAMS_CONTEXT } from 'activitypub-core-utilities';
import { AP } from 'activitypub-core-types';
import * as data from '../../../__data__';
import { handleOutboxPost } from '../';

describe('Endpoints', () => {
  describe('Actor Outbox', () => {
    it('Accepts POST: add', async () => {
      const activity: AP.Activity = {
        '@context': ACTIVITYSTREAMS_CONTEXT,
        type: 'Add',
        actor: new URL(data.aliceUrl),
        target: new URL(data.collection1Url),
        object: new URL(data.note1Url),
      };

      const {
        res,
        saveEntity,
        insertOrderedItem,
        insertItem,
        broadcast,
      } = await handleOutboxPost(activity, data.aliceOutboxUrl);

      expect(res.statusCode).toBe(201);
      expect(saveEntity).toBeCalledTimes(4);
      expect(insertOrderedItem).toBeCalledTimes(1);
      expect(insertItem).toBeCalledTimes(1);
      expect(broadcast).toBeCalledTimes(1);
    });
  });
});