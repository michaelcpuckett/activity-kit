import { SqliteDbAdapter } from '.';
import { AP } from 'activitypub-core-types';

export async function queryById(
  this: SqliteDbAdapter,
  id: URL,
): Promise<AP.Entity | null> {
  return (await this.findEntityById(id)) ?? (await this.fetchEntityById(id));
}
