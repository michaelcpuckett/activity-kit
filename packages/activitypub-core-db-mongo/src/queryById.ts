import { MongoDbAdapter } from '.';
import { AP } from 'activitypub-core-types';

export async function queryById(
  this: MongoDbAdapter,
  id: URL,
): Promise<AP.Entity | null> {
  try {
    return (await this.findEntityById(id)) ?? (await this.fetchEntityById(id));
  } catch (error: unknown) {
    throw new Error(String(error));
  }
}
