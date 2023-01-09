import { AP } from 'activitypub-core-types';
import { getId } from 'activitypub-core-utilities';
import { InboxPostEndpoint } from '.';

export async function isBlocked(this: InboxPostEndpoint, actor: AP.Actor): Promise<boolean> {
  if (!('actor' in this.activity)) {
    return;
  }

  const streams = await Promise.all(actor.streams.map(async stream => await this.adapters.db.queryById(stream)));

  const blocks = streams.find((stream: AP.Collection) => {
    if (stream.name === 'Blocks') {
      return true;
    }
  });

  if (!blocks) {
    return false;
  }

  const blockedItems = blocks.items ? Array.isArray(blocks.items) ? blocks.items : [blocks.items] : [];
  const blockedActors = await Promise.all(blockedItems.map(async (id: URL) => (await this.adapters.db.queryById(id))?.object));
  const potentiallyBlockedActorId = getId(this.activity.actor);
  
  return blockedActors.map(id => id.toString()).includes(potentiallyBlockedActorId.toString());
}