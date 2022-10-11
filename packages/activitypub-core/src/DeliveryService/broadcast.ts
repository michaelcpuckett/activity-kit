import { DeliveryService } from '.';
import { AP } from 'activitypub-core-types/src';
import { addContext } from '../utilities/addContext';
import { cleanProps } from '../utilities/cleanProps';
import { compressEntity } from '../utilities/compressEntity';

/**
 *    [x] Removes the `bto` and `bcc` properties from Objects before delivery
 *        (`outbox:removes-bto-and-bcc`) *MUST*
 */
export async function broadcast(
  this: DeliveryService,
  activity: AP.Activity,
  actor: AP.Actor,
) {
  const publicActivity = addContext(cleanProps(compressEntity(activity)));

  if (!('actor' in publicActivity)) {
    throw new Error('Not an activity?');
  }

  const recipients = await this.getRecipientInboxUrls(activity, actor);

  return await Promise.all(
    recipients.map(async (recipient) => {
      return await this.signAndSendToForeignActorInbox(
        recipient,
        actor,
        publicActivity,
      );
    }),
  );
}
