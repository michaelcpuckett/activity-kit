import * as AP from '@activity-kit/types';

import { CoreLibrary } from './adapters';

export async function getPrivateKey(this: CoreLibrary, actor: AP.Actor) {
  if (!actor.preferredUsername) {
    throw new Error('Actor has no `preferredUsername`.');
  }

  const userId = await this.findStringIdByValue(
    'username',
    actor.preferredUsername,
  );

  const privateKey = await this.findStringValueById('privateKey', userId);

  if (!privateKey) {
    throw new Error('Private key not found for this Actor.');
  }

  return privateKey;
}
