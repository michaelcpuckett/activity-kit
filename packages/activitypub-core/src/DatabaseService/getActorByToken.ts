import { DatabaseService } from '.';
import { AP } from 'activitypub-core-types';
import { ServiceAccount } from 'firebase-admin';

export async function getActorByToken(
  this: DatabaseService,
  token: string,
  credentials: ServiceAccount,
): Promise<AP.Actor | null> {
  const userId = await this.getAuthenticatedUserIdByToken(token, credentials);

  if (!userId) {
    return null;
  }

  const preferredUsername = await this.findStringValueById('username', userId);

  const user = await this.findOne('actor', { preferredUsername });

  if (user && 'preferredUsername' in user) {
    return user;
  }

  return null;
}
