import { AP } from 'activitypub-core-types';
import { getId, isTypeOf } from 'activitypub-core-utilities';
import { SharedInboxPostEndpoint } from '.';
import { InboxPostEndpoint } from '../inbox';

export async function getActors(
  this: InboxPostEndpoint & SharedInboxPostEndpoint,
) {
  if (!isTypeOf(this.activity, AP.ActivityTypes)) {
    throw new Error('Not an activity.');
  }

  const activity = this.activity as AP.Activity;

  const recipientIds: URL[] = [
    ...(activity.to
      ? await this.adapters.delivery.getRecipientsList(activity.to)
      : []),
    ...(activity.cc
      ? await this.adapters.delivery.getRecipientsList(activity.cc)
      : []),
    ...(activity.bto
      ? await this.adapters.delivery.getRecipientsList(activity.bto)
      : []),
    ...(activity.bcc
      ? await this.adapters.delivery.getRecipientsList(activity.bcc)
      : []),
    ...(activity.audience
      ? await this.adapters.delivery.getRecipientsList(activity.audience)
      : []),
  ];

  const recipients = await Promise.all(
    recipientIds.map(async (recipientId) => {
      if (recipientId.toString() === getId(activity.actor).toString()) {
        return null;
      }

      const recipient = await this.adapters.db.findEntityById(recipientId);

      if (!recipient) {
        return null;
      }

      if (isTypeOf(recipient, AP.ActorTypes)) {
        return (recipient as AP.Actor);
      }

      return null;
    }),
  );

  const actors: AP.Actor[] = [];

  for (const recipient of recipients) {
    if (recipient) {
      actors.push(recipient);
    }
  }

  this.actors = actors;
}
