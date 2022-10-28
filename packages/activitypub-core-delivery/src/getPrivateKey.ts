import { DeliveryAdapter } from '.';
import { AP } from 'activitypub-core-types';

export async function getPrivateKey(this: DeliveryAdapter, actor: AP.Actor) {
  if (!actor.preferredUsername) {
    throw new Error('Actor has no `preferredUsername`.');
  }

  const userId = await this.adapters.database.findStringIdByValue(
    'username',
    actor.preferredUsername,
  );

  const privateKey = await this.adapters.database.findStringValueById(
    'private-key',
    userId,
  );

  if (!privateKey) {
    throw new Error('Private key not found for this Actor.');
  }

  return privateKey;
}
