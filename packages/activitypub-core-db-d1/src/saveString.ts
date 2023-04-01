import { D1DbAdapter } from '.';
import { D1Database } from '@cloudflare/workers-types';

export async function saveString(
  this: D1DbAdapter,
  dbCollection: string,
  _id: string,
  value: string,
) {
  if (!(this.db instanceof D1Database)) {
    throw new Error('Bad database type.');
  }

  const existingRecord = await this.db
    .prepare(`SELECT * from ${dbCollection} WHERE _id = ?;`)
    .bind(_id)
    .first();

  if (existingRecord) {
    await this.db
      .prepare(`UPDATE ${dbCollection} SET value = ? WHERE _id = ?;`)
      .bind([value, _id])
      .run();
  } else {
    await this.db
      .prepare(`INSERT INTO ${dbCollection} ("_id", "value") VALUES (?, ?);`)
      .bind([_id, value])
      .run();
  }
}
