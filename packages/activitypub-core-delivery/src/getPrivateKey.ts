import { DeliveryService } from '.';
import { AP } from 'activitypub-core-types';

export async function getPrivateKey(this: DeliveryService, actor: AP.Actor) {
  if (!actor.preferredUsername) {
    throw new Error('Actor has no `preferredUsername`.');
  }

  const userId = await this.databaseService.findStringIdByValue(
    'username',
    actor.preferredUsername,
  );

  const privateKey = await this.databaseService.findStringValueById(
    'private-key',
    userId,
  );

  if (!privateKey) {
    throw new Error('Private key not found for this Actor.');
  }

  return privateKey;
}
