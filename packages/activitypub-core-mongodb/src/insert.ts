import { MongoDatabaseAdapterDb } from '.';
import { getCollectionNameByUrl } from 'activitypub-core-utilities';

export async function insertOrderedItem(
  this: MongoDatabaseAdapterDb,
  path: URL,
  url: URL,
) {
  const collectionName = getCollectionNameByUrl(path);
  await this.db.collection(collectionName).updateOne(
    {
      _id: path.toString(),
    },
    {
      $inc: {
        totalItems: 1,
      },
      $push: {
        orderedItems: {
          $each: [url.toString()],
          $position: 0,
        },
      },
    },
    {
      upsert: true,
    },
  );
}

export async function removeOrderedItem(
  this: MongoDatabaseAdapterDb,
  path: URL,
  url: URL,
) {
  const collectionName = getCollectionNameByUrl(path);
  await this.db.collection(collectionName).updateOne(
    {
      _id: path.toString(),
    },
    {
      $inc: {
        totalItems: -1,
      },
      $pull: {
        orderedItems: url.toString(),
      },
    },
    {
      upsert: true,
    },
  );
}

export async function insertItem(this: MongoDatabaseAdapterDb, path: URL, url: URL) {
  const collectionName = getCollectionNameByUrl(path);
  await this.db.collection(collectionName).updateOne(
    {
      _id: path.toString(),
    },
    {
      $inc: {
        totalItems: 1,
      },
      $push: {
        items: {
          $each: [url.toString()],
        },
      },
    },
    {
      upsert: true,
    },
  );
}

export async function removeItem(this: MongoDatabaseAdapterDb, path: URL, url: URL) {
  const collectionName = getCollectionNameByUrl(path);
  await this.db.collection(collectionName).updateOne(
    {
      _id: path.toString(),
    },
    {
      $inc: {
        totalItems: -1,
      },
      $pull: {
        items: url.toString(),
      },
    },
    {
      upsert: true,
    },
  );
}
