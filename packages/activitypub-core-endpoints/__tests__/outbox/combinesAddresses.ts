import {
  ACTIVITYSTREAMS_CONTEXT,
  getCollectionNameByUrl,
} from 'activitypub-core-utilities';
import { AP } from 'activitypub-core-types';
import * as data from '../../__data__';
import { handleOutboxPost } from '.';

describe('Endpoints', () => {
  describe('Actor Outbox', () => {
    it('Combines addresses', async () => {
      const activity: AP.Create = {
        '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
        type: AP.ActivityTypes.CREATE,
        actor: new URL(data.aliceUrl),
        to: new URL(data.bobUrl),
        object: {
          cc: new URL(data.eveUrl),
          type: AP.ExtendedObjectTypes.PLACE,
          name: 'Disney World',
        },
      };

      const combinedAddressesActivity: AP.Create = {
        '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
        type: AP.ActivityTypes.CREATE,
        actor: new URL(data.aliceUrl),
        to: [new URL(data.bobUrl)],
        cc: [new URL(data.eveUrl)],
        object: {
          to: [new URL(data.bobUrl)],
          cc: [new URL(data.eveUrl)],
          type: AP.ExtendedObjectTypes.PLACE,
          name: 'Disney World',
        },
      }

      const { res, saveEntity, broadcast } =
        await handleOutboxPost(activity, data.aliceOutboxUrl);

      const [ objectCall, _, __, ___, activityCall ] = saveEntity.mock.calls;
      const [ objectResult ] = objectCall;
      const [ activityResult ] = activityCall;

      expect(res.statusCode).toBe(201);
      expect(objectResult.to).toStrictEqual(combinedAddressesActivity.to);
      expect(objectResult.cc).toStrictEqual(combinedAddressesActivity.cc);
      expect(activityResult.to).toStrictEqual(combinedAddressesActivity.to);
      expect(activityResult.cc).toStrictEqual(combinedAddressesActivity.cc);
      expect(broadcast).toBeCalledTimes(1);
    });
  });
});
