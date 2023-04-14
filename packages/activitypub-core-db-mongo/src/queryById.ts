import { getCollectionNameByUrl } from 'activitypub-core-utilities';
import { MongoDbAdapter } from '.';
import { AP } from 'activitypub-core-types';

export async function queryById(
  this: MongoDbAdapter,
  id: URL,
): Promise<AP.Entity | null> {
  if (getCollectionNameByUrl(id) !== 'foreignEntity') {
    return await this.findEntityById(id);
  } else {
    return (await this.fetchEntityById(id)) ?? (await this.findEntityById(id));
  }
}
