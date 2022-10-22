import cookie from 'cookie';
import { OutboxPostHandler } from '.';

export async function authenticateActor(this: OutboxPostHandler) {
  const cookies = cookie.parse(this.req.headers.cookie ?? '');

  const actor = await this.databaseService.getActorByUserId(
    await this.authenticationService.getUserIdByToken(cookies.__session ?? ''),
  );

  if (!actor || actor.id.toString() !== this.actor.id.toString()) {
    throw new Error('Not authorized.');
  }
}
