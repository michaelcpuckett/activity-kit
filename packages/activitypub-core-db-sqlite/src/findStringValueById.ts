import { SqliteDbAdapter } from '.';

export async function findStringValueById(
  this: SqliteDbAdapter,
  dbCollection: string,
  _id: string,
): Promise<string> {
  const one = await this.db.get(
    `SELECT * FROM ${dbCollection} WHERE _id = ${_id};`,
  );

  if (!one) {
    return '';
  }

  if (!('value' in one) || typeof one.value !== 'string') {
    return '';
  }

  return one.value;
}
