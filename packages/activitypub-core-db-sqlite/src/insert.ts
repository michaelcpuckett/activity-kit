import { SqliteDbAdapter } from '.';
import { getCollectionNameByUrl } from 'activitypub-core-utilities';

export async function insertOrderedItem(
  this: SqliteDbAdapter,
  path: URL,
  url: URL,
) {
  const collectionName = getCollectionNameByUrl(path);
  const currentRecord = await this.db.get<{
    totalItems: number;
    orderedItems: string[];
  }>(`SELECT * FROM ${collectionName} WHERE _id = ?;`, path.toString());

  await this.db.run(
    `UPDATE ${collectionName} WHERE _id = ${path.toString()} VALUES (?);`,
    {
      ...currentRecord,
      totalItems: currentRecord.totalItems + 1,
      orderedItems: [url.toString(), ...currentRecord.orderedItems],
    },
  );
}

export async function removeOrderedItem(
  this: SqliteDbAdapter,
  path: URL,
  url: URL,
) {
  const collectionName = getCollectionNameByUrl(path);

  const currentRecord = await this.db.get<{
    totalItems: number;
    items: string[];
  }>(`SELECT * FROM ${collectionName} WHERE _id = ?;`, path.toString());

  if (!currentRecord.items.includes(url.toString())) {
    return;
  }

  await this.db.run(
    `UPDATE ${collectionName} WHERE _id = ${path.toString()} VALUES (?);`,
    {
      ...currentRecord,
      totalItems: currentRecord.totalItems - 1,
      items: currentRecord.items.filter(
        (item: string) => item !== url.toString(),
      ),
    },
  );
}

export async function insertItem(this: SqliteDbAdapter, path: URL, url: URL) {
  const collectionName = getCollectionNameByUrl(path);
  const currentRecord = await this.db.get<{
    totalItems: number;
    items: string[];
  }>(`SELECT * FROM ${collectionName} WHERE _id = ?;`, path.toString());

  await this.db.run(
    `UPDATE ${collectionName} WHERE _id = ${path.toString()} VALUES (?);`,
    {
      ...currentRecord,
      totalItems: currentRecord.totalItems + 1,
      items: [url.toString(), ...currentRecord.items],
    },
  );
}

export async function removeItem(this: SqliteDbAdapter, path: URL, url: URL) {
  const collectionName = getCollectionNameByUrl(path);

  const currentRecord = await this.db.get<{
    totalItems: number;
    items: string[];
  }>(`SELECT * FROM ${collectionName} WHERE _id = ?;`, path.toString());

  if (!currentRecord.items.includes(url.toString())) {
    return;
  }

  await this.db.run(
    `UPDATE ${collectionName} WHERE _id = ${path.toString()} VALUES (?);`,
    {
      ...currentRecord,
      totalItems: currentRecord.totalItems - 1,
      items: currentRecord.items.filter(
        (item: string) => item !== url.toString(),
      ),
    },
  );
}
