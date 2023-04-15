import cookie from 'cookie';
import { UploadMediaPostEndpoint } from '.';

export async function authenticateActor(this: UploadMediaPostEndpoint) {
  const cookies = cookie.parse(this.req.headers.cookie ?? '');

  const actor = await this.layers.data.getActorByUserId(
    await this.layers.auth.getUserIdByToken(cookies.__session ?? ''),
  );

  if (!actor || actor.id.toString() !== this.actor?.id?.toString()) {
    throw new Error('Not authorized.');
  }
}
