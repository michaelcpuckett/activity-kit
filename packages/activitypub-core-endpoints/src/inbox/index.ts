import { AP, assertIsArray, Plugin } from 'activitypub-core-types';
import type { IncomingMessage, ServerResponse } from 'http';
import type { DbAdapter, AuthAdapter } from 'activitypub-core-types';
import { getActors } from './getActors';
import { parseBody } from './parseBody';
import { runSideEffects } from './runSideEffects';
import { handleAccept } from './sideEffects/accept';
import { handleAnnounce } from './sideEffects/announce';
import { handleFollow } from './sideEffects/follow';
import { handleLike } from './sideEffects/like';
import { handleCreate } from './sideEffects/create';
import { shouldForwardActivity } from './shouldForwardActivity';
import { broadcastActivity } from './broadcastActivity';
import { getId, stringify } from 'activitypub-core-utilities';
import { DeliveryAdapter } from 'activitypub-core-delivery';

export class InboxPostEndpoint {
  req: IncomingMessage;
  res: ServerResponse;
  adapters: {
    auth: AuthAdapter;
    db: DbAdapter;
    delivery: DeliveryAdapter;
  };
  plugins?: Plugin[];

  activity: AP.Entity | null = null;

  constructor(
    req: IncomingMessage,
    res: ServerResponse,
    adapters: {
      auth: AuthAdapter;
      db: DbAdapter;
      delivery: DeliveryAdapter;
    },
    plugins?: Plugin[],
  ) {
    this.req = req;
    this.res = res;
    this.adapters = adapters;
    this.plugins = plugins;
  }

  protected getActors = getActors;
  protected runSideEffects = runSideEffects;
  protected parseBody = parseBody;
  protected broadcastActivity = broadcastActivity;
  protected shouldForwardActivity = shouldForwardActivity;

  protected handleCreate = handleCreate;
  protected handleAccept = handleAccept;
  protected handleAnnounce = handleAnnounce;
  protected handleFollow = handleFollow;
  protected handleLike = handleLike;

  private async isBlocked(actor: AP.Actor): Promise<boolean> {
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

  public async respond() {
    await this.parseBody();

    const activityId = getId(this.activity);

    if (activityId) {
      const existingActivity = await this.adapters.db.findEntityById(getId(this.activity)) ?? await this.adapters.db.findOne('foreign-entity', {
        id: activityId.toString(),
      });

      if (existingActivity) {
        console.log('We have already received this activity. Assuming it was forwarded by another server.');
        this.res.statusCode = 200;
        this.res.end();
        return;
      }
    }

    for (const actor of await this.getActors()) {
      const isBlocked = await this.isBlocked(actor);

      if (isBlocked) {
        console.log('Blocked from appearing in this inbox.');
        continue;
      }

      await this.adapters.db.insertOrderedItem(
        actor.inbox,
        getId(this.activity),
      );
    }

    await this.runSideEffects();
    await this.adapters.db.saveEntity(this.activity);
    await this.broadcastActivity();

    this.res.statusCode = 200;
    this.res.write(stringify(this.activity));
    this.res.end();
  }
}
