import { MongoDbAdapter } from '.';
import { Db } from 'mongodb';

export async function saveString(
  this: MongoDbAdapter,
  dbCollection: string,
  _id: string,
  value: string,
): Promise<void> {
  if (!(this.db instanceof Db)) {
    throw new Error('Bad database.');
  }
  await this.db.collection(dbCollection).replaceOne(
    {
      _id,
    },
    JSON.parse(
      JSON.stringify({
        value,
      }),
    ),
    {
      upsert: true,
    },
  );
}
