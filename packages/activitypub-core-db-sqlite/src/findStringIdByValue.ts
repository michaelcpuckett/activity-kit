import { SqliteDbAdapter } from '.';

export async function findStringIdByValue(
  this: SqliteDbAdapter,
  dbCollection: string,
  value: string,
): Promise<string> {
  const one = await this.db.get(
    `SELECT * FROM ${dbCollection} WHERE value = "${value}";`,
  );

  if (!one) {
    return '';
  }

  if (!('_id' in one) || typeof one._id !== 'string') {
    return '';
  }

  return one._id;
}
