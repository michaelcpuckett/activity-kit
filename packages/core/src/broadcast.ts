import { Core } from '.';
import * as AP from '@activity-kit/types';
import { applyContext, cleanProps } from '@activity-kit/utilities';

/**
 *    [x] Removes the `bto` and `bcc` properties from Objects before delivery
 *        (`outbox:removes-bto-and-bcc`) *MUST*
 */

export async function broadcast(
  this: Core,
  activity: AP.Activity,
  actor: AP.Actor,
): Promise<unknown> {
  const publicActivity = cleanProps(applyContext<AP.Activity>(activity));

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
