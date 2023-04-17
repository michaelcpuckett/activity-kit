import { AP, isType } from '@activity-kit/types';
import { OutboxPostEndpoint } from '.';

export async function runSideEffects(this: OutboxPostEndpoint) {
  try {
    if (isType<AP.Create>(this.activity, AP.ActivityTypes.CREATE)) {
      await this.handleCreate(this.activity);
    }

    if (isType<AP.Delete>(this.activity, AP.ActivityTypes.DELETE)) {
      await this.handleDelete(this.activity);
    }

    if (isType<AP.Accept>(this.activity, AP.ActivityTypes.ACCEPT)) {
      await this.handleAccept(this.activity);
    }

    if (isType<AP.Block>(this.activity, AP.ActivityTypes.BLOCK)) {
      await this.handleBlock(this.activity);
    }

    if (isType<AP.Update>(this.activity, AP.ActivityTypes.UPDATE)) {
      await this.handleUpdate(this.activity);
    }

    if (isType<AP.Like>(this.activity, AP.ActivityTypes.LIKE)) {
      await this.handleLike(this.activity);
    }

    if (isType<AP.Announce>(this.activity, AP.ActivityTypes.ANNOUNCE)) {
      await this.handleAnnounce(this.activity);
    }

    if (isType<AP.Add>(this.activity, AP.ActivityTypes.ADD)) {
      await this.handleAdd(this.activity);
    }

    if (isType<AP.Remove>(this.activity, AP.ActivityTypes.REMOVE)) {
      await this.handleRemove(this.activity);
    }

    if (isType<AP.Undo>(this.activity, AP.ActivityTypes.UNDO)) {
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
