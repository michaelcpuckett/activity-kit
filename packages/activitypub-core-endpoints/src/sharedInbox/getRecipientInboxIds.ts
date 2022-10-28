import { AP } from 'activitypub-core-types';
import { getId, isTypeOf } from 'activitypub-core-utilities';
import { SharedInboxPostEndpoint } from '.';
import { InboxPostEndpoint } from '../inbox';

export async function getRecipientInboxIds(this: InboxPostEndpoint & SharedInboxPostEndpoint) {
  if (!isTypeOf(this.activity, AP.ActivityTypes)) {
    throw new Error('Not an activity.')
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

  const recipientInboxes = await Promise.all(
    recipientIds.map(async (recipientId) => {
      if (recipientId.toString() === getId(activity.actor).toString()) {
        return null;
      }

      const recipient = await this.adapters.database.findEntityById(recipientId);

      if (!recipient) {
        return null;
      }

      if (isTypeOf(recipient, AP.ActorTypes)) {
        return (recipient as AP.Actor).inbox;
      }

      return null;
    }),
  );

  const recipientInboxIds: URL[] = [];

  for (const recipientInbox of recipientInboxes) {
    if (recipientInbox instanceof URL) {
      recipientInboxIds.push(recipientInbox);
    }
  }

  return [...new Set(recipientInboxIds)];
}