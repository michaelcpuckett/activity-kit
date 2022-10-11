import { DeliveryService } from '.';
import { AP } from 'activitypub-core-types';

export async function getPrivateKey(this: DeliveryService, actor: AP.Actor) {
  if (!actor.preferredUsername) {
    throw new Error('Bad actor');
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
    throw new Error("User's private key not found.");
  }

  return privateKey;
}
