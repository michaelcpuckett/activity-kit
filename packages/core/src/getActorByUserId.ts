import { Core } from '.';
import * as AP from '@activity-kit/types';

export async function getActorByUserId(
  this: Core,
  userId: string,
): Promise<AP.Actor | null> {
  if (!userId) {
    return null;
  }

  const preferredUsername = await this.findStringValueById('username', userId);

  const user = await this.findOne('entity', { preferredUsername });

  if (user && 'preferredUsername' in user) {
    return user;
  }

  return null;
}
