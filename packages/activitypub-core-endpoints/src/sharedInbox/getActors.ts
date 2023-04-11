import {
  AP,
  assertIsApActivity,
  assertIsApActor,
} from 'activitypub-core-types';
import { getCollectionNameByUrl, getId } from 'activitypub-core-utilities';
import { SharedInboxPostEndpoint } from '.';
import { InboxPostEndpoint } from '../inbox';

export async function getActors(
  this: InboxPostEndpoint & SharedInboxPostEndpoint,
) {
  assertIsApActivity(this.activity);

  const recipientIds: URL[] = [
    ...(this.activity.to
      ? await this.adapters.delivery.getRecipientsList(this.activity.to)
      : []),
    ...(this.activity.cc
      ? await this.adapters.delivery.getRecipientsList(this.activity.cc)
      : []),
    ...(this.activity.bto
      ? await this.adapters.delivery.getRecipientsList(this.activity.bto)
      : []),
    ...(this.activity.bcc
      ? await this.adapters.delivery.getRecipientsList(this.activity.bcc)
      : []),
    ...(this.activity.audience
      ? await this.adapters.delivery.getRecipientsList(this.activity.audience)
      : []),
  ];

  const recipients = await Promise.all(
    recipientIds.map(async (recipientId) => {
      assertIsApActivity(this.activity);

      if (recipientId.toString() === getId(this.activity.actor).toString()) {
        return null;
      }

      const isLocal = getCollectionNameByUrl(recipientId) === 'entity';

      if (!isLocal) {
        return null;
      }

      const recipient = await this.adapters.db.findEntityById(recipientId);

      if (!recipient) {
        return null;
      }

      try {
        assertIsApActor(recipient);
        return recipient;
      } catch (error) {
        return null;
      }
    }),
  );

  const actors: AP.Actor[] = [];

  for (const recipient of recipients) {
    if (recipient) {
      actors.push(recipient);
    }
  }

  return actors;
}
