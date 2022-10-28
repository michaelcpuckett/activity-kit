import { MongoDbAdapter } from '.';
import { AP } from 'activitypub-core-types';

export async function getActorByUserId(
  this: MongoDbAdapter,
  userId: string,
): Promise<AP.Actor | null> {
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
