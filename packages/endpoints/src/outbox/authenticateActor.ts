import { assertExists, assertIsApActor } from '@activity-kit/types';
import { getId } from '@activity-kit/utilities';
import cookie from 'cookie';
import { OutboxPostEndpoint } from '.';

export async function authenticateActor(this: OutboxPostEndpoint) {
  const cookies = cookie.parse(this.req.headers.cookie ?? '');
  const userId = await this.core.getUserIdByToken(cookies.__session ?? '');

  try {
    const authenticatedActor = await this.core.getActorByUserId(userId);

    assertIsApActor(authenticatedActor);

    const authenticatedActorId = getId(authenticatedActor);

    assertExists(authenticatedActorId);

    if (authenticatedActorId.toString() !== this.actor.id.toString()) {
      throw new Error('No match.');
    }
  } catch (error) {
    throw new Error('Not authorized.');
  }
}