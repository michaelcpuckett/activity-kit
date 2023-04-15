import { DataLayer } from '.';
import { AP } from 'activitypub-core-types';

export async function queryById(
  this: DataLayer,
  id: URL,
): Promise<AP.Entity | null> {
  return (await this.findEntityById(id)) ?? (await this.fetchEntityById(id));
}
