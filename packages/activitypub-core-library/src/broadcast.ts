import { CoreLibrary } from '.';
import { AP } from 'activitypub-core-types';
import { cleanProps } from 'activitypub-core-utilities';
import { applyContext } from 'activitypub-core-utilities';

/**
 *    [x] Removes the `bto` and `bcc` properties from Objects before delivery
 *        (`outbox:removes-bto-and-bcc`) *MUST*
 */

export async function broadcast(
  this: CoreLibrary,
  activity: AP.Activity,
  actor: AP.Actor,
): Promise<unknown> {
  const publicActivity = cleanProps(applyContext(activity));

  if (!('actor' in publicActivity)) {
    throw new Error('Not an activity?');
  }

  const recipients = await this.getRecipientInboxUrls(activity, actor);

  console.log({
    recipients,
  });

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
