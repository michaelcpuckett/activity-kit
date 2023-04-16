import { Core } from '.';
import { AP } from '@activity-kit/types';

export async function getPrivateKey(this: Core, actor: AP.Actor) {
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
