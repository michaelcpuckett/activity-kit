import { MongoDbAdapter } from '.';

export async function saveString(
  this: MongoDbAdapter,
  dbCollection: string,
  _id: string,
  value: string,
): Promise<void> {
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
