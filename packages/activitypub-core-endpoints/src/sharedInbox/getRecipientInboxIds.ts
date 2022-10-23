import { AP } from 'activitypub-core-types';
import { getId, isTypeOf } from 'activitypub-core-utilities';
import { SharedInboxEndpoint } from '.';

export async function getRecipientInboxIds(this: SharedInboxEndpoint) {
  if (!this.activity) {
    throw new Error('No activity.')
  }

  const recipientIds: URL[] = [
    ...(this.activity.to
      ? await this.deliveryService.getRecipientsList(this.activity.to)
      : []),
    ...(this.activity.cc
      ? await this.deliveryService.getRecipientsList(this.activity.cc)
      : []),
    ...(this.activity.bto
      ? await this.deliveryService.getRecipientsList(this.activity.bto)
      : []),
    ...(this.activity.bcc
      ? await this.deliveryService.getRecipientsList(this.activity.bcc)
      : []),
    ...(this.activity.audience
      ? await this.deliveryService.getRecipientsList(this.activity.audience)
      : []),
  ];

  const recipientInboxes = await Promise.all(
    recipientIds.map(async (recipientId) => {
      if (recipientId.toString() === getId(this.activity.actor).toString()) {
        return null;
      }

      const recipient = await this.databaseService.findEntityById(recipientId);

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