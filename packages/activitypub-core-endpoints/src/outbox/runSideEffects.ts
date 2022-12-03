import { AP } from 'activitypub-core-types';
import { isType } from 'activitypub-core-utilities';
import { OutboxPostEndpoint } from '.';

export async function runSideEffects(this: OutboxPostEndpoint) {
  if (isType(this.activity, AP.ActivityTypes.CREATE)) {
    await this.handleCreate();
  }

  if (isType(this.activity, AP.ActivityTypes.DELETE)) {
    await this.handleDelete();
  }

  if (isType(this.activity, AP.ActivityTypes.ACCEPT)) {
    await this.handleAccept();
  }

  if (isType(this.activity, AP.ActivityTypes.BLOCK)) {
    await this.handleBlock();
  }

  if (isType(this.activity, AP.ActivityTypes.UPDATE)) {
    await this.handleUpdate();
  }

  if (isType(this.activity, AP.ActivityTypes.LIKE)) {
    await this.handleLike();
  }

  if (isType(this.activity, AP.ActivityTypes.ANNOUNCE)) {
    await this.handleAnnounce();
  }

  if (isType(this.activity, AP.ActivityTypes.ADD)) {
    await this.handleAdd();
  }

  if (isType(this.activity, AP.ActivityTypes.REMOVE)) {
    await this.handleRemove();
  }

  if (isType(this.activity, AP.ActivityTypes.UNDO)) {
    await this.handleUndo();
  }
}
