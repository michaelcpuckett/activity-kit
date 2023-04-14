import { getCollectionNameByUrl } from 'activitypub-core-utilities';
import { MongoDbAdapter } from '.';
import { AP } from 'activitypub-core-types';

export async function queryById(
  this: MongoDbAdapter,
  id: URL,
): Promise<AP.Entity | null> {
  return getCollectionNameByUrl(id) !== 'foreignEntity'
    ? await this.findEntityById(id)
    : await this.fetchEntityById(id);
}
