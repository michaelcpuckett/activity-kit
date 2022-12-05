import { AP, Plugin } from 'activitypub-core-types';
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

  actor: AP.Actor | null = null;
  actors: AP.Actor[] = [];
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

  private async isBlocked(): Promise<boolean> {
    if (!('actor' in this.activity)) {
      return;
    }

    const streams = await Promise.all(this.actor.streams.map(async stream => await this.adapters.db.fetchEntityById(stream)));

    const blocked = streams.find((stream: AP.Collection) => {
      if (stream.name === 'Blocked') {
        return true;
      }
    });

    if (!blocked) {
      return false;
    }

    const potentiallyBlockedActorId = getId(this.activity.actor);

    return blocked.items.map((id: URL) => id.toString()).includes(potentiallyBlockedActorId.toString());
  }

  public async respond() {
    try {
      await this.parseBody();

      const existingActivity = await this.adapters.db.findEntityById(getId(this.activity));

      if (existingActivity) {
        console.log('We have already received this activity. Assuming it was forwarded by another server.');
        this.res.statusCode = 200;
        this.res.end();
        return;
      }

      await this.getActors();

      for (const actor of this.actors) {
        this.actor = actor;
        const isBlocked = await this.isBlocked();

        if (isBlocked) {
          console.log('BLOCKED!');
          continue;
        }

        await this.runSideEffects();
        console.log(this.activity);
        console.log('inserting', actor.inbox, getId(actor.inbox), getId(this.activity));
        await this.adapters.db.insertOrderedItem(
          actor.inbox,
          getId(this.activity),
        );
      }

      await this.adapters.db.saveEntity(this.activity);
      await this.broadcastActivity();

      this.res.statusCode = 200;
      this.res.write(stringify(this.activity));
      this.res.end();
    } catch (error: unknown) {
      console.log(error);

      this.res.statusCode = 500;
      this.res.write(String(error));
      this.res.end();
    }
  }
}
