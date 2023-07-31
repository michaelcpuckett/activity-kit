import * as AP from '@activity-kit/types';

import { CoreLibrary } from '..';

/**
 * Get the private key of an Actor.
 *
 * @returns The private key as a string.
 */
export async function getPrivateKey(
  this: CoreLibrary,
  actor: AP.Actor,
): Promise<string> {
  if (!actor.preferredUsername) {
    return '';
  }

  const userId = await this.findStringIdByValue(
    'username',
    actor.preferredUsername,
  );

  if (!userId) {
    return '';
  }

  return await this.findStringValueById('privateKey', userId);
}
