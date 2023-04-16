import { MongoDbAdapter } from '.';
import { Db } from 'mongodb';

export async function findStringIdByValue(
  this: MongoDbAdapter,
  dbCollection: string,
  value: string,
): Promise<string> {
  if (!(this.db instanceof Db)) {
    throw new Error('Bad database.');
  }
  const one = await this.db.collection(dbCollection).findOne({ value });

  if (!one) {
    return '';
  }

  if (!('_id' in one) || typeof one._id !== 'string') {
    return '';
  }

  return one._id;
}
