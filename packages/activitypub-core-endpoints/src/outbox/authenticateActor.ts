import cookie from 'cookie';
import { OutboxPostEndpoint } from '.';

export async function authenticateActor(this: OutboxPostEndpoint) {
  const cookies = cookie.parse(this.req.headers.cookie ?? '');

  const actor = await this.adapters.db.getActorByUserId(
    await this.adapters.auth.getUserIdByToken(cookies.__session ?? ''),
  );

  if (!actor || actor.id.toString() !== this.actor.id.toString()) {
    throw new Error('Not authorized.');
  }
}
