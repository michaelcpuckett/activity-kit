import { InboxPostEndpoint } from '.';
import { isType } from 'activitypub-core-utilities';
import { AP } from 'activitypub-core-types';

export async function runSideEffects(this: InboxPostEndpoint) {
  if (isType(this.activity, AP.ActivityTypes.CREATE)) {
    await this.handleCreate();
  }

  if (isType(this.activity, AP.ActivityTypes.FOLLOW)) {
    await this.handleFollow();
  }

  if (isType(this.activity, AP.ActivityTypes.ACCEPT)) {
    await this.handleAccept();
  }

  if (isType(this.activity, AP.ActivityTypes.LIKE)) {
    await this.handleLike();
  }

  if (isType(this.activity, AP.ActivityTypes.ANNOUNCE)) {
    await this.handleAnnounce();
  }
}
