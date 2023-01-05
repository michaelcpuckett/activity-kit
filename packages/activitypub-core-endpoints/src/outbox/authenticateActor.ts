import { assertExists, assertIsApActor } from 'activitypub-core-types';
import { getId } from 'activitypub-core-utilities';
import cookie from 'cookie';
import { OutboxPostEndpoint } from '.';

export async function authenticateActor(this: OutboxPostEndpoint) {
  const cookies = cookie.parse(this.req.headers.cookie ?? '');

  const authenticatedActor = await this.adapters.db.getActorByUserId(
    await this.adapters.auth.getUserIdByToken(cookies.__session ?? ''),
  );

  assertIsApActor(authenticatedActor);

  const authenticatedActorId = getId(authenticatedActor);

  assertExists(authenticatedActorId);

  if (authenticatedActorId.toString() !== this.actor.id.toString()) {
    throw new Error('Not authorized.');
  }
}
