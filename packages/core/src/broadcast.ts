import * as AP from '@activity-kit/types';
import { assert } from '@activity-kit/type-utilities';
import { applyContext, cleanProps } from '@activity-kit/utilities';

import { CoreLibrary } from './adapters';

/**
 *    [x] Removes the `bto` and `bcc` properties from Objects before delivery
 *        (`outbox:removes-bto-and-bcc`) *MUST*
 */

export async function broadcast(
  this: CoreLibrary,
  activity: AP.Activity,
  actor: AP.Actor,
): Promise<unknown> {
  const entity = applyContext<AP.Entity>(activity);

  assert.isApActivity(entity);

  const publicActivity = cleanProps(entity);

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
