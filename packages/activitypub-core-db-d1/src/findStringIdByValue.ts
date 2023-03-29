import { D1DbAdapter } from '.';

export async function findStringIdByValue(
  this: D1DbAdapter,
  dbCollection: string,
  value: string,
): Promise<string> {
  const one = await this.db
    .prepare(`SELECT * FROM ${dbCollection} WHERE value = ?;`)
    .bind(value)
    .first();

  if (!one) {
    return '';
  }

  if (
    typeof one !== 'object' ||
    !('_id' in one) ||
    typeof one._id !== 'string'
  ) {
    return '';
  }

  return one._id;
}
