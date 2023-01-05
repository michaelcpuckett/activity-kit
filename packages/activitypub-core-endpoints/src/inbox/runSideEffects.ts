import { InboxPostEndpoint } from '.';
import { isType } from 'activitypub-core-utilities';
import { AP } from 'activitypub-core-types';

export async function runSideEffects(this: InboxPostEndpoint) {
  try {
    if (isType(this.activity, AP.ActivityTypes.CREATE)) {
      await this.handleCreate(this.activity);
    }

    if (isType(this.activity, AP.ActivityTypes.FOLLOW)) {
      await this.handleFollow(this.activity);
    }

    if (isType(this.activity, AP.ActivityTypes.ACCEPT)) {
      await this.handleAccept(this.activity);
    }

    if (isType(this.activity, AP.ActivityTypes.LIKE)) {
      await this.handleLike(this.activity);
    }

    if (isType(this.activity, AP.ActivityTypes.ANNOUNCE)) {
      await this.handleAnnounce(this.activity);
    }
  } catch (error) {
    console.log(error);
  }
}
