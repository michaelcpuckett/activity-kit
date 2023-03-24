import { SqliteDbAdapter } from '.';
import { AP } from 'activitypub-core-types';
import {
  applyContext,
  cleanProps,
  convertUrlsToStrings,
  getCollectionNameByUrl,
} from 'activitypub-core-utilities';

export async function saveEntity(this: SqliteDbAdapter, entity: AP.Entity) {
  if (!entity.id) {
    throw new Error('No ID.');
  }

  const collectionName = getCollectionNameByUrl(entity.id);
  const _id = entity.id.toString();
  const convertedEntity = cleanProps(
    convertUrlsToStrings(applyContext(entity)),
  );

  const existingRecord = await this.db.get(
    `SELECT * from ${collectionName} WHERE _id = ?;`,
    _id,
  );

  if (existingRecord) {
    return await this.db.run(
      `UPDATE ${collectionName} WHERE _id = ${_id} VALUES (?);`,
      convertedEntity,
    );
  } else {
    return await this.db.run(`INSERT INTO ${collectionName} VALUES (?);`, {
      _id,
      ...convertedEntity,
    });
  }
}
