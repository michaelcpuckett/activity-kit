import { CoreLibrary } from '.';
import { AP } from 'activitypub-core-types';

export async function queryById(
  this: CoreLibrary,
  id: URL,
): Promise<AP.Entity | null> {
  return (await this.findEntityById(id)) ?? (await this.fetchEntityById(id));
}
