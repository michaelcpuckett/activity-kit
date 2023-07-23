import * as AP from '@activity-kit/types';
import { guard } from '@activity-kit/type-utilities';
import { OutboxPostEndpoint } from '.';

export async function runSideEffects(this: OutboxPostEndpoint) {
  try {
    if (guard.isType<AP.Create>(this.activity, AP.ActivityTypes.CREATE)) {
      await this.handleCreate(this.activity);
    }

    if (guard.isType<AP.Delete>(this.activity, AP.ActivityTypes.DELETE)) {
      await this.handleDelete(this.activity);
    }

    if (guard.isType<AP.Accept>(this.activity, AP.ActivityTypes.ACCEPT)) {
      await this.handleAccept(this.activity);
    }

    if (guard.isType<AP.Block>(this.activity, AP.ActivityTypes.BLOCK)) {
      await this.handleBlock(this.activity);
    }

    if (guard.isType<AP.Update>(this.activity, AP.ActivityTypes.UPDATE)) {
      await this.handleUpdate(this.activity);
    }

    if (guard.isType<AP.Like>(this.activity, AP.ActivityTypes.LIKE)) {
      await this.handleLike(this.activity);
    }

    if (guard.isType<AP.Announce>(this.activity, AP.ActivityTypes.ANNOUNCE)) {
      await this.handleAnnounce(this.activity);
    }

    if (guard.isType<AP.Add>(this.activity, AP.ActivityTypes.ADD)) {
      await this.handleAdd(this.activity);
    }

    if (guard.isType<AP.Remove>(this.activity, AP.ActivityTypes.REMOVE)) {
      await this.handleRemove(this.activity);
    }

    if (guard.isType<AP.Follow>(this.activity, AP.ActivityTypes.FOLLOW)) {
      await this.handleFollow(this.activity);
    }

    if (guard.isType<AP.Undo>(this.activity, AP.ActivityTypes.UNDO)) {
      await this.handleUndo(this.activity);
    }
  } catch (error) {
    console.log(error);
  }

  for (const plugin of this.plugins) {
    if (plugin.handleOutboxSideEffect) {
      try {
        await plugin.handleOutboxSideEffect.call(this);
      } catch (error) {
        console.log(error);
      }
    }
  }
}
