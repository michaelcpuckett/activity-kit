import { D1DbAdapter } from '.';
import { AP } from 'activitypub-core-types';

export async function queryById(
  this: D1DbAdapter,
  id: URL,
): Promise<AP.Entity | null> {
  return (await this.findEntityById(id)) ?? (await this.fetchEntityById(id));
}
