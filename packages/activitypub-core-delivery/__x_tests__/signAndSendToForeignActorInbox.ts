import { mockDatabaseService } from './mockDatabaseService';
import { AP } from 'activitypub-core-types';
import { generateKeyPair } from 'activitypub-core-utilities';
import { DeliveryService } from '../src';


describe('DeliveryService', () => {
  describe('signAndSendToForeignActorInbox', () => {
    const fetch = jest.fn(async () => {
      return true;
    });

    const getPrivateKey = jest.fn(async () => {
      const { privateKey } = await generateKeyPair();
      return privateKey;
    });

    const databaseService = mockDatabaseService({
      fetch,
    });

    class ExtendedDeliveryService extends DeliveryService {
      public override getPrivateKey = getPrivateKey;
    }

    const deliveryService = new ExtendedDeliveryService(databaseService);

    const foreignActorInbox = new URL(data.actor2InboxUrl);
    const actor = data.actor1Result;
    const activity: AP.Activity = {
      type: 'Read',
      actor: new URL(data.actor1Url),
      object: new URL(data.note2Url),
      to: [new URL(data.actor2Url)],
    };

    it('works', async () => {
      await deliveryService.signAndSendToForeignActorInbox(
        foreignActorInbox,
        actor,
        activity,
      );

      expect(fetch).toBeCalledTimes(1);
    });
  });
});
