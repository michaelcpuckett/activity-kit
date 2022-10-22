import { ACTIVITYSTREAMS_CONTEXT } from 'activitypub-core-utilities';
import { AP } from 'activitypub-core-types';
import * as data from '../../../__data__';
import { handleOutboxPost } from '../';

describe('Endpoints', () => {
  describe('Actor Outbox', () => {
    it('Accepts non-Activity Objects, and converts to Create Activities (`outbox:accepts-non-activity-objects`) *MUST*', async () => {
      const object: AP.Note = {
        '@context': ACTIVITYSTREAMS_CONTEXT,
        type: 'Note',
        summary: 'Hello world',
      };

      const {
        res,
        saveEntity,
        insertOrderedItem,
        broadcast,
      } = await handleOutboxPost(object, data.aliceOutboxUrl);

      expect(res.statusCode).toBe(201);
      expect(saveEntity).toBeCalledTimes(8);
      expect(insertOrderedItem).toBeCalledTimes(1);
      expect(broadcast).toBeCalledTimes(1);
    });
  });
});