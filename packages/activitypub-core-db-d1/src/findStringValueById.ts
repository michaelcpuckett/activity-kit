import { D1DbAdapter } from '.';

export async function findStringValueById(
  this: D1DbAdapter,
  dbCollection: string,
  _id: string,
): Promise<string> {
  const one = await this.db
    .prepare(`SELECT * FROM ${dbCollection} WHERE _id = ?;`)
    .bind(_id)
    .first();

  if (!one) {
    return '';
  }

  if (
    typeof one !== 'object' ||
    !('value' in one) ||
    typeof one.value !== 'string'
  ) {
    return '';
  }

  return one.value;
}
