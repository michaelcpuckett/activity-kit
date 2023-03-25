import { SqliteDbAdapter } from '.';
import { AP } from 'activitypub-core-types';

export async function getPrivateKey(this: SqliteDbAdapter, actor: AP.Actor) {
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
