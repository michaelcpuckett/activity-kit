import { MongoDatabaseAdapterDb } from '.';

export async function findStringValueById(
  this: MongoDatabaseAdapterDb,
  dbCollection: string,
  _id: string,
): Promise<string> {
  const one = await this.db.collection(dbCollection).findOne({ _id });

  if (!one) {
    return '';
  }

  if (!('value' in one) || typeof one.value !== 'string') {
    return '';
  }

  return one.value;
}
