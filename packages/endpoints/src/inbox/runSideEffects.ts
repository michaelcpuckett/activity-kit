import { InboxPostEndpoint } from '.';
import { AP, isType } from '@activity-kit/types';

export async function runSideEffects(
  this: InboxPostEndpoint,
  recipient: AP.Actor,
) {
  for (const plugin of this.plugins) {
    if (plugin.handleInboxSideEffect) {
      try {
        await plugin.handleInboxSideEffect.call(this, this.activity, recipient);
      } catch (error) {
        console.log(error);
      }
    }
  }

  try {
    if (isType<AP.Create>(this.activity, AP.ActivityTypes.CREATE)) {
      await this.handleCreate(this.activity, recipient);
    }

    if (isType<AP.Follow>(this.activity, AP.ActivityTypes.FOLLOW)) {
      await this.handleFollow(this.activity, recipient);
    }

    if (isType<AP.Accept>(this.activity, AP.ActivityTypes.ACCEPT)) {
      await this.handleAccept(this.activity, recipient);
    }

    if (isType<AP.Like>(this.activity, AP.ActivityTypes.LIKE)) {
      await this.handleLike(this.activity, recipient);
    }

    if (isType<AP.Announce>(this.activity, AP.ActivityTypes.ANNOUNCE)) {
      await this.handleAnnounce(this.activity, recipient);
    }
  } catch (error) {
    console.log(error);
  }
}
