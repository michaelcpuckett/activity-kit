import { SqliteDbAdapter } from '.';

export async function saveString(
  this: SqliteDbAdapter,
  dbCollection: string,
  _id: string,
  value: string,
) {
  const existingRecord = await this.db.get(
    `SELECT * from ${dbCollection} WHERE _id = ?;`,
    _id,
  );

  if (existingRecord) {
    await this.db.run(
      `UPDATE ${dbCollection} SET value = ? WHERE _id = ${_id};`,
      value,
    );
  } else {
    await this.db.run(
      `INSERT INTO ${dbCollection} ("_id", "value") VALUES (?, ?);`,
      Object.values({
        _id,
        value,
      }),
    );
  }
}
