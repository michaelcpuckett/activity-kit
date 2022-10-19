import { DeliveryService } from '.';
import { AP } from 'activitypub-core-types';
import { cleanProps } from 'activitypub-core-utilities';
import { compressEntity } from 'activitypub-core-utilities';

/**
 *    [x] Removes the `bto` and `bcc` properties from Objects before delivery
 *        (`outbox:removes-bto-and-bcc`) *MUST*
 */
export async function broadcast(
  this: DeliveryService,
  activity: AP.Activity,
  actor: AP.Actor,
) {
  const publicActivity = cleanProps(activity);

  if (!('actor' in publicActivity)) {
    throw new Error('Not an activity?');
  }

  const recipients = await this.getRecipientInboxUrls(activity, actor);

  const results = await Promise.all(
    recipients.map(async (recipient) => {
      return await this.signAndSendToForeignActorInbox(
        recipient,
        actor,
        publicActivity,
      );
    }),
  );

  return results;
}
