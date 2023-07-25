import { InboxPostEndpoint } from '.';
import * as AP from '@activity-kit/types';
import { guard } from '@activity-kit/type-utilities';

export async function runSideEffects(
  this: InboxPostEndpoint,
  recipient: AP.Actor,
) {
  if (guard.isApType<AP.Create>(this.activity, AP.ActivityTypes.CREATE)) {
    await this.handleCreate(this.activity, recipient);
  }

  if (guard.isApType<AP.Follow>(this.activity, AP.ActivityTypes.FOLLOW)) {
    await this.handleFollow(this.activity, recipient);
  }

  if (guard.isApType<AP.Accept>(this.activity, AP.ActivityTypes.ACCEPT)) {
    await this.handleAccept(this.activity, recipient);
  }

  if (guard.isApType<AP.Like>(this.activity, AP.ActivityTypes.LIKE)) {
    await this.handleLike(this.activity, recipient);
  }

  if (guard.isApType<AP.Announce>(this.activity, AP.ActivityTypes.ANNOUNCE)) {
    await this.handleAnnounce(this.activity, recipient);
  }
}
