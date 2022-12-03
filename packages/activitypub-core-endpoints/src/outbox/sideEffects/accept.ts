import { OutboxPostEndpoint } from '..';
import { AP } from 'activitypub-core-types';
import { ACTIVITYSTREAMS_CONTEXT, isTypeOf } from 'activitypub-core-utilities';
import { LOCAL_DOMAIN } from 'activitypub-core-utilities';
import { getId, getGuid } from 'activitypub-core-utilities';

/**
 * Create
 * [x] Merges audience properties (to, bto, cc, bcc, audience) with the Create’s
 *    object’s audience properties (outbox:create:merges-audience-properties)
 *    SHOULD
 * [x] Create’s actor property is copied to be the value of .object.attributedTo
 *    (outbox:create:actor-to-attributed-to) SHOULD
 */

export async function handleAccept(this: OutboxPostEndpoint) {
  if (!(this.activity && 'object' in this.activity && 'actor' in this.activity)) {
    throw new Error('Bad activity: no object.');
  }

  const actorId = getId(this.activity.actor);
  const actor = await this.adapters.db.queryById(actorId);
  const followersId = getId(actor.followers);
  const followActivityId = getId(this.activity.object);
  const followActivity = await this.adapters.db.queryById(followActivityId);
  const followerId = getId(followActivity.actor);
  
  if (
    !('streams' in actor) ||
    !actor.streams ||
    !Array.isArray(actor.streams)
  ) {
    throw new Error("Actor's streams not found.");
  }

  const streams = await Promise.all(
    actor.streams.map(async (stream: AP.Entity | URL) => await this.adapters.db.findEntityById(getId(stream)))
  );

  const requests = streams.find((stream) => {
    if (stream && 'name' in stream) {
      if (stream.name === 'Requests') {
        return true;
      }
    }
  });

  if (!requests || !requests.id) {
    throw new Error('Bad requests collection: not found.');
  }

  const requestsId = getId(requests);

  await Promise.all([
    this.adapters.db.insertItem(followersId, followerId),
    this.adapters.db.removeItem(requestsId, followActivityId),
  ]);
}