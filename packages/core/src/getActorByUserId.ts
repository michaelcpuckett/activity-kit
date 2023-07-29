import * as AP from '@activity-kit/types';
import { guard } from '@activity-kit/type-utilities';

import { CoreLibrary } from './adapters';

export async function getActorByUserId(
  this: CoreLibrary,
  userId: string,
): Promise<AP.Actor | null> {
  const preferredUsername = await this.findStringValueById('username', userId);

  const user = await this.findOne('entity', { preferredUsername });

  if (!guard.isApActor(user)) {
    return null;
  }

  return user;
}
