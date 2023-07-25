import * as AP from '@activity-kit/types';
import { guard } from '@activity-kit/type-utilities';
import { OutboxPostEndpoint } from '.';

export async function runSideEffects(this: OutboxPostEndpoint) {
  if (guard.isApType<AP.Create>(this.activity, AP.ActivityTypes.CREATE)) {
    await this.handleCreate(this.activity);
  }

  if (guard.isApType<AP.Delete>(this.activity, AP.ActivityTypes.DELETE)) {
    await this.handleDelete(this.activity);
  }

  if (guard.isApType<AP.Accept>(this.activity, AP.ActivityTypes.ACCEPT)) {
    await this.handleAccept(this.activity);
  }

  if (guard.isApType<AP.Block>(this.activity, AP.ActivityTypes.BLOCK)) {
    await this.handleBlock(this.activity);
  }

  if (guard.isApType<AP.Update>(this.activity, AP.ActivityTypes.UPDATE)) {
    await this.handleUpdate(this.activity);
  }

  if (guard.isApType<AP.Like>(this.activity, AP.ActivityTypes.LIKE)) {
    await this.handleLike(this.activity);
  }

  if (guard.isApType<AP.Announce>(this.activity, AP.ActivityTypes.ANNOUNCE)) {
    await this.handleAnnounce(this.activity);
  }

  if (guard.isApType<AP.Add>(this.activity, AP.ActivityTypes.ADD)) {
    await this.handleAdd(this.activity);
  }

  if (guard.isApType<AP.Remove>(this.activity, AP.ActivityTypes.REMOVE)) {
    await this.handleRemove(this.activity);
  }

  if (guard.isApType<AP.Follow>(this.activity, AP.ActivityTypes.FOLLOW)) {
    await this.handleFollow(this.activity);
  }

  if (guard.isApType<AP.Undo>(this.activity, AP.ActivityTypes.UNDO)) {
    await this.handleUndo(this.activity);
  }
}
