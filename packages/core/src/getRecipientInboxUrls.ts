import * as AP from '@activity-kit/types';
import { guard } from '@activity-kit/type-utilities';
import { deduplicateUrls, getId } from '@activity-kit/utilities';

import { CoreLibrary } from './adapters';

export async function getRecipientInboxUrls(
  this: CoreLibrary,
  activity: AP.Activity,
  actor: AP.Actor,
  inboxesOnly?: boolean,
) {
  const recipientUrls = await this.getRecipientUrls(activity);

  const recipientInboxUrls = await Promise.all(
    recipientUrls.map(async (recipientUrl) => {
      return await mapRecipientUrl.bind(this)(recipientUrl, actor, inboxesOnly);
    }),
  );

  return deduplicateUrls(recipientInboxUrls.flat().filter(guard.isUrl));
}

async function mapRecipientUrl(
  this: CoreLibrary,
  recipientUrl: URL,
  actor: AP.Actor,
  inboxesOnly?: boolean,
) {
  if (recipientUrl.href === getId(actor)?.href) {
    return [];
  }

  const foundEntity = await this.fetchEntityById(recipientUrl);

  if (!guard.isApActor(foundEntity)) {
    return [];
  }

  if (!inboxesOnly) {
    if (foundEntity.endpoints) {
      if (guard.isUrl(foundEntity.endpoints.sharedInbox)) {
        return [foundEntity.endpoints.sharedInbox];
      }
    }
  }

  const inboxId = getId(foundEntity.inbox);

  if (guard.isUrl(inboxId)) {
    return [inboxId];
  }

  return [];
}
