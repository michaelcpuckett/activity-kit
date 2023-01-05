import { AP } from 'activitypub-core-types';
import { isType } from 'activitypub-core-utilities';
import { OutboxPostEndpoint } from '.';

export async function runSideEffects(this: OutboxPostEndpoint) {
  for (const plugin of this.plugins) {
    if (plugin.handleOutboxSideEffect) {
      await plugin.handleOutboxSideEffect.call(this);
    }
  }

  if (isType(this.activity, AP.ActivityTypes.CREATE)) {
    await this.handleCreate(this.activity);
  }

  if (isType(this.activity, AP.ActivityTypes.DELETE)) {
    await this.handleDelete(this.activity);
  }

  if (isType(this.activity, AP.ActivityTypes.ACCEPT)) {
    await this.handleAccept(this.activity);
  }

  if (isType(this.activity, AP.ActivityTypes.BLOCK)) {
    await this.handleBlock(this.activity);
  }

  if (isType(this.activity, AP.ActivityTypes.UPDATE)) {
    await this.handleUpdate(this.activity);
  }

  if (isType(this.activity, AP.ActivityTypes.LIKE)) {
    await this.handleLike(this.activity);
  }

  if (isType(this.activity, AP.ActivityTypes.ANNOUNCE)) {
    await this.handleAnnounce(this.activity);
  }

  if (isType(this.activity, AP.ActivityTypes.ADD)) {
    await this.handleAdd(this.activity);
  }

  if (isType(this.activity, AP.ActivityTypes.REMOVE)) {
    await this.handleRemove(this.activity);
  }

  if (isType(this.activity, AP.ActivityTypes.UNDO)) {
    await this.handleUndo(this.activity);
  }
}
